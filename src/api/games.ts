import { supabase } from '../lib/supabase.ts'
import { getDateRangeForPeriod } from '../lib/timezones.ts'
import { lang, PlayerFromGlobal, Result, SBGameRecord } from '../interfaces.ts'
import { createPlayerIfNotExist } from './players.ts'
import { supalog } from './log.ts'
import { dayOfMonth } from '../lib/timezones.ts'
import { ALLOWED_NONPLAYED_DAYS_IN_TIMETRIAL } from '../conf.ts'

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
    if (userId) {
        supalog.info(
            'User sent a game',
            `Player ${userId}, ${userName} played on chat ${chatId} for +${points} points in ${time} seconds with ${lang} bot`,
            lang
        )
    }

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
    timetrial: boolean,
    chatId?: number
): Promise<Result[]> {
    try {
        let query = supabase
            .from('user_game_totals_by_lang')
            .select('user_id, user_name, games_count, total_points, avg_time')
            // en timetrial, volem eliminar tots els que no han jugat totes les partides (amb una mica de marge)
            .gt(
                'games_count',
                timetrial
                    ? dayOfMonth() - ALLOWED_NONPLAYED_DAYS_IN_TIMETRIAL - 1
                    : 0
            )
            // i en general, que hagin jugat alguna partida
            .gt('avg_time', 0)
            .eq('lang', lang)
            .contains('chats_ids', [chatId])
            .limit(10)

        if (timetrial) {
            // Timetrial prioritises the smallest average time
            query = query.order('avg_time', { ascending: true })
        } else {
            // Ranking uses points first and average time as a tiebreaker
            query = query
                .order('total_points', { ascending: false })
                .order('avg_time', { ascending: true })
        }

        if (chatId) {
            query = query.contains('chats_ids', [chatId])
        }

        const { data, error } = await query

        if (error) throw error

        return data.map((player: PlayerFromGlobal) => {
            return {
                id: player.user_id,
                name: player.user_name,
                total: player.total_points,
                totalTime: player.avg_time,
            }
        })
    } catch (error) {
        console.error('Error getting top global players', error)
        return []
    }
}
