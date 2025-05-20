const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/Puntuacions`

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'week' | 'month' | 'day',
  userId: number | null = null
): Promise<any[]> {
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

  const data = await res.json()

  return data.records
}

export async function createRecord(fields: Record<string, any>) {
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

export async function getChats() {
  const res = await fetch(airtableUrl, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return [
    ...new Set(data.records.map((record: any) => record.fields['ID Xat'])),
  ]
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
