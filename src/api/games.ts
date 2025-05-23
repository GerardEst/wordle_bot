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
  period: 'all' | 'week' | 'month' | 'day',
  userId: number | null = null
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const params = new URLSearchParams({
    filterByFormula: buildFormula(chatId, period, userId),
    view: Deno.env.get('TABLE_GAMES')!,
  })

  const res = await fetch(`${airtableUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  // Sort results by score (descending)
  const sortedResults = [...data.records].sort(
    (a, b) => b.fields['Puntuació'] - a.fields['Puntuació']
  )

  return sortedResults
}

export async function getChatRanking(
  chatId: number,
  period: 'all' | 'week' | 'month' | 'day',
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

function buildFormula(
  chatId: number,
  period: 'all' | 'week' | 'month' | 'day',
  userId: number | null
) {
  // Start with conditions array
  const conditions = [`{ID Xat} = ${chatId}`]

  // Add user ID condition if provided
  if (userId) {
    conditions.push(`{ID Usuari} = ${userId}`)
  }

  const now = new Date()

  // For Spain timezone (UTC+1 or UTC+2 depending on DST)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const [year, month, day] = formatter.format(now).split('-')
  const dateStr = `${year}-${month}-${day}` // YYYY-MM-DD

  // Add date condition based on period
  if (period === 'day') {
    conditions.push(`IS_SAME({Data}, DATE("${dateStr}"), "day")`)
  } else if (period === 'week') {
    conditions.push(`IS_SAME({Data}, DATE("${dateStr}"), "week")`)
  } else if (period === 'month') {
    conditions.push(`IS_SAME({Data}, DATE("${dateStr}"), "month")`)
  }

  // Join all conditions with AND
  if (conditions.length === 1) {
    return conditions[0]
  } else {
    return `AND(${conditions.join(', ')})`
  }
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
    const date = record.fields['Data'].split('T')[0]

    // Initialize user entry if it doesn't exist
    if (!userPoints[userId]) {
      userPoints[userId] = {
        id: userId,
        name: userName,
        total: 0,
      }
      processedUserDates[userId] = new Set()
    }

    // Only count this record if we haven't seen this date for this user yet
    if (!processedUserDates[userId].has(date)) {
      userPoints[userId].total += points
      processedUserDates[userId].add(date)
    }
  }

  // Sort points descending
  const ranking = Object.values(userPoints).sort((a, b) => b.total - a.total)

  return ranking
}
