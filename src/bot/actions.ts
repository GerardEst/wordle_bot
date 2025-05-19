import { Bot, Context } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/db.ts'
import { getDaysRemainingInMonth } from './utils.ts'

export function setupActions(bot: Bot) {
  bot.command('punts', async (ctx: Context) => {
    const records = await api.getChatPunctuations(ctx.chat.id, 'month')

    if (!records || records.length === 0) {
      return ctx.reply('Encara no hi ha puntuacions en aquest xat.')
    }

    const ranking = buildRanking(records)
    const message = buildClassificationMessage(ranking)

    ctx.reply(message, { parse_mode: 'Markdown' })
  })

  bot.on('message', async (ctx: Context) => {
    const isFromElmot = ctx.message.text.includes('#ElMot')

    if (isFromElmot) {
      const points = getPoints(ctx.message.text)

      const isGameToday = await !!api.getChatPunctuationsByUser(
        ctx.message.chat.id,
        'day',
        ctx.message.from.id
      )
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
  })
}

function getPoints(message: string) {
  const tries = message.split(' ')[2].split('/')[0]

  if (tries === 'X') return 0

  const points = 6 - parseInt(tries)

  return points + 1
}

function getEmojiReactionFor(points: number) {
  if (points === 0) return '🤡'
  if (points === 1) return '😭'
  if (points === 2) return '😐'
  if (points === 3) return '😎'
  if (points === 4) return '🤯'
  if (points === 5) return '🏆'
  if (points === 6) return '🤨'
  return '🤷'
}

function buildRanking(records: any[]) {
  const userPoints: Record<string, { name: string; total: number }> = {}
  // Keep track of dates already processed for each user
  const processedUserDates: Record<string, Set<string>> = {}

  for (const record of records) {
    const userId = record.fields['ID Usuari']
    const userName = record.fields['Nom Usuari']
    const points = record.fields['Puntuació']
    const date = record.fields['Data'].split('T')[0]

    // Initialize user entry if it doesn't exist
    if (!userPoints[userId]) {
      userPoints[userId] = {
        name: userName,
        total: 0,
      }
      processedUserDates[userId] = new Set()
    }

    // Only count this record if we haven't seen this date for this user yet
    if (!processedUserDates[userId].has(date)) {
      userPoints[userId].total += points
      processedUserDates[userId].add(date)
    }
  }

  // Sort points descending
  const ranking = Object.values(userPoints).sort((a, b) => b.total - a.total)

  return ranking
}

function buildClassificationMessage(ranking: any[]) {
  let answer = '🏆 *Classificació del mes* 🏆\n\n'
  answer += `Falten *${getDaysRemainingInMonth()} dies* pel final de la lliga!\n\n`
  answer += '```\n'
  answer += 'Pos  Nom            Punts\n'
  answer += '—————————————————————————\n'

  ranking.forEach((user, index) => {
    let rank = `${index + 1}`.padEnd(4)
    if (index === 0) rank = '1 🥇'
    else if (index === 1) rank = '2 🥈'
    else if (index === 2) rank = '3 🥉'
    else rank = `${index + 1}  `
    const namePadded = `${user.name}`.padEnd(15)

    answer += `${rank} ${namePadded} ${user.total}\n`
  })

  answer += '```' // End monospace block

  return answer
}
