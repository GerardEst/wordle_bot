import { AWARDS } from "../conf.ts";
import { Award, lang, SBAward } from "../interfaces.ts";
import { supabase } from "../lib/supabase.ts";

// TODO - Implementar un dia que pugui fer comprovacions bé
// const onDev = Deno.env.get('ENV') === 'dev'

export function processAwards(data: SBAward[], lang: lang): Award[] {
  return data
    .map((record: SBAward) => {
      const trophy = AWARDS[lang].find(
        (trophy) => trophy.id === record.trophy_id,
      );

      if (!trophy) {
        console.error("Award not found", record.trophy_id);
        return null;
      }

      return {
        id: trophy.id,
        chatId: record.chat_id,
        userId: record.users.id,
        userName: record.users.name,
        name: trophy.name,
        emoji: trophy.emoji,
        date: record.created_at,
      };
    })
    .filter((award): award is Award => award !== null);
}

function orderByKind(data: SBAward[]) {
  // Ordena per or, plata o bronze, és a dir últim dígit 1, 2 o 3
  const sortedByLastDigit = [...data].sort((a, b) => {
    const aLastDigit = Number(a.trophy_id) % 10;
    const bLastDigit = Number(b.trophy_id) % 10;
    return aLastDigit - bLastDigit;
  });

  return sortedByLastDigit
}

export async function getAwardsOf(
  chatId: number,
  lang: lang,
  userId?: number,
): Promise<Award[] | null> {
  console.log(`Getting awards of group ${chatId}`);
  try {
    let query = supabase
      .from("trophies_chats")
      .select("trophy_id, users(id, name), chat_id, created_at")
      .eq("chat_id", chatId)

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // SUPABASE BUG #01
    return processAwards(orderByKind(data as unknown as SBAward[]), lang);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function giveAwardTo(
  chatId: number,
  userId: number,
  trophyId: number,
  lang: lang,
) {
  // TODO - Relacionat amb el de dalt
  // if (onDev) return

  console.log(`Giving award ${trophyId} to ${userId} in chat ${chatId}`);

  const { error } = await supabase.from("trophies_chats").insert([
    {
      chat_id: chatId,
      user_id: userId,
      trophy_id: trophyId,
      lang: lang,
    },
  ]);

  if (error) {
    console.error("Error giving award", error);
    return;
  }
}
