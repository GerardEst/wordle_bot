import { Bot, Context, Keyboard } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/games.ts'
import * as charactersApi from '../api/characters.ts'
import * as awardsApi from '../api/awards.ts'
import {
  buildRankingMessageFrom,
  buildPunctuationTableMessage,
  buildAwardsMessage,
  buildCurrentAwardsMessage,
  buildTopMessage,
  buildTimetrialRankingMessageFrom,
} from './messages.ts'
import { getPoints, getTime } from './utils.ts'
import { EMOJI_REACTIONS } from '../conf.ts'
import { getAllCharacters, getChatCharacters } from '../api/characters.ts'

export function setupCommands(bot: Bot) {
  bot.command('classificacio', async (ctx: Context) => {
    if (!ctx.chat) return

    const records = await api.getChatRanking(ctx.chat.id, 'month')
    const message = buildRankingMessageFrom(records)

    ctx.reply(message.text, { parse_mode: message.parse_mode })
  })

  bot.command('contrarrellotge', async (ctx: Context) => {
    if (!ctx.chat) return

    const records = await api.getChatRanking(
      ctx.chat.id,
      'day',
      undefined,
      true
    )
    const message = buildTimetrialRankingMessageFrom(records)

    ctx.reply(message.text, { parse_mode: message.parse_mode })
  })

  bot.command('llegenda', (ctx: Context) => {
    if (!ctx.chat) return

    const message = buildPunctuationTableMessage()
    ctx.reply(message.text, { parse_mode: message.parse_mode })
  })

  bot.command('premis', (ctx: Context) => {
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

  bot.command('top', async (ctx: Context) => {
    if (!ctx.chat) return

    const topPlayers = await api.getTopPlayersGlobal()
    const message = buildTopMessage(topPlayers)

    // TODO - Treure els characters del top
    // -todo - veure com fa la suma i evitar que em sumi lo del xat test

    ctx.reply(message.text, { parse_mode: 'Markdown' })
  })

  bot.command('afegirpersonatge', async (ctx: Context) => {
    if (!ctx.chat) return

    const allCharacters = await getAllCharacters()

    const keyboard = new Keyboard()
    for (const character of allCharacters) {
      keyboard.text('Afegir a ' + character.name)
      keyboard.row()
    }
    keyboard.text('🔙 Tancar opcions')
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply('Selecciona una opció:', { reply_markup: keyboard })
  })

  bot.command('eliminarpersonatge', async (ctx: Context) => {
    if (!ctx.chat) return

    const chatCharacters = await getChatCharacters(ctx.chat.id)

    if (chatCharacters.length === 0) {
      ctx.reply('No hi ha personatges a la lliga.')
      return
    }

    const keyboard = new Keyboard()
    for (const character of chatCharacters) {
      keyboard.text('Eliminar a ' + character.name)
      keyboard.row()
    }
    keyboard.text('🔙 Tancar opcions')
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply('Quin personatge vols eliminar?', { reply_markup: keyboard })
  })

  bot.on('message', async (ctx: Context) => {
    if (!ctx.message || !ctx.message.text) return

    const isFromMooot = ctx.message.text.includes('#mooot')

    if (isFromMooot) {
      await reactToGame(ctx)
    } else if (ctx.message.text.includes('Afegir a ')) {
      const characterName = ctx.message.text.split('Afegir a ')[1]
      await charactersApi.addCharacterToChat(ctx.message.chat.id, characterName)
      ctx.reply(`${characterName} s'ha afegit a la partida!`, {
        reply_markup: { remove_keyboard: true },
      })
    } else if (ctx.message.text.includes('Eliminar a ')) {
      const characterName = ctx.message.text.split('Eliminar a ')[1]
      await charactersApi.removeCharacterFromChat(
        ctx.message.chat.id,
        characterName
      )
      ctx.reply(`${characterName} s'ha tret de la partida!`, {
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
  console.log(ctx.message)

  if (!ctx.message || !ctx.message.text) return

  const points = getPoints(ctx.message.text)
  const time = getTime(ctx.message.text)

  const userTodayGames = await api.getChatPunctuations(
    ctx.message.chat.id,
    'day',
    ctx.message.from.id
  )

  const isGameToday = userTodayGames.length > 0

  try {
    await (isGameToday ? ctx.react('🌚') : ctx.react(EMOJI_REACTIONS[points]))
  } catch (error) {
    console.error('Failed to react to message:', error.message)
  }

  // We don't save the game if user already have a game today
  if (isGameToday) return

  // Save player game
  await api.createRecord({
    chatId: ctx.message.chat.id,
    userId: ctx.message.from.id,
    userName: `${ctx.message.from.first_name} ${
      ctx.message.from.last_name || ''
    }`.trim(),
    points,
    time,
  })
}
