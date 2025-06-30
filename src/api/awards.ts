const airtableUrl = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/${Deno.env.get('TABLE_AWARDS_CHATS')}`
import { AWARDS } from '../conf.ts'
import { Award, SBAward } from '../interfaces.ts'

import { supabase } from '../lib/supabase.ts'

export async function getAwardsOf(
  chatId: number,
  userId?: number
): Promise<Award[]> {
  const { data, error } = userId
    ? await supabase
        .from('trophies_chats')
        .select('trophy_id, user_id, chat_id, created_at')
        .eq('user_id', userId)
        .eq('chat_id', chatId)
    : await supabase
        .from('trophies_chats')
        .select('trophy_id, user_id, chat_id, created_at')
        .eq('chat_id', chatId)

  if (error) throw 'Error'

  console.log(data)
  return data
    .map((record: SBAward) => {
      const trophy = AWARDS.find((trophy) => trophy.id === record.trophy_id)

      if (!trophy) {
        console.error('Award not found', record.trophy_id)
        return null
      }

      return {
        id: trophy.id,
        chatId: record.chat_id,
        userId: record.user_id,
        userName: record.user_id.toString(),
        name: trophy.name,
        emoji: trophy.emoji,
        date: record.created_at,
      }
    })
    .filter((award): award is Award => award !== null)
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
