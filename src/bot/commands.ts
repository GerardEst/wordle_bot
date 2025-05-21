import { Bot, Context, Keyboard } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/games.ts'
import * as charactersApi from '../api/characters.ts'
import * as awardsApi from '../api/awards.ts'
import {
  buildRankingMessageFrom,
  buildPunctuationTableMessage,
  buildAwardsMessage,
  buildCurrentAwardsMessage,
} from './messages.ts'
import { getPoints } from './utils.ts'
import { CHARACTERS, EMOJI_REACTIONS } from '../conf.ts'

export function setupCommands(bot: Bot) {
  bot.command('classificacio', async (ctx: Context) => {
    if (!ctx.chat) return

    const records = await api.getChatRanking(ctx.chat.id, 'month')
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

  bot.command('premis', async (ctx: Context) => {
    if (!ctx.chat) return

    const keyboard = new Keyboard()
    keyboard.text('Vitrina virtual')
    keyboard.row()
    keyboard.text('Trofeus en joc')
    keyboard.row()
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
      const characterName = ctx.message.text.split('Afegir a ')[1]
      await charactersApi.addCharacterToChat(ctx.message.chat.id, characterName)
      ctx.reply(`${characterName} s'ha afegit a la partida!`, {
        reply_markup: { remove_keyboard: true },
      })
    } else if (ctx.message.text === 'Vitrina virtual') {
      const awards = await awardsApi.getAwardsOf(ctx.message.chat.id)
      const message = buildAwardsMessage(awards)

      ctx.reply(message.text, {
        parse_mode: message.parse_mode,
        reply_markup: { remove_keyboard: true },
      })
    } else if (ctx.message.text === 'Trofeus en joc') {
      const message = buildCurrentAwardsMessage()

      ctx.reply(message.text, {
        parse_mode: message.parse_mode,
        reply_markup: { remove_keyboard: true },
      })
    } else if (ctx.message.text === '🔙 Tancar opcions') {
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

  isGameToday ? ctx.react('🌚') : ctx.react(EMOJI_REACTIONS[points])

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
