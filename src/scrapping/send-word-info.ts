import { getWordInfo } from './check-word-meaning.ts'
import { getChats, getAllUniqueGamesOfToday } from '../api/games.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import { FormattedMessage } from '../interfaces.ts'
import { WordInfo } from './interfaces.ts'

export async function sendWordInfo(word: string, chatId?: number) {
  const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN')!)

  const wordDifficulty = await getWordDifficulty()
  const wordInfo = await getWordInfo(word)
  const message = buildLastWordInfoMessage(wordInfo, wordDifficulty)
  await sendInfo(bot, message, chatId)
}

async function sendInfo(bot: Bot, message: FormattedMessage, chatId?: number) {
  const chats = chatId ? [chatId] : await getChats()

  for (const chat of chats) {
    await bot.api.sendMessage(chat, message.text, {
      parse_mode: message.parse_mode,
      link_preview_options: { is_disabled: true },
    })
  }
}

async function getWordDifficulty() {
  const todayGames = await getAllUniqueGamesOfToday()

  const averagePoints =
    todayGames.reduce(
      (sum: number, game: { punctuation: number }) => sum + game.punctuation,
      0
    ) / todayGames.length

  const inversedAverage = 5 - averagePoints
  const normalizedDifficulty = parseFloat(
    ((inversedAverage * 10) / 5).toFixed(1) // We use 5 instead of 6 because solve it in the first try is to hard
  )

  return normalizedDifficulty
}

function buildLastWordInfoMessage(
  info: WordInfo,
  difficulty: number
): FormattedMessage {
  const difficultyText =
    difficulty < 2.5
      ? '⚪️ Impensablement fàcil'
      : difficulty <= 3
      ? '🟢 Xupada'
      : difficulty <= 5
      ? '🟡 Normaleta'
      : difficulty < 8
      ? '🔴 Difícil'
      : '⚫️ Impossible'

  const etymologySection =
    info.etymology.length > 1
      ? `*Etimologíes*\n${info.etymology
          .map((etym, index) => `${index + 1}. \`${etym}\``)
          .join('\n')}`
      : `*Etimologia*\n\`${info.etymology[0] || 'No disponible'}\``

  const meaningSection =
    info.meaning.length > 1
      ? `*Definicions*\n${info.meaning
          .map((meaning, index) => `${index + 1}. ${meaning}`)
          .join('\n\n')}`
      : `*Definició*\n${info.meaning[0] || 'No disponible'}`

  return {
    text: `
La paraula d'ahir va ser:

*${info.word.toUpperCase()}*

${meaningSection}

${etymologySection}

*Dificultat*
${difficultyText}

[Juga la paraula d'avui](https://elmot.gelozp.com)
    `.trim(),
    parse_mode: 'Markdown',
  }
}
