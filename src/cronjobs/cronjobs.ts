import * as api from '../api/games.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import {
  buildFinalAdviseMessage,
  buildCharactersActionsMessage,
  buildNewAwardsMessage,
} from '../bot/messages.ts'
import { getChatCharacters } from '../api/characters.ts'
import { getPointsForHability, getCurrentMonth } from '../bot/utils.ts'
import { giveAwardTo } from '../api/awards.ts'
import { Result } from '../interfaces.ts'

export function setupCronjobs(bot: Bot) {
  Deno.cron(
    'Send league end advise msg at 9 or 10 of every end of month',
    '0 8 28-31 * *',
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
    'End league at 22 or 23 of every end of month',
    '0 21 28-31 * *',
    () => {
      const now = new Date()
      const isLastDay =
        now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      if (isLastDay) handleEndOfMonth(bot)
    }
  )

  Deno.cron(
    'Send characters actions at 12 or 13 of every day',
    '0 11 * * *',
    () => {
      sendCharactersActions(bot)
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

export async function handleEndOfMonth(bot: Bot, chatId?: number) {
  const chats = chatId ? [chatId] : await api.getChats()

  for (const chat of chats) {
    const results = await api.getChatRanking(chat, 'month')
    await saveAwardsToDb(chat, results)
    await sendResultsToChats(bot, chat, results)
  }
}

async function saveAwardsToDb(chat: number, results: Result[]) {
  for (let i = 0; i < 3; i++) {
    await giveAwardTo(
      chat,
      results[i].id,
      results[i].name,
      parseInt(`${getCurrentMonth()}${i}`)
    )
  }
}

async function sendResultsToChats(bot: Bot, chat: number, results: Result[]) {
  const message = buildNewAwardsMessage(results)

  await bot.api.sendMessage(chat, message.text, {
    parse_mode: message.parse_mode,
  })
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
