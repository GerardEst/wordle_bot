const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_AWARDS_CHATS')}`

export async function getAwardsOf(
  chatId: number,
  userId?: number
): Promise<AirtableRecord<PuntuacioFields>[]> {
  const params = new URLSearchParams({
    filterByFormula: `{ID Xat} = ${chatId}`,
    view: Deno.env.get('TABLE_AWARDS_CHATS')!,
  })

  console.log(params, params.toString())

  const res = await fetch(`${airtableUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  return data.records
}

export async function giveAwardTo(
  chatId: number,
  userId: number,
  awardId: number
) {
  const res = await fetch(airtableUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            'ID Xat': chatId,
            'ID Usuari': userId,
            'ID Premi': awardId,
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error('Error giving award', await res.text())
    return
  }
}
