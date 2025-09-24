import { supabase } from '../lib/supabase.ts'
import { getSpainDateFromUTC } from '../bot/utils.ts'
import { getDateRangeForPeriod } from '../lib/timezones.ts'
import { Result, SBGameRecord, RankingEntry, lang } from '../interfaces.ts'
import { createPlayerIfNotExist } from './players.ts'
import { supalog } from './log.ts'

export async function getChatPunctuations(
    chatId: number,
    period: 'all' | 'month' | 'day',
    lang: lang,
    userId?: number
): Promise<SBGameRecord[]> {
    const dateRange = getDateRangeForPeriod(period)

    try {
        const { data, error } = userId
            ? await supabase
                  .from('games_chats')
                  .select(
                      'user_id, users(name), character_id, characters(name), punctuation, time, created_at'
                  )
                  .eq('chat_id', chatId)
                  .eq('user_id', userId)
                  .eq('lang', lang)
                  .gte('created_at', dateRange.from)
                  .lte('created_at', dateRange.to)
                  .order('punctuation', { ascending: false })
                  .order('time', { ascending: true })
            : await supabase
                  .from('games_chats')
                  .select(
                      'user_id, users(name), character_id, characters(name), punctuation, time, created_at'
                  )
                  .eq('chat_id', chatId)
                  .eq('lang', lang)
                  .gte('created_at', dateRange.from)
                  .lte('created_at', dateRange.to)
                  .order('punctuation', { ascending: false })
                  .order('time', { ascending: true })

        if (error) throw error

        // SUPABASE BUG #01 - Selecting foreign keys expect an array of objects, but it is really returning a simple object
        return data as unknown as SBGameRecord[]
    } catch (error) {
        console.error('Error getting chat punctuations', error)
        return []
    }
}

export async function getChatRanking(
    chatId: number,
    period: 'all' | 'month' | 'day',
    lang: lang,
    userId?: number,
    timetrial?: boolean
) {
    const records = await getChatPunctuations(chatId, period, lang, userId)
    return getCleanedRanking(records, timetrial)
}

export async function createRecord({
    chatId,
    userId,
    userName,
    characterId,
    points,
    time,
    lang,
}: {
    chatId: number
    userId?: number
    userName?: string
    characterId?: number
    points: number
    time: number
    lang: lang
}) {
    if (userId)
        supalog.info(
            'User sent a game',
            `Player ${userId}, ${userName} played on chat ${chatId} for +${points} points in ${time} seconds with ${lang} bot`,
            lang
        )

    if (userId && userName) await createPlayerIfNotExist(userId, userName)

    try {
        const { error } = await supabase.from('games_chats').insert([
            {
                chat_id: chatId,
                user_id: userId || null,
                character_id: characterId || null,
                punctuation: points,
                time,
                lang: lang,
            },
        ])

        if (error) throw error
    } catch (error) {
        console.error('Error inserting new game', error)
    }
}

export async function getChats(lang: lang): Promise<number[]> {
    try {
        const { data, error } = await supabase.rpc('get_unique_chat_ids', {
            lang_param: lang,
        })

        if (error) throw error

        return data
    } catch (error) {
        console.error('Error getting unique chats', error)
        return []
    }
}

export async function getTopPlayersGlobal(
    lang: lang,
    timetrial: boolean
): Promise<Result[]> {
    const dateRange = getDateRangeForPeriod('month')

    try {
        const { data, error } = await supabase
            .from('games_chats')
            .select('user_id, users(name), punctuation, time, created_at')
            .eq('lang', lang)
            .is('character_id', null)
            .gte('created_at', dateRange.from)
            .lte('created_at', dateRange.to)

        if (error) throw error

        // SUPABASE BUG #01
        const ranking = getCleanedRanking(
            (data as unknown as SBGameRecord[]) || [],
            timetrial
        )
        return ranking.slice(0, 10)
    } catch (error) {
        console.error('Error getting top players globally', error)
        return []
    }
}

export function getCleanedRanking(
    records: SBGameRecord[],
    timetrial: boolean = false
): RankingEntry[] {
    const userPoints: Record<
        string,
        {
            id: number
            name: string
            total: number
            averageTime: number // Will store average time (in seconds) after processing
            _sumTime: number // Internal accumulator for total time
            _count: number // Internal counter of valid records (unique Spain dates)
        }
    > = {}
    const processedUserDates: Record<string, Set<string>> = {}

    for (const record of records) {
        const userId = record.user_id || record.character_id
        const userName = record.users?.name || record.characters?.name
        const points = record.punctuation
        const time = record.time ?? 0
        const recordInSpain = getSpainDateFromUTC(record.created_at)

        if (!userId || !userName) return []

        // Initialize user entry if it doesn't exist
        if (!userPoints[userId]) {
            userPoints[userId] = {
                id: userId,
                name: userName,
                total: 0,
                averageTime: 0,
                _sumTime: 0,
                _count: 0,
            }
            processedUserDates[userId] = new Set()
        }

        const spainDateString = recordInSpain.toISOString().split('T')[0]
        
        // Only count this record if we haven't seen this Spain date for this user yet
        if (!processedUserDates[userId].has(spainDateString)) {
            userPoints[userId].total += points
            userPoints[userId]._sumTime += time
            userPoints[userId]._count += 1
            processedUserDates[userId].add(spainDateString)
        }
    }

    // Compute average time (seconds) per user and expose it via averageTime
    const usersWithAverages: RankingEntry[] = Object.values(userPoints).map((u) => {
        const avg = u._count > 0 ? Math.round(u._sumTime / u._count) : 0
        return {
            id: u.id,
            name: u.name,
            total: u.total,
            averageTime: avg,
        }
    })

    // Filter out users who haven't played every day of the current month up to today (Spain time)
    const todaySpain = getSpainDateFromUTC(new Date().toISOString())
    const requiredDays = todaySpain.getDate()
    const fullyPlayed = usersWithAverages.filter((entry) => {
        const datesCount = processedUserDates[String(entry.id)]?.size || 0
        return datesCount === requiredDays && requiredDays > 0
    })

    // Sort based on timetrial mode using average time
    const ranking: RankingEntry[] = fullyPlayed.sort((a, b) => {
        if (timetrial) {
            // In timetrial mode: sort by average time first, then by points
            if ((a.averageTime || 0) !== (b.averageTime || 0))
                return (a.averageTime || 0) - (b.averageTime || 0)
            return b.total - a.total
        } else {
            // Normal mode: sort by points first, then by average time
            if (b.total !== a.total) return b.total - a.total
            return (a.averageTime || 0) - (b.averageTime || 0)
        }
    })

    // When not timetrial, omit averageTime in the returned objects to keep payload minimal
    if (!timetrial) {
        return ranking.map(({ id, name, total }) => ({ id, name, total }))
    }

    return ranking
}
