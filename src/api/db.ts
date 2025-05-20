const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/Puntuacions`

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

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'week' | 'month' | 'day',
  userId: number | null = null
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const params = new URLSearchParams({
    filterByFormula: buildFormula(chatId, period, userId),
    view: Deno.env.get('AIRTABLE_VIEW')!,
  })

  const res = await fetch(`${airtableUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  return data.records
}

export async function createRecord(fields: Partial<PuntuacioFields>) {
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

  // Add date condition based on period
  if (period === 'day') {
    conditions.push('IS_SAME({Data}, TODAY(), "day")')
  } else if (period === 'week') {
    conditions.push('IS_SAME({Data}, TODAY(), "week")')
  } else if (period === 'month') {
    conditions.push('IS_SAME({Data}, TODAY(), "month")')
  }

  // Join all conditions with AND
  if (conditions.length === 1) {
    return conditions[0]
  } else {
    return `AND(${conditions.join(', ')})`
  }
}
