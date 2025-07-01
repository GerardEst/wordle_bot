const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_GAMES')}`

import { supabase } from '../lib/supabase.ts'
import {
  AirtableRecord,
  AirtableResponse,
  PuntuacioFields,
} from '../interfaces.ts'
import { getSpainDateFromUTC } from '../bot/utils.ts'
import { getDateRangeForPeriod } from '../lib/timezones.ts'

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
          .select('user_id, character_id, punctuation, created_at')
          .eq('chat_id', chatId)
          .eq('user_id', userId)
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      : await supabase
          .from('games_chats')
          .select('user_id, character_id, punctuation, created_at')
          .eq('chat_id', chatId)
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)

    if (error) throw error

    console.log(data)

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

export async function createRecord(
  chatId: number,
  userId: number,
  points: number
) {
  try {
    const { error } = await supabase.from('games_chats').insert([
      {
        chat_id: chatId,
        user_id: userId,
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
  const res = await fetch(airtableUrl, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  return [...new Set(data.records.map((record) => record.fields['ID Xat']))]
}

function getCleanedRanking(records: AirtableRecord<PuntuacioFields>[]) {
  const userPoints: Record<
    string,
    { id: number; name: string; total: number }
  > = {}
  // Keep track of dates already processed for each user
  const processedUserDates: Record<string, Set<string>> = {}

  for (const record of records) {
    const userId = record.fields['ID Usuari']
    const userName = record.fields['Nom Usuari']
    const points = record.fields['Puntuació']
    const recordInSpain = getSpainDateFromUTC(record.fields.Data)

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
