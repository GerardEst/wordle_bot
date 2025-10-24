import type { Context } from "grammy"
import { supabase } from "../lib/supabase.ts";
import { supalog } from "./log.ts";

export async function updateChartName(chatId: number, newName: string, ctx: Context) {
  try {
    const { error } = await supabase
      .from("chats")
      .upsert({ id: chatId, name: newName })
      .eq("id", chatId)
      .select();

    if (error) throw error;
  } catch (error: any) {
    supalog.error("", ctx, undefined, error);
  }
}
