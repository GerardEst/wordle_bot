import { Bot, Context, Keyboard } from "grammy";
import * as gamesApi from "../api/games.ts";
import * as awardsApi from "../api/awards.ts";
import * as chatsApi from "../api/chats.ts";
import {
  buildAwardsMessage,
  buildCurrentAwardsMessage,
  buildPunctuationTableMessage,
  buildRankingMessageFrom,
  buildTimetrialRankingMessageFrom,
  buildTopMessage,
} from "./messages.ts";
import { getPoints, getTime } from "./utils.ts";
import { EMOJI_REACTIONS } from "../conf.ts";
import { lang } from "../interfaces.ts";
import { t } from "../translations.ts";
import { supalog } from "../api/log.ts";

export function setupCommands(bot: Bot, bot_lang: lang) {
  bot.command(
    t("classification", bot_lang),
    (ctx: Context) => {
      supalog.feature("command_classification", ctx, bot_lang);
      sendClasification(ctx, bot_lang);
    },
  );
  bot.command(t("timetrial", bot_lang), (ctx: Context) => {
    supalog.feature("command_timetrial", ctx, bot_lang);
    sendTimetrialClassification(ctx, bot_lang);
  });
  bot.command(t("legend", bot_lang), (ctx: Context) => {
    supalog.feature("command_legend", ctx, bot_lang);
    sendLegend(ctx, bot_lang);
  });
  bot.command(t("trophies", bot_lang), (ctx: Context) => {
    supalog.feature("command_showcase", ctx, bot_lang);
    sendShowcase(ctx, bot_lang);
  });
  bot.command("top", (ctx: Context) => {
    supalog.feature("command_top", ctx, bot_lang);
    sendTop(ctx, bot_lang);
  });
  bot.command(t("toptimetrial", bot_lang), (ctx: Context) => {
    supalog.feature("command_toptimetrial", ctx, bot_lang);
    sendTop(ctx, bot_lang, "timetrial");
  });
  bot.command(t("instructions", bot_lang), (ctx: Context) => {
    supalog.feature("command_instructions", ctx, bot_lang);
    sendInstructions(ctx, bot_lang);
  });

  // Welcome message when bot is added to a group
  bot.on("my_chat_member", (ctx: Context) => {
    supalog.info("Bot added to a group", ctx, bot_lang);
    handleChatMemberUpdate(ctx, bot_lang);
  });

  bot.on("message", (ctx: Context) => {
    reactToMessage(ctx, bot_lang);
  });
}

async function reactToMessage(ctx: Context, lang: lang) {
  if (!ctx.message || !ctx.message.text) return;

  const isFromLang = checkLang(ctx.message.text);

  if (isFromLang && isFromLang === lang) {
    await reactToGame(ctx, isFromLang);
  }
}

function checkLang(message: string) {
  if (message.includes("#mooot")) return "cat";
  if (message.includes("#wardle_es")) return "es";
  if (message.includes("#wardle_en")) return "en";
  return null;
}

async function sendClasification(ctx: Context, lang: lang) {
  if (!ctx.chat) return;

  const records = await gamesApi.getClassification(lang, false, ctx.chat.id);
  const message = buildRankingMessageFrom(records, lang);

  ctx.reply(message.text, { parse_mode: message.parse_mode });
}

async function sendTimetrialClassification(ctx: Context, lang: lang) {
  if (!ctx.chat) return;

  const records = await gamesApi.getClassification(lang, true, ctx.chat.id);
  const message = buildTimetrialRankingMessageFrom(records, lang);

  ctx.reply(message.text, { parse_mode: message.parse_mode });
}

function sendLegend(ctx: Context, lang: lang) {
  if (!ctx.chat) return;

  const message = buildPunctuationTableMessage(lang);
  ctx.reply(message.text, { parse_mode: message.parse_mode });
}

async function sendTop(ctx: Context, lang: lang, mode = "normal") {
  if (!ctx.chat) return;

  const topPlayers = await gamesApi.getClassification(
    lang,
    mode === "timetrial",
  );
  const message = buildTopMessage(topPlayers, lang, mode);

  ctx.reply(message.text, { parse_mode: "Markdown" });
}

async function sendShowcase(ctx: Context, lang: lang) {
  const message = ctx.message;
  if (!message || !message.text) return;

  const awards = await awardsApi.getAwardsOf(message.chat.id, lang);
  const replyMessage = buildAwardsMessage(awards, lang);

  ctx.reply(replyMessage.text, {
    parse_mode: replyMessage.parse_mode,
  });
}

async function reactToGame(ctx: Context, lang: lang) {
  if (!ctx.message || !ctx.message.text) return;

  const userTodayGames = await gamesApi.getUserTodaysGameForChat(
    ctx.message.chat.id,
    lang,
    ctx.message.from.id,
  );
  const isGameToday = userTodayGames.length > 0;

  const points = getPoints(ctx.message.text);
  const time = getTime(ctx.message.text);
  try {
    await (isGameToday ? ctx.react("🌚") : ctx.react(EMOJI_REACTIONS[points]));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to react to message:", error.message);
    } else {
      console.error("Failed to react to message:", error);
    }
  }

  // Save or update chat name
  console.log(ctx.message.chat.title);
  await chatsApi.updateChartName(ctx.message.chat.id, ctx.message.chat.title!, ctx);

  // We don't save the game if user already have a game today
  if (isGameToday) return;

  supalog.info(
    `+${points}-${time}s`,
    ctx,
    lang,
  );

  // Save player game
  await gamesApi.createRecord({
    chatId: ctx.message.chat.id,
    userId: ctx.message.from.id,
    userName: `${ctx.message.from.first_name} ${ctx.message.from.last_name || ""
      }`.trim(),
    points,
    time,
    lang,
  });
}

function sendInstructions(ctx: Context, lang: lang) {
  if (!ctx.chat) return;

  const message = t("instructionsMessage", lang);
  ctx.reply(message, { parse_mode: "HTML" });
}

async function handleChatMemberUpdate(ctx: Context, lang: lang) {
  if (!ctx.myChatMember || !ctx.chat) return;

  const { old_chat_member, new_chat_member } = ctx.myChatMember;

  // Check if bot was just added to the group
  if (
    old_chat_member.status === "left" &&
    (new_chat_member.status === "member" ||
      new_chat_member.status === "administrator")
  ) {
    const welcomeMessage = t("welcomeMessage", lang);
    await ctx.reply(welcomeMessage, { parse_mode: "HTML" });
  }
}
