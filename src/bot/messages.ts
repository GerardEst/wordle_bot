import { getDaysRemainingInMonth, getCurrentMonth } from './utils.ts'
import { LEAGUE_NAMES } from '../conf.ts'

// Define an interface for formatted messages
interface FormattedMessage {
  text: string
  parse_mode: 'HTML' | 'Markdown' | 'MarkdownV2'
}

export function buildRankingMessageFrom(records: any[]): FormattedMessage {
  console.log('records', records)

  if (!records || records.length === 0) {
    return {
      text: 'Encara no hi ha puntuacions en aquest xat',
      parse_mode: 'Markdown',
    }
  }

  const ranking = getCleanedRanking(records)
  let answer = `*${LEAGUE_NAMES[getCurrentMonth()]}*\n\n`
  answer += '🏆 *Classificació actual* 🏆\n\n'
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

  return {
    text: answer,
    parse_mode: 'Markdown',
  }
}

export function buildPunctuationTableMessage(): FormattedMessage {
  let message = '*🧮 Taula de puntuacions i reaccions*\n\n'
  message += '1/6 - *6 punts* - 🏆\n'
  message += '2/6 - *5 punts* - 🤯\n'
  message += '3/6 - *4 punts* - 😎\n'
  message += '4/6 - *3 punts* - 😐\n'
  message += '5/6 - *2 punts* - 😭\n'
  message += '6/6 - *1 punt* -- 🤡\n'
  message += 'X/6 - *0 punts* - 🤷\n'
  message += '\n'
  message += `S'otorgaran els punts al enviar els resultats al xat, i es reaccionarà al comentari amb l'emoji corresponent`

  return {
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildFinalAdviseMessage(): FormattedMessage {
  return {
    text: `🐣 *Anunci important*\n\nAvui a les 22:00 acaba la *${
      LEAGUE_NAMES[getCurrentMonth()]
    }*\nEnvieu els vostres resultats d'avui _abans d'aquesta hora_!`,
    parse_mode: 'Markdown',
  }
}

export function buildFinalResultsMessage(results: any[]): FormattedMessage {
  // Sort results by score (descending)
  const sortedResults = [...results].sort(
    (a, b) => b.fields['Puntuació'] - a.fields['Puntuació']
  )

  // Create podium visualization
  let podiumText = `<b>🏆 Final de ${
    LEAGUE_NAMES[getCurrentMonth()]
  }! 🏆</b>\n\n`

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

export function getCleanedRanking(records: any[]) {
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
