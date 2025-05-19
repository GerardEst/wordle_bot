import * as api from '../api/db.ts'

const dev = Deno.env.get('ENV') === 'dev'

export function setupCronjobs(bot: Bot) {
  // TODO - Ordenar i llançar funcions quan jo vulgui, no amb un cronjob que ja he vist que funciona i
  // ja em quedo tranquil. Ha de tirar sempre els missatges contra el chat de test, que s'hauria de definir a env
  // I fer una carpeta de messages on tenir tots els missatges en arxius separats

  //   if (dev) {
  //     Deno.cron('Run once a minute', '* * * * *', () => {
  //       console.log('Hello, cron!')
  //       sendResultsToChats(bot, 'dev')
  //     })
  //   }

  Deno.cron(
    'Send a message at 10 of every end of month',
    '0 10 28-31 * *',
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

  // Activate cronjob at 22 everyday for deno deploy cronjobs limitations,
  // but check if it's last day inside the function
  Deno.cron(
    'Send a message at 22 of every end of month',
    '0 22 28-31 * *',
    () => {
      const now = new Date()
      const isLastDay =
        now.getDate() ===
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

      if (isLastDay) {
        sendResultsToChats(bot)
      }
    }
  )
}

async function sendResultsToChats(bot: Bot, dev: boolean = false) {
  let chats = await api.getChats()

  console.log(chats)
  if (dev) {
    chats = chats.filter((chat) => chat === -4855044022)
    console.log(chats)
  }

  for (const chat of chats) {
    const results = await api.getChatPunctuations(chat, 'month')
    const message = buildResultsMessage(results)
    await bot.api.sendMessage(chat, message.text, {
      parse_mode: message.parse_mode,
    })
  }
}

async function sendEndAdviseToChats(bot: Bot, dev: boolean = false) {
  const message = buildEndAdviseMessage()
  let chats = await api.getChats()

  if (dev) {
    chats = chats.filter((chat) => chat === -4855044022)
  }

  for (const chat of chats) {
    await bot.api.sendMessage(chat.id, message.text, {
      parse_mode: message.parse_mode,
    })
  }
}

function buildEndAdviseMessage() {
  return {
    text: `🐣 *Anunci important*\n\nAvui a les 22:00 acaba la *Lliga de ${getCurrentMonth()}*\nEnvieu els vostres resultats d'avui _abans d'aquesta hora_!`,
    parse_mode: 'Markdown',
  }
}

function buildResultsMessage(results: any) {
  // Sort results by score (descending)
  const sortedResults = [...results].sort((a, b) => b.score - a.score)

  // Create podium visualization
  let podiumText = `<b>🏆 FINAL DE LA LLIGA DE ${getCurrentMonth()}! 🏆</b>\n\n`

  // Add podium emojis for top 3
  if (sortedResults.length > 0) {
    podiumText += `🥇 <b>${
      sortedResults[0]?.fields['Nom Usuari'] || '?'
    }</b>: ${sortedResults[0]?.fields['Puntuació'] || 0} punts\n`
  }

  if (sortedResults.length > 1) {
    podiumText += `🥈 <b>${
      sortedResults[1]?.fields['Nom Usuari'] || '?'
    }</b>: ${sortedResults[1]?.fields['Puntuació'] || 0} punts\n`
  }

  if (sortedResults.length > 2) {
    podiumText += `🥉 <b>${
      sortedResults[2]?.fields['Nom Usuari'] || '?'
    }</b>: ${sortedResults[2]?.fields['Puntuació'] || 0} punts\n`
  }

  return {
    text: podiumText,
    parse_mode: 'HTML',
  }
}

function getCurrentMonth() {
  const now = new Date()
  return now.toLocaleString('default', { month: 'long' })
}
