const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_AWARDS_CHATS')}`
import { AWARDS } from '../conf.ts'

export interface Award {
  id: number
  userId: number
  userName: string
  chatId: number
  name: string
  emoji: string
  date: string
}

export async function getAwardsOf(
  chatId: number,
  userId?: number
): Promise<Award[]> {
  const params = new URLSearchParams({
    filterByFormula: userId
      ? `{ID Xat} = ${chatId} AND {ID Usuari} = ${userId}`
      : `{ID Xat} = ${chatId}`,
    view: Deno.env.get('TABLE_AWARDS_CHATS')!,
  })

  const res = await fetch(`${airtableUrl}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as AirtableResponse<PuntuacioFields>

  return data.records.map((record) => {
    const award = AWARDS.find((award) => award.id === record.fields['ID Premi'])

    return {
      id: award.id,
      chatId: record.fields['ID Xat'],
      userId: record.fields['ID Usuari'],
      userName: record.fields['Nom Usuari'],
      name: award.name,
      emoji: award.emoji,
      date: record.fields['Data'],
    }
  })
}

export async function giveAwardTo(
  chatId: number,
  userId: number,
  userName: string,
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
            'Nom Usuari': userName,
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
