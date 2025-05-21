const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_AWARDS_CHATS')}`

export async function getAwards(chatId: number) {
  const response = await fetch(airtableUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
    },
  })

  const data = await response.json()
  return data.records
}

export async function getAwards(
  chatId: number,
  userId: number | null = null
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const params = new URLSearchParams({
    filterByFormula: `{ID Xat} = ${chatId}`,
    view: Deno.env.get('TABLE_AWARDS_CHATS')!,
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
