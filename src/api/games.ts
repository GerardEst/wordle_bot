const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_GAMES')}`

import { Character } from '../interfaces.ts'

// DB interfaces
export interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

export interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export interface PuntuacioFields {
  'ID Xat': number
  'ID Usuari': number
  'Nom Usuari': string
  Puntuació: number
  Joc: string
  Data: string
}

export interface User {
  id: number
  name: string
}

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'month' | 'day',
  userId: number | null = null
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const params = new URLSearchParams({
    filterByFormula: userId
      ? `AND({ID Xat} = ${chatId}, {ID Usuari} = ${userId})`
      : `{ID Xat} = ${chatId}`,
    view: Deno.env.get('TABLE_GAMES')!,
  })

  const res = await fetch(`${airtableUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  // Filter records by period
  let filteredRecords = data.records
  if (period !== 'all') {
    filteredRecords = filterRecordsByPeriod(data.records, period)
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
  character: Character | User,
  points: number
) {
  const fields = {
    'ID Xat': chatId,
    'ID Usuari': character.id,
    'Nom Usuari': character.name,
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
  const now = new Date()

  // Get current date in Spain timezone using proper offset calculation
  const spainOffset = now.getTimezoneOffset() * 60000 // Convert to milliseconds
  const spainTime = new Date(now.getTime() + spainOffset + 2 * 60 * 60 * 1000) // Add 2 hours for Spain (UTC+2 in summer)

  return records.filter((record) => {
    const recordDate = new Date(record.fields.Data)
    // Convert record date to Spain timezone using the same method
    const recordInSpain = new Date(
      recordDate.getTime() + spainOffset + 2 * 60 * 60 * 1000
    )

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

    // Convert UTC date to Spain date for proper deduplication
    const recordDate = new Date(record.fields.Data)
    const now = new Date()
    const spainOffset = now.getTimezoneOffset() * 60000 // Convert to milliseconds
    const recordInSpain = new Date(
      recordDate.getTime() + spainOffset + 2 * 60 * 60 * 1000
    ) // Add 2 hours for Spain

    // Format as YYYY-MM-DD in Spain timezone
    const spainDateString =
      recordInSpain.getFullYear() +
      '-' +
      String(recordInSpain.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(recordInSpain.getDate()).padStart(2, '0')

    // Initialize user entry if it doesn't exist
    if (!userPoints[userId]) {
      userPoints[userId] = {
        id: userId,
        name: userName,
        total: 0,
      }
      processedUserDates[userId] = new Set()
    }

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
