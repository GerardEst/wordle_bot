import * as api from '../api/games.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import {
  buildFinalAdviseMessage,
  buildFinalResultsMessage,
  buildCharactersActionsMessage,
} from '../bot/messages.ts'
import { getChatCharacters } from '../api/characters.ts'
import { getPointsForHability } from '../bot/utils.ts'
export function setupCronjobs(bot: Bot) {
  Deno.cron(
    'Send league ending advise message at 10 of every end of month',
    '0 10 28-31 * *',
    () => {
      const now = new Date()
      const isLastDay =
        now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      if (isLastDay) {
        sendEndAdviseToChats(bot)
      }
    }
  )

  Deno.cron(
    'Send classification results message at 22 of every end of month',
    '0 22 28-31 * *',
    () => {
      const now = new Date()
      const isLastDay =
        now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      if (isLastDay) {
        sendResultsToChats(bot)
      }
    }
  )

  Deno.cron('Send characters actions at 12 of every day', '0 12 * * *', () => {
    sendCharactersActions(bot)
  })
}

async function sendEndAdviseToChats(bot: Bot) {
  const message = buildFinalAdviseMessage()
  const chats = await api.getChats()

  for (const chat of chats) {
    await bot.api.sendMessage(chat, message.text, {
      parse_mode: message.parse_mode,
    })
  }
}

async function sendResultsToChats(bot: Bot) {
  const chats = await api.getChats()

  for (const chat of chats) {
    const results = await api.getChatPunctuations(chat, 'month')
    const message = buildFinalResultsMessage(results)
    await bot.api.sendMessage(chat, message.text, {
      parse_mode: message.parse_mode,
    })
  }
}

export async function sendCharactersActions(bot: Bot, chatId?: number) {
  const chats = chatId ? [chatId] : await api.getChats()

  for (const chat of chats) {
    const characters = await getChatCharacters(chat)

    for (const character of characters) {
      const points = getPointsForHability(character.hability)

      await api.createRecord(chat, character, points)
      const message = buildCharactersActionsMessage(character.name, points)

      await bot.api.sendMessage(chat, message.text, {
        parse_mode: message.parse_mode,
      })
    }
  }
}
