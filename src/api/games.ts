import { supabase } from '../lib/supabase.ts'
import { getSpainDateFromUTC } from '../bot/utils.ts'
import { getDateRangeForPeriod } from '../lib/timezones.ts'
import { Result } from '../interfaces.ts'

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'month' | 'day',
  userId: number | null = null
): Promise<any[]> {
  const dateRange = getDateRangeForPeriod(period)

  try {
    const { data, error } = userId
      ? await supabase
          .from('games_chats')
          .select(
            'user_id, users(name), character_id, characters(name), punctuation, created_at'
          )
          .eq('chat_id', chatId)
          .eq('user_id', userId)
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      : await supabase
          .from('games_chats')
          .select(
            'user_id, users(name), character_id, characters(name), punctuation, created_at'
          )
          .eq('chat_id', chatId)
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)

    if (error) throw error

    // Sort results by score (descending)
    const sortedResults = [...(data || [])].sort(
      (a, b) => b.punctuation - a.punctuation
    )

    return sortedResults
  } catch (error) {
    console.error('Error getting chat punctuations', error)
    return []
  }
}

export async function getChatRanking(
  chatId: number,
  period: 'all' | 'month' | 'day',
  userId: number | null = null
) {
  const records = await getChatPunctuations(chatId, period, userId)
  return getCleanedRanking(records)
}

export async function createRecord({
  chatId,
  userId,
  characterId,
  points,
}: {
  chatId: number
  userId?: number
  characterId?: number
  points: number
}) {
  try {
    const { error } = await supabase.from('games_chats').insert([
      {
        chat_id: chatId,
        user_id: userId || null,
        character_id: characterId || null,
        punctuation: points,
        game: 'elmot',
      },
    ])

    if (error) throw error
  } catch (error) {
    console.error('Error inserting new game', error)
  }
}

export async function getChats(): Promise<number[]> {
  try {
    const { data, error } = await supabase.rpc('get_unique_chats')

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
      .select(
        'user_id, users(name), character_id, characters(name), punctuation, created_at'
      )
      .gte('created_at', dateRange.from)
      .lte('created_at', dateRange.to)

    if (error) throw error

    const ranking = getCleanedRanking(data || [])
    return ranking.slice(0, 3)
  } catch (error) {
    console.error('Error getting top players globally', error)
    return []
  }
}

function getCleanedRanking(records: any) {
  const userPoints: Record<
    string,
    { id: number; name: string; total: number }
  > = {}
  // Keep track of dates already processed for each user
  const processedUserDates: Record<string, Set<string>> = {}

  for (const record of records) {
    const userId = record.user_id || record.character_id
    const userName = record.users?.name || record.characters.name
    const points = record.punctuation
    const recordInSpain = getSpainDateFromUTC(record.created_at)

    // Initialize user entry if it doesn't exist
    if (!userPoints[userId]) {
      userPoints[userId] = {
        id: userId,
        name: userName,
        total: 0,
      }
      processedUserDates[userId] = new Set()
    }

    const spainDateString = recordInSpain.toISOString().split('T')[0]

    // Only count this record if we haven't seen this Spain date for this user yet
    if (!processedUserDates[userId].has(spainDateString)) {
      userPoints[userId].total += points
      processedUserDates[userId].add(spainDateString)
    }
  }

  // Sort points descending
  const ranking = Object.values(userPoints).sort((a, b) => b.total - a.total)

  return ranking
}
