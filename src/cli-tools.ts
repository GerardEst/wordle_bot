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
    const chatIdResponse = prompt('Chat ID (press Enter for Test chat)')
    const cleanedChatIdResponse = chatIdResponse?.trim()

    const sendRanking = async (chatId: number) => {
      console.log(`Sending ranking of chat: ${chatId}`)
      const records = await api.getChatRanking(chatId, 'month')

      const message = buildRankingMessageFrom(records)

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    if (cleanedChatIdResponse) {
      if (isNaN(parseInt(cleanedChatIdResponse))) {
        console.log('Invalid chat ID, getting dev chat')
        await sendRanking(parseInt(DEV_CHAT_ID))
      } else {
        await sendRanking(parseInt(cleanedChatIdResponse))
      }
    } else {
      console.log('No chat ID provided, getting dev chat')
      await sendRanking(parseInt(DEV_CHAT_ID))
    }
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
    console.log(`Checking group awards for dev chat: ${DEV_CHAT_ID}`)

    const sendAwards = async () => {
      const awards = await awardsApi.getAwardsOf(parseInt(DEV_CHAT_ID))

      const message = buildAwardsMessage(awards)

      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await sendAwards()
  }

  if (command === 'simulate-end-of-month') {
    console.log(`Simulating end of month for dev chat: ${DEV_CHAT_ID}`)

    const simulateEndOfMonth = async () => {
      await handleEndOfMonth(bot, parseInt(DEV_CHAT_ID))
    }

    await simulateEndOfMonth()
  }

  if (command === 'send-current-awards') {
    console.log(`Sending current awards to dev chat: ${DEV_CHAT_ID}`)

    const sendCurrentAwards = async () => {
      const message = buildCurrentAwardsMessage()
      await bot.api.sendMessage(DEV_CHAT_ID, message.text, {
        parse_mode: message.parse_mode,
      })
    }

    await sendCurrentAwards()
  }

  bot.stop()
}
