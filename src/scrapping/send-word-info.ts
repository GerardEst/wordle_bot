import { getWordInfo } from './check-word-meaning.ts'
import { getChats } from '../api/games.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import { FormattedMessage } from '../interfaces.ts'
import { WordInfo } from './interfaces.ts'
import { getLastWord } from '../api/words.ts'

export async function sendWordInfo(word?: string, chatId?: number) {
  const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN')!)

  let lastWord
  if (!word) lastWord = await getLastWord()

  const wordInfo = await getWordInfo(word || lastWord?.word)
  if (!wordInfo) {
    console.error("Can't get word info")
    return
  }
  const message = buildLastWordInfoMessage(wordInfo, lastWord?.average_tries)
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

function buildLastWordInfoMessage(
  info: WordInfo,
  average_tries?: number
): FormattedMessage {
  console.log('Building the message to be sent')
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

${
  average_tries
    ? `_Es va resoldre amb una mitjana de ${average_tries} intents_`
    : ''
}


[Juga la paraula d'avui](https://elmot.gelozp.com)
    `.trim(),
    parse_mode: 'Markdown',
  }
}
