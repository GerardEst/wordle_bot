import { Bot, Context, Keyboard } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/db.ts'
import * as charactersApi from '../api/characters.ts'
import { Character } from '../api/characters.ts'
import {
  buildRankingMessageFrom,
  buildPunctuationTableMessage,
} from './messages.ts'
import { getPoints, getEmojiReactionFor } from './utils.ts'
import { CHARACTERS } from '../conf.ts'

// TODO - Xapussero, però així evito haber de fer masses calls
let characters: any

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

  bot.command('extres', (ctx: Context) => {
    if (!ctx.chat) return

    const keyboard = new Keyboard()
    for (const character of CHARACTERS) {
      keyboard.text('Afegir a ' + character.name)
      keyboard.row()
    }
    keyboard.text('🔙 Tancar opcions')
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply('Selecciona una opció:', { reply_markup: keyboard })
  })

  bot.on('message', async (ctx: Context) => {
    if (!ctx.message || !ctx.message.text) return

    const isFromElmot = ctx.message.text.includes('#ElMot')

    if (isFromElmot) {
      await reactToGame(ctx)
    } else if (ctx.message.text.includes('Afegir a ')) {
      // TODO - Repassar
      const characterName = ctx.message.text.split('Afegir a ')[1]
      await charactersApi.addCharacterToChat(ctx.message.chat.id, characterName)
      ctx.reply(`${characterName} s'ha afegit a la partida!`, {
        reply_markup: { remove_keyboard: true },
      })
    } else if (ctx.message.text.includes('Tancar opcions')) {
      await ctx.reply('Opcions tancades', {
        reply_markup: { remove_keyboard: true },
      })
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
  await api.createRecord(
    ctx.message.chat.id,
    {
      id: ctx.message.from.id,
      name: ctx.message.from.first_name,
    },
    points
  )
}
