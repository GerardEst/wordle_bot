import * as api from './api/games.ts'
import * as awardsApi from './api/awards.ts'
import { sendCharactersActions, handleEndOfMonth } from './cronjobs/cronjobs.ts'
import { startUp } from './bot/startup.ts'
import {
  buildFinalAdviseMessage,
  buildPunctuationTableMessage,
  buildRankingMessageFrom,
  buildAwardsMessage,
  buildCurrentAwardsMessage,
} from './bot/messages.ts'

const DEV_CHAT_ID = Deno.env.get('DEV_CHAT_ID')!
const DEV_USER_ID = Deno.env.get('DEV_USER_ID')!

// CLI for sending specific messages to dev chat
if (import.meta.main) {
  const args = Deno.args
  const command = args[0]
  const bot = startUp(Deno.env.get('TELEGRAM_TOKEN')!)

  if (command === 'send-classificacio') {
    const toChatId = askForChatId()

    const sendRanking = async (chatId: number) => {
      console.log(`Sending ranking of chat: ${chatId}`)
      const records = await api.getChatRanking(chatId, 'month')

      const message = buildRankingMessageFrom(records)

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    takeAction(sendRanking, toChatId)
  }

  if (command === 'send-puntatge') {
    console.log(`Sending punctuation table to dev chat: ${DEV_CHAT_ID}`)

    const sendPunctuationTable = async () => {
      const message = buildPunctuationTableMessage()

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await sendPunctuationTable()
  }

  if (command === 'send-final-advise') {
    console.log(`Sending final advise to dev chat: ${DEV_CHAT_ID}`)

    const sendFinalAdvise = async () => {
      const message = buildFinalAdviseMessage()

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await sendFinalAdvise()
  }

  if (command === 'send-characters-actions') {
    console.log(`Sending characters actions to dev chat: ${DEV_CHAT_ID}`)

    await sendCharactersActions(bot, parseInt(DEV_CHAT_ID))
  }

  if (command === 'give-award') {
    console.log(
      `Giving award ${args[1]} to user ${DEV_USER_ID} in dev chat: ${DEV_CHAT_ID}`
    )

    await awardsApi.giveAwardTo(
      parseInt(DEV_CHAT_ID),
      parseInt(DEV_USER_ID),
      'Dev User',
      parseInt(args[1])
    )
  }

  if (command === 'check-group-awards') {
    const toChatId = askForChatId()

    const sendAwards = async (chatId: number) => {
      console.log(`Checking group awards of chat: ${chatId}`)
      const awards = await awardsApi.getAwardsOf(chatId)

      const message = buildAwardsMessage(awards)

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await takeAction(sendAwards, toChatId)
  }

  if (command === 'simulate-end-of-month') {
    console.log(`Simulating end of month for dev chat: ${DEV_CHAT_ID}`)

    const simulateEndOfMonth = async () => {
      await handleEndOfMonth(bot, parseInt(DEV_CHAT_ID))
    }

    await simulateEndOfMonth()
  }

  if (command === 'send-current-awards') {
    const toChatId = askForChatId()

    const sendCurrentAwards = async (chatId: number) => {
      console.log(`Sending current awards to chat: ${chatId}`)
      const message = buildCurrentAwardsMessage()
      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await takeAction(sendCurrentAwards, toChatId)
  }

  bot.stop()
}

function askForChatId() {
  const chatIdResponse = prompt('Chat ID (press Enter for Test chat)')
  const cleanedChatIdResponse = chatIdResponse?.trim()

  return cleanedChatIdResponse ? parseInt(cleanedChatIdResponse) : undefined
}

function takeAction(action: any, chatId: number | undefined) {
  if (chatId) {
    return action(chatId)
  } else {
    console.log('Wrong chat ID, getting dev chat')
    return action(parseInt(DEV_CHAT_ID))
  }
}
