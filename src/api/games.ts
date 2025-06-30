const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_GAMES')}`

import { supabase } from '../lib/supabase.ts'
import {
  AirtableRecord,
  AirtableResponse,
  PuntuacioFields,
  SBCharacter,
  User,
} from '../interfaces.ts'
import { getSpainDateFromUTC } from '../bot/utils.ts'

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'month' | 'day',
  userId: number | null = null
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const allRecords: AirtableRecord<PuntuacioFields>[] = []
  let offset: string | null = null

  do {
    const params = new URLSearchParams({
      filterByFormula: userId
        ? `AND({ID Xat} = ${chatId}, {ID Usuari} = ${userId})`
        : `{ID Xat} = ${chatId}`,
      view: Deno.env.get('TABLE_GAMES')!,
    })

    if (offset) params.set('offset', offset)

    const res = await fetch(`${airtableUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  // Filter records by period
  let filteredRecords = allRecords
  if (period !== 'all') {
    filteredRecords = filterRecordsByPeriod(allRecords, period)
  }

  // Sort results by score (descending)
  const sortedResults = [...filteredRecords].sort(
    (a, b) => b.fields['Puntuació'] - a.fields['Puntuació']
  )

  return sortedResults
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
  user: SBCharacter | User,
  points: number
) {
  try {
    const { error } = await supabase.from('games_chats').insert([
      {
        chat_id: chatId,
        user_id: user.id,
        punctuation: points,
        game: 'elmot',
      },
    ])

    if (error) throw error
  } catch (error) {
    console.error('Error inserting new game', error)
  }

  // TODO - Borrar quan estigui tot a supabase
  const fields = {
    'ID Xat': chatId,
    'ID Usuari': user.id,
    'Nom Usuari': user.name,
    Puntuació: points,
    Joc: 'elmot',
    Data: new Date().toISOString(),
  }

  const res = await fetch(airtableUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields,
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error('Error creant el registre:', await res.text())
    return
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

function filterRecordsByPeriod(
  records: AirtableRecord<PuntuacioFields>[],
  period: 'month' | 'day'
): AirtableRecord<PuntuacioFields>[] {
  const spainTime = getSpainDateFromUTC(new Date().toISOString())

  return records.filter((record) => {
    const recordInSpain = getSpainDateFromUTC(record.fields.Data)

    if (period === 'day') {
      return (
        recordInSpain.getFullYear() === spainTime.getFullYear() &&
        recordInSpain.getMonth() === spainTime.getMonth() &&
        recordInSpain.getDate() === spainTime.getDate()
      )
    } else if (period === 'month') {
      return (
        recordInSpain.getFullYear() === spainTime.getFullYear() &&
        recordInSpain.getMonth() === spainTime.getMonth()
      )
    }

    return false
  })
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
