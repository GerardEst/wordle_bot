const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/Puntuacions`

export async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'week' | 'day'
) {
  const params = new URLSearchParams({
    filterByFormula: buildFormula(chatId, period),
    view: 'Llista',
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

function buildFormula(chatId: number, period: 'all' | 'week' | 'day') {
  let formula = `{ID Xat} = ${chatId}`

  if (period === 'day') {
    formula = `AND({ID Xat} = ${chatId}, IS_SAME({Data}, TODAY(), 'day'))`
  } else if (period === 'week') {
    formula = `AND({ID Xat} = ${chatId}, IS_SAME({Data}, TODAY(), 'week'))`
  }

  return formula
}
