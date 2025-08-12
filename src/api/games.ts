import { supabase } from '../lib/supabase.ts'
import { getSpainDateFromUTC } from '../bot/utils.ts'
import { getDateRangeForPeriod } from '../lib/timezones.ts'
import { Result, SBGameRecord, RankingEntry, lang } from '../interfaces.ts'
import { createPlayerIfNotExist } from './players.ts'

// export async function getAllUniqueGamesOfToday(lang:lang) {
//     try {
//         const { data, error } = await supabase.rpc(
//             'get_all_user_punctuations_from_today',
//             { lang_param: lang }
//         )

//         if (error) throw error

//         return data
//     } catch (error) {
//         console.error('Error getting games', error)
//         return []
//     }
// }

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
        console.log(
            `Player ${userId}, ${userName} played on chat ${chatId} for +${points} points in ${time} seconds with ${lang} bot`
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

export async function getTopPlayersGlobal(): Promise<Result[]> {
    const dateRange = getDateRangeForPeriod('month')

    try {
        const { data, error } = await supabase
            .from('games_chats')
            .select('user_id, users(name), punctuation, time, created_at')
            .is('character_id', null)
            .gte('created_at', dateRange.from)
            .lte('created_at', dateRange.to)

        if (error) throw error

        // SUPABASE BUG #01
        const ranking = getCleanedRanking(
            (data as unknown as SBGameRecord[]) || []
        )
        return ranking.slice(0, 5)
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
        { id: number; name: string; total: number; totalTime: number }
    > = {}
    const processedUserDates: Record<string, Set<string>> = {}

    for (const record of records) {
        const userId = record.user_id || record.character_id
        const userName = record.users?.name || record.characters?.name
        const points = record.punctuation
        const time = record.time
        const recordInSpain = getSpainDateFromUTC(record.created_at)

        if (!userId || !userName) return []

        // Initialize user entry if it doesn't exist
        if (!userPoints[userId]) {
            userPoints[userId] = {
                id: userId,
                name: userName,
                total: 0,
                totalTime: 0,
            }
            processedUserDates[userId] = new Set()
        }

        const spainDateString = recordInSpain.toISOString().split('T')[0]

        // Only count this record if we haven't seen this Spain date for this user yet
        if (!processedUserDates[userId].has(spainDateString)) {
            userPoints[userId].total += points
            userPoints[userId].totalTime += time
            processedUserDates[userId].add(spainDateString)
        }
    }

    // Sort based on timetrial mode
    const ranking = Object.values(userPoints).sort((a, b) => {
        if (timetrial) {
            // In timetrial mode: sort by time first, then by points for tie-breaking
            if (a.totalTime !== b.totalTime) {
                return a.totalTime - b.totalTime
            }
            return b.total - a.total
        } else {
            // Normal mode: sort by points first, then by time for tie-breaking
            if (b.total !== a.total) {
                return b.total - a.total
            }
            return a.totalTime - b.totalTime
        }
    })

    // Remove totalTime from the final result to match RankingEntry interface
    return ranking
}
