import * as gamesApi from "../api/games.ts";
import { Bot } from "grammy";
import {
  buildFinalAdviseMessage,
  buildNewAwardsMessage,
} from "../bot/messages.ts";
import {
  getCurrentMonth,
} from "../bot/utils.ts";
import { giveAwardTo } from "../api/awards.ts";
import { lang, Player } from "../interfaces.ts";

export function setupCronjobs(bot: Bot, lang: lang) {
  Deno.cron(
    "Send league end advise msg at 9 or 10 of every end of month",
    "0 8 28-31 * *",
    () => {
      const now = new Date();
      const isLastDay = now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      if (isLastDay) {
        sendEndAdviseToChats(bot, lang);
      }
    },
  );

  Deno.cron(
    "End league at 21 or 22 of every end of month",
    "0 20 28-31 * *",
    () => {
      const now = new Date();
      const isLastDay = now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      if (isLastDay) handleEndOfMonth(bot, lang);
    },
  );
}

export async function sendEndAdviseToChats(
  bot: Bot,
  lang: lang,
  chatId?: number,
) {
  const chats = chatId ? [chatId] : await gamesApi.getChats(lang);
  const message = buildFinalAdviseMessage(lang);

  for (const chat of chats) {
    await bot.api.sendMessage(chat, message.text, {
      parse_mode: message.parse_mode,
    });
  }
}

export async function handleEndOfMonth(bot: Bot, lang: lang, chatId?: number) {
  const chats = chatId ? [chatId] : await gamesApi.getChats(lang);

  for (const chat of chats) {
    const results = await gamesApi.getClassification(lang, false, chat);
    const timetrialResults = await gamesApi.getClassification(
      lang,
      true,
      chat,
    );

    await saveAwardsToDb(chat, results, timetrialResults, lang);
    await sendResultsToChats(bot, chat, results, timetrialResults, lang);
  }
}

async function saveAwardsToDb(
  chat: number,
  results: Player[],
  timetrialResults: Player[],
  lang: lang,
) {
  const top3PlayerIds = new Set<number>();

  // Award top 3 positions
  for (let i = 0; i < 3; i++) {
    if (results[i] && results[i].id) {
      await giveAwardTo(
        chat,
        results[i].id,
        parseInt(`${getCurrentMonth()}${i}`),
        lang,
      );
      top3PlayerIds.add(results[i].id);
    }

    if (
      timetrialResults[i] &&
      timetrialResults[i].id
    ) {
      await giveAwardTo(
        chat,
        timetrialResults[i].id,
        parseInt(`${getCurrentMonth()}${i + 5}`),
        lang,
      );
      top3PlayerIds.add(timetrialResults[i].id);
    }
  }

  // Give consolation trophy only to players who didn't get top 3 in any league
  const consolationTrophyId = parseInt(`${getCurrentMonth()}9`);

  for (const player of results) {
    if (!top3PlayerIds.has(player.id) && player.id) {
      await giveAwardTo(chat, player.id, consolationTrophyId, lang);
    }
  }
}

async function sendResultsToChats(
  bot: Bot,
  chat: number,
  results: Player[],
  timetrialResults: Player[],
  lang: lang,
) {
  const message = buildNewAwardsMessage(results, timetrialResults, lang);

  await bot.api.sendMessage(chat, message.text, {
    parse_mode: message.parse_mode,
  });
}
