import { Bot, Context } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/db.ts'
import {
  buildRankingMessageFrom,
  buildPunctuationTableMessage,
} from './messages.ts'
import { getPoints, getEmojiReactionFor } from './utils.ts'

export function setupCommands(bot: Bot) {
  bot.command('classificacio', async (ctx: Context) => {
    if (!ctx.chat) return

    const records = await api.getChatPunctuations(ctx.chat.id, 'month')
    const message = buildRankingMessageFrom(records)

    ctx.reply(message.text, { parse_mode: message.parse_mode })
  })

  bot.command('puntatge', (ctx: Context) => {
    if (!ctx.chat) return

    const message = buildPunctuationTableMessage()
    ctx.reply(message.text, { parse_mode: message.parse_mode })
  })

  bot.on('message', async (ctx: Context) => {
    if (!ctx.message || !ctx.message.text) return

    const isFromElmot = ctx.message.text.includes('#ElMot')

    if (isFromElmot) {
      await reactToGame(ctx)
    }
  })
}

async function reactToGame(ctx: Context) {
  if (!ctx.message || !ctx.message.text) return

  const points = getPoints(ctx.message.text)

  const userTodayGames = await api.getChatPunctuations(
    ctx.message.chat.id,
    'day',
    ctx.message.from.id
  )
  const isGameToday = userTodayGames.length > 0

  if (isGameToday) {
    ctx.react('🌚')
  } else {
    ctx.react(getEmojiReactionFor(points))
  }

  // We don't save the game if user already have a game today
  if (isGameToday) return

  // Save player game
  await api.createRecord({
    'ID Xat': ctx.message.chat.id,
    'ID Usuari': ctx.message.from.id,
    'Nom Usuari': ctx.message.from.first_name,
    Puntuació: points,
    Joc: 'elmot',
    Data: new Date().toISOString(),
  })
}
