import * as api from '../api/db.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import {
  buildFinalAdviseMessage,
  buildFinalResultsMessage,
} from '../bot/messages.ts'

export function setupCronjobs(bot: Bot) {
  Deno.cron(
    'Send a message at 10 of every end of month',
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
    'Send a message at 22 of every end of month',
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
