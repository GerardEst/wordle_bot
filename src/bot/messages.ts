import {
  getDaysRemainingInMonth,
  getCurrentMonth,
  isSummerTime,
} from './utils.ts'
import { LEAGUE_NAMES, LEAGUE_EMOJI, EMOJI_REACTIONS, AWARDS } from '../conf.ts'
import { FormattedMessage, Award, Result, Player } from '../interfaces.ts'

// Define an interface for formatted messages

export function buildRankingMessageFrom(records: Result[]): FormattedMessage {
  if (!records || records.length === 0) {
    return {
      text: 'Encara no hi ha puntuacions en aquest xat',
      parse_mode: 'Markdown',
    }
  }

  let answer = `${LEAGUE_EMOJI[getCurrentMonth()]} *${
    LEAGUE_NAMES[getCurrentMonth()]
  }* - Classificació actual \n\n`
  answer += '```\n'
  answer += 'Pos  Nom            Punts\n'
  answer += '—————————————————————————\n'

  records.forEach((user, index) => {
    let rank = `${index + 1}`.padEnd(4)
    if (index === 0) rank = '🥇'
    else if (index === 1) rank = '🥈'
    else if (index === 2) rank = '🥉'
    else rank = ` ${index + 1} `
    const namePadded = `${user.name}`.padEnd(15)

    answer += `${rank} ${namePadded} ${user.total}\n`
  })

  answer += '```' // End monospace block
  answer += `\nFalten *${getDaysRemainingInMonth()} dies* pel final de la lliga!\n\n`

  return {
    text: answer,
    parse_mode: 'Markdown',
  }
}

export function buildPunctuationTableMessage(): FormattedMessage {
  let message = '*🧮 Taula de puntuacions i reaccions*\n\n'
  message += `1/6 - *6 punts* - ${EMOJI_REACTIONS[6]}\n`
  message += `2/6 - *5 punts* - ${EMOJI_REACTIONS[5]}\n`
  message += `3/6 - *4 punts* - ${EMOJI_REACTIONS[4]}\n`
  message += `4/6 - *3 punts* - ${EMOJI_REACTIONS[3]}\n`
  message += `5/6 - *2 punts* - ${EMOJI_REACTIONS[2]}\n`
  message += `6/6 - *1 punt* - ${EMOJI_REACTIONS[1]}\n`
  message += `X/6 - *0 punts* - ${EMOJI_REACTIONS[0]}\n`
  message += '\n'
  message += `S'otorgaran els punts al enviar els resultats al xat, i es reaccionarà al comentari amb l'emoji corresponent`

  return {
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildFinalAdviseMessage(): FormattedMessage {
  return {
    text: `🐣 *Anunci important*\n\nAvui a les ${
      isSummerTime() ? '23:00' : '22:00'
    } acaba la *${
      LEAGUE_NAMES[getCurrentMonth()]
    }*\nEnvieu els vostres resultats d'avui _abans d'aquesta hora_!`,
    parse_mode: 'Markdown',
  }
}

export function buildAwardsMessage(awards: Award[]): FormattedMessage {
  if (!awards || awards.length === 0) {
    return {
      text: '_Vitrina virtual amb tots els premis que heu guanyat_\n\nNingú ha guanyat cap trofeu encara',
      parse_mode: 'Markdown',
    }
  }

  const awardsByUser: Record<string, Award[]> = {}

  for (const award of awards) {
    if (!awardsByUser[award.userName]) {
      awardsByUser[award.userName] = []
    }
    awardsByUser[award.userName].push(award)
  }

  let message = '_Vitrina virtual amb tots els premis que heu guanyat_\n'

  const userEntries = Object.entries(awardsByUser)

  userEntries.forEach((entry) => {
    const [userName, userAwards] = entry

    message += `\n*${userName}*\n`
    message += '╔\n'

    userAwards.forEach((award, awardIndex) => {
      const isLastAward = awardIndex === userAwards.length - 1
      message += `  ${award.emoji} ${award.name} \n`

      if (isLastAward) {
        message += '╚\n'
      } else {
        message += '╠\n'
      }
    })
  })

  return {
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildCurrentAwardsMessage(): FormattedMessage {
  const getAwardByPosition = (position: number) =>
    AWARDS.find(
      (award) => award.id === parseInt(`${getCurrentMonth()}${position}`)
    )

  let message = `_Premis en joc a la ${LEAGUE_NAMES[getCurrentMonth()]}_\n\n`
  message += `1r premi:*${getAwardByPosition(0)?.emoji} ${
    getAwardByPosition(0)?.name
  } *\n\n`
  message += `2n premi:*${getAwardByPosition(1)?.emoji} ${
    getAwardByPosition(1)?.name
  } *\n\n`
  message += `3r premi:*${getAwardByPosition(2)?.emoji} ${
    getAwardByPosition(2)?.name
  } *\n\n`

  return {
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildNewAwardsMessage(results: Result[]): FormattedMessage {
  let message = `*${LEAGUE_EMOJI[getCurrentMonth()]} Final de la ${
    LEAGUE_NAMES[getCurrentMonth()]
  } ${LEAGUE_EMOJI[getCurrentMonth()]}*\n\n`
  for (let i = 0; i < 3; i++) {
    if (!results[i]) continue

    const award = AWARDS.find(
      (award) => award.id === parseInt(`${getCurrentMonth()}${i}`)
    )
    message += `*${results[i].name}*, amb *${results[i].total} punts*, rep el trofeu *${award?.name} ${award?.emoji}*\n\n`
  }
  message += `\nEnhorabona a tots! 🥳 I recordeu que demà comença la *${
    LEAGUE_NAMES[getCurrentMonth() + 1]
  }*!`
  message += `\n\n_Podeu veure els premis enviant /premis_`

  return {
    text: message,
    parse_mode: 'Markdown',
  }
}

export function buildCharactersActionsMessage(
  name: string,
  points: number
): FormattedMessage {
  return {
    text: `*${name}* acaba de jugar i ha aconseguit *${points} punt${
      points === 1 ? '' : 's'
    }*.`,
    parse_mode: 'Markdown',
  }
}

export function buildTopMessage(topPlayers: Player[]): FormattedMessage {
  let message = '⭐️ *Top 3 mundial*\n\n'

  if (topPlayers.length === 0) {
    message = 'Encara no hi ha jugadors aquest mes'
  } else {
    const medals = ['1️⃣', '2️⃣', '3️⃣']
    topPlayers.forEach((player, index) => {
      const medal = medals[index] || '🏅'
      message += `${medal} ${player.name}: ${player.total} punts\n`
    })
  }

  return { text: message, parse_mode: 'Markdown' }
}

export function buildWordDifficultyMessage(
  difficulty: number
): FormattedMessage {
  const difficultyWord =
    difficulty < 2.5
      ? '⚪️ Impensablement fàcil'
      : difficulty <= 3
      ? '🟢 Xupada'
      : difficulty <= 5
      ? '🟡 Normaleta'
      : difficulty < 8
      ? '🔴 Difícil'
      : '⚫️ Impossible'

  console.log(difficulty)
  return {
    text: `Dificultat estimada de la paraula d'avui\n *${difficultyWord}*`,
    parse_mode: 'Markdown',
  }
}
