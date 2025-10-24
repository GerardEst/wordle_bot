import { supabase } from "../lib/supabase.ts";
import type { Context } from "grammy"

// TODO - Seria millor definir a un lloc global el ctx i el lang, coses úniques
// per l'arrancada, i així no estar-ho passant per tot arreu

type LogLevel = "debug" | "info" | "warn" | "feature" | "error";
type LoggableFeatures =
  | "command_classification"
  | "command_timetrial"
  | "command_legend"
  | "command_monthTrophies"
  | "command_showcase"
  | "command_top"
  | "command_toptimetrial"
  | "command_instructions";

const sb_analytics = supabase.schema("analytics");

async function logToDatabase(
  level: LogLevel,
  message: string,
  userId?: number,
  chatId?: number,
  bot_lang?: string,
  data?: Object
): Promise<void> {
  try {
    const { error } = await sb_analytics
      .from("bot_logs")
      .insert({ type: level, title: message, user_id: userId, chat_id: chatId, lang: bot_lang, data });

    if (error) {
      console.error("Failed to log to database:", error, userId, chatId);
      return;
    }
  } catch (err) {
    console.error("Error logging to database:", err);
  }
}

export const supalog = {
  debug: (message: string, ctx?: Context, bot_lang?: string, data?: Object) =>
    logToDatabase("debug", message, ctx?.update.message?.chat.id, ctx?.update.message?.from.id, bot_lang, data),

  info: (message: string, ctx?: Context, bot_lang?: string, data?: Object) =>
    logToDatabase("info", message, ctx?.update.message?.chat.id, ctx?.update.message?.from.id, bot_lang, data),

  warn: (message: string, ctx?: Context, bot_lang?: string, data?: Object) =>
    logToDatabase("warn", message, ctx?.update.message?.chat.id, ctx?.update.message?.from.id, bot_lang, data),

  feature: (feature: LoggableFeatures, ctx?: Context, bot_lang?: string, data?: Object) =>
    logToDatabase("feature", feature, ctx?.update.message?.chat.id, ctx?.update.message?.from.id, bot_lang, data),

  error: (message: string, ctx?: Context, bot_lang?: string, data?: Object) =>
    logToDatabase("error", message, ctx?.update.message?.chat.id, ctx?.update.message?.from.id, bot_lang, data),
};