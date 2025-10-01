import * as gamesApi from "./api/games.ts";
import * as awardsApi from "./api/awards.ts";
import {
  handleEndOfMonth,
  sendEndAdviseToChats,
} from "./cronjobs/cronjobs.ts";
import { Bot } from "grammy";
import {
  buildAwardsMessage,
  buildCurrentAwardsMessage,
  buildFinalAdviseMessage,
  buildPunctuationTableMessage,
  buildRankingMessageFrom,
  buildTimetrialRankingMessageFrom,
  buildTopMessage,
} from "./bot/messages.ts";

const DEV_CHAT_ID = parseInt(Deno.env.get("DEV_CHAT_ID")!);
const DEV_USER_ID = parseInt(Deno.env.get("DEV_USER_ID")!);

// CLI for sending specific messages to dev chat
// Specify the target chat ID in the first arg, if not specified, falls to DEV_CHAT_ID. This is which chat to take data from, it always will be sent to DEV_CHAT_ID.
if (import.meta.main) {
  const args = Deno.args;
  const command = args[0];
  const bot = new Bot(Deno.env.get("TELEGRAM_TOKEN_CAT")!);

  if (command === "send-classificacio") {
    const toChatId = parseInt(args[1]) || DEV_CHAT_ID;

    const sendRanking = async (chatId: number) => {
      console.log(`Sending ranking of chat: ${chatId}`);
      const records = await gamesApi.getClassification(
        "cat",
        false,
        chatId,
      );

      const message = buildRankingMessageFrom(records, "cat");

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await takeAction(sendRanking, toChatId);
  }

  if (command === "send-contrarrellotge") {
    const toChatId = parseInt(args[1]) || DEV_CHAT_ID;

    const sendTimetrial = async (chatId: number) => {
      console.log(`Sending timetrial of chat: ${chatId}`);
      const records = await gamesApi.getClassification(
        "cat",
        true,
        chatId,
      );

      const message = buildTimetrialRankingMessageFrom(records, "cat");

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await takeAction(sendTimetrial, toChatId);
  }

  if (command === "send-llegenda") {
    console.log(`Sending punctuation table to dev chat: ${DEV_CHAT_ID}`);

    const sendPunctuationTable = async () => {
      const message = buildPunctuationTableMessage("cat");

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await sendPunctuationTable();
  }

  if (command === "send-final-advise") {
    console.log(`Sending final advise to dev chat: ${DEV_CHAT_ID}`);

    const sendFinalAdvise = async () => {
      const message = buildFinalAdviseMessage("cat");

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await sendFinalAdvise();
  }

  if (command === "give-award") {
    const toChatId = parseInt(args[1]) || DEV_CHAT_ID;

    let trophyId = prompt("Trophy ID");
    if (!trophyId) trophyId = "1";
    trophyId = trophyId.trim();

    const giveAward = async (chatId: number) => {
      console.log(
        `Giving award ${trophyId} to user ${DEV_USER_ID} in dev chat: ${chatId}`,
      );
      await awardsApi.giveAwardTo(
        chatId,
        DEV_USER_ID,
        parseInt(trophyId),
        "cat",
      );
    };

    await takeAction(giveAward, toChatId);
  }

  if (command === "check-group-awards") {
    const toChatId = parseInt(args[1]) || DEV_CHAT_ID;

    const sendAwards = async (chatId: number) => {
      console.log(`Checking group awards of chat: ${chatId}`);
      const awards = await awardsApi.getAwardsOf(chatId, "cat");

      const message = buildAwardsMessage(awards, "cat");

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await takeAction(sendAwards, toChatId);
  }

  if (command === "send-current-awards") {
    const toChatId = parseInt(args[1]) || DEV_CHAT_ID;

    const sendCurrentAwards = async (chatId: number) => {
      console.log(`Sending current awards to chat: ${chatId}`);
      const message = buildCurrentAwardsMessage("cat");
      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      });
    };

    await takeAction(sendCurrentAwards, toChatId);
  }

  if (command === "send-top") {
    const topPlayers = await gamesApi.getClassification("cat", false);
    const message = buildTopMessage(topPlayers, "cat");
    await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
      parse_mode: message.parse_mode,
    });
  }

  /*
   * CLI to simulate cronjobs
   */

  if (command === "simulate-end-of-month") {
    const toChatId = parseInt(args[1]);

    console.log(
      `Simulating end of month for chat: ${toChatId || DEV_CHAT_ID}`,
    );

    const simulateEndOfMonth = async () => {
      await handleEndOfMonth(bot, "cat", toChatId || DEV_CHAT_ID);
    };

    await simulateEndOfMonth();
  }

  if (command === "send-end-advise") {
    console.log(`Sending end advise to dev chat: ${DEV_CHAT_ID}`);

    await sendEndAdviseToChats(bot, "cat", DEV_CHAT_ID);
  }
}

function takeAction(
  action: (chatId: number) => Promise<void>,
  chatId: number | undefined,
) {
  if (chatId) {
    return action(chatId);
  } else {
    console.log("Wrong chat ID, getting dev chat");
    return action(DEV_CHAT_ID);
  }
}
