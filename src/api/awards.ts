import { AWARDS } from '../conf.ts'
import { Award, lang, SBAward } from '../interfaces.ts'
import { supabase } from '../lib/supabase.ts'

export function processAwards(data: SBAward[]): Award[] {
    return data
        .map((record: SBAward) => {
            const trophy = AWARDS.find(
                (trophy) => trophy.id === record.trophy_id
            )

            if (!trophy) {
                console.error('Award not found', record.trophy_id)
                return null
            }

            return {
                id: trophy.id,
                chatId: record.chat_id,
                userId: record.users?.id || record.characters.id,
                userName: record.users?.name || record.characters.name,
                name: trophy.name,
                emoji: trophy.emoji,
                date: record.created_at,
            }
        })
        .filter((award): award is Award => award !== null)
}

export async function getAwardsOf(
    chatId: number,
    userId?: number
): Promise<Award[]> {
    const { data, error } = userId
        ? await supabase
              .from('trophies_chats')
              .select(
                  'trophy_id, users(id, name), characters(id, name) chat_id, created_at'
              )
              .eq('user_id', userId)
              .eq('chat_id', chatId)
        : await supabase
              .from('trophies_chats')
              .select(
                  'trophy_id, users(id, name), characters(id, name), chat_id, created_at'
              )
              .eq('chat_id', chatId)

    if (error) throw 'Error'

    // SUPABASE BUG #01
    return processAwards(data as unknown as SBAward[])
}

export async function giveAwardTo(
    chatId: number,
    userId: number,
    trophyId: number,
    lang: lang
) {
    const { error } = await supabase
        .from('trophies_chats')
        .insert([
            {
                chat_id: chatId,
                user_id: userId,
                trophy_id: trophyId,
                lang: lang,
            },
        ])

    if (error) {
        console.error('Error giving award', error)
        return
    }
}
