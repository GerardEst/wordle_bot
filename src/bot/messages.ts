import {
    getDaysRemainingInMonth,
    getCurrentMonth,
    isSummerTime,
    getFormatTime,
} from './utils.ts'
import { LEAGUE_NAMES, LEAGUE_EMOJI, EMOJI_REACTIONS, AWARDS } from '../conf.ts'
import { FormattedMessage, Award, Result, Player, lang } from '../interfaces.ts'
import { t } from '../translations.ts'

export function buildRankingMessageFrom(
    records: Result[],
    lang: lang
): FormattedMessage {
    if (!records || records.length === 0) {
        return {
            text: t('noGamesInChat', lang),
            parse_mode: 'Markdown',
        }
    }

    let answer = `${LEAGUE_EMOJI[lang][getCurrentMonth()]} *${
        LEAGUE_NAMES[lang][getCurrentMonth()]
    }* - ${t('classificationTitle', lang)} \n\n`
    answer += '```\n'
    answer += `Pos  ${t('name', lang)}            ${t('points', lang)}\n`
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
    answer += `\n${t('daisRemainingA', lang)}${getDaysRemainingInMonth()}${t(
        'daisRemainingB',
        lang
    )}\n\n`

    return {
        text: answer,
        parse_mode: 'Markdown',
    }
}

export function buildTimetrialRankingMessageFrom(
    records: Result[],
    lang: lang
): FormattedMessage {
    if (!records || records.length === 0) {
        return {
            text: t('noGamesInChat', lang),
            parse_mode: 'Markdown',
        }
    }

    let answer = `${LEAGUE_EMOJI[lang][getCurrentMonth()]} *${
        LEAGUE_NAMES[lang][getCurrentMonth()]
    }* - ${t('timetrialClassificationTitle', lang)} actual \n\n`
    answer += '```\n'
    answer += `Pos  ${t('name', lang)}            ${t('time', lang)}\n`
    answer += '—————————————————————————\n'

    records.forEach((user, index) => {
        // From seconds to HH:MM:SS
        const totalSeconds = user.totalTime
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            '0'
        )
        const seconds = String(totalSeconds % 60).padStart(2, '0')

        let rank = `${index + 1}`.padEnd(4)
        if (index === 0) rank = '🥇'
        else if (index === 1) rank = '🥈'
        else if (index === 2) rank = '🥉'
        else rank = ` ${index + 1} `
        const namePadded = `${user.name}`.padEnd(15)

        answer += `${rank} ${namePadded} ${hours}:${minutes}:${seconds}\n`
    })

    answer += '```' // End monospace block
    answer += `\n${t('daisRemainingA', lang)}${getDaysRemainingInMonth()}${t(
        'daisRemainingB',
        lang
    )}\n\n`

    return {
        text: answer,
        parse_mode: 'Markdown',
    }
}

export function buildPunctuationTableMessage(lang: lang): FormattedMessage {
    let message = `${t('legendTitle', lang)}\n\n`
    message += `1/6 - *6 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[6]
    }\n`
    message += `2/6 - *5 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[5]
    }\n`
    message += `3/6 - *4 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[4]
    }\n`
    message += `4/6 - *3 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[3]
    }\n`
    message += `5/6 - *2 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[2]
    }\n`
    message += `6/6 - *1 ${t('pointLowercase', lang)}* - ${
        EMOJI_REACTIONS[1]
    }\n`
    message += `X/6 - *0 ${t('pointsLowercase', lang)}* - ${
        EMOJI_REACTIONS[0]
    }\n`
    message += '\n'
    message += t('legendExplain', lang)

    return {
        text: message,
        parse_mode: 'Markdown',
    }
}

export function buildFinalAdviseMessage(lang: lang): FormattedMessage {
    return {
        text: `${t('finalAdviseTitleA', lang)}${
            isSummerTime() ? '23:00' : '22:00'
        }${t('finalAdviseTitleB', lang)}*${
            LEAGUE_NAMES[lang][getCurrentMonth()]
        }*\n${t('finalAdviseTitleC', lang)}`,
        parse_mode: 'Markdown',
    }
}

export function buildAwardsMessage(
    awards: Award[],
    lang: lang
): FormattedMessage {
    if (!awards || awards.length === 0) {
        return {
            text: `${t('showcaseTitle', lang)}\n\n${t(
                'showcaseNoTrophie',
                lang
            )}`,
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

    let message = `${t('showcaseTitle', lang)}\n`

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

export function buildCurrentAwardsMessage(lang: lang): FormattedMessage {
    const getAwardByPosition = (position: number) =>
        AWARDS[lang].find(
            (award) => award.id === parseInt(`${getCurrentMonth()}${position}`)
        )

    let message = `_${t('monthTrophiesTitle', lang)}${
        LEAGUE_NAMES[lang][getCurrentMonth()]
    }_\n\n`
    message += `*${t('normalLeague', lang)}*\n`
    message += `${getAwardByPosition(0)?.emoji} ${
        getAwardByPosition(0)?.name
    } \n`
    message += `${getAwardByPosition(1)?.emoji} ${
        getAwardByPosition(1)?.name
    } \n`
    message += `${getAwardByPosition(2)?.emoji} ${
        getAwardByPosition(2)?.name
    } \n`
    message += `\n*${t('timetrialLeague', lang)}*\n`
    message += `${getAwardByPosition(5)?.emoji} ${
        getAwardByPosition(5)?.name
    } \n`
    message += `${getAwardByPosition(6)?.emoji} ${
        getAwardByPosition(6)?.name
    } \n`
    message += `${getAwardByPosition(7)?.emoji} ${
        getAwardByPosition(7)?.name
    } \n`
    message += `\n${t('consolationTrophieMessage', lang)}\n\n`

    return {
        text: message,
        parse_mode: 'Markdown',
    }
}

export function buildNewAwardsMessage(
    results: Result[],
    timetrialResults: Result[],
    lang: lang
): FormattedMessage {
    let message = `*${LEAGUE_EMOJI[lang][getCurrentMonth()]} ${t(
        'endOfLeagueMessageA',
        lang
    )} ${LEAGUE_NAMES[lang][getCurrentMonth()]} ${
        LEAGUE_EMOJI[lang][getCurrentMonth()]
    }*\n\n`
    for (let i = 0; i < 3; i++) {
        if (!results[i]) continue

        const award = AWARDS[lang].find(
            (award) => award.id === parseInt(`${getCurrentMonth()}${i}`)
        )
        message += `*${results[i].name}*, ${t('endOfLeagueMessageB', lang)} *${
            results[i].total
        } ${t('endOfLeagueMessageC', lang)} *${award?.name} ${award?.emoji}*\n`
    }

    message += '\n'

    for (let i = 0; i < 3; i++) {
        if (!timetrialResults[i]) continue

        const award = AWARDS[lang].find(
            (award) => award.id === parseInt(`${getCurrentMonth()}${i + 5}`)
        )
        message += `*${timetrialResults[i].name}*, ${t(
            'endOfLeagueMessageD',
            lang
        )} *${getFormatTime(timetrialResults[i].totalTime)}*, ${t(
            'endOfLeagueMessageE',
            lang
        )} *${award?.name} ${award?.emoji}*\n`
    }

    message += '\n'

    const award = AWARDS[lang].find(
        (award) => award.id === parseInt(`${getCurrentMonth()}9`)
    )

    message += `${t(
        'endOfLeagueMessageF',
        lang
    )} ${award?.name.toLowerCase()} ${award?.emoji}!\n\n`
    message += `\n${t('endOfLeagueMessageG', lang)}*${
        LEAGUE_NAMES[lang][getCurrentMonth() + 1]
    }*!`
    message += `\n\n${t('endOfLeagueMessageH', lang)}`

    return {
        text: message,
        parse_mode: 'Markdown',
    }
}

export function buildCharactersActionsMessage(
    name: string,
    points: number,
    time: string
): FormattedMessage {
    return {
        text: `*${name}*\n🎯 ${7 - points}/6\n⏳ ${time}`,
        parse_mode: 'Markdown',
    }
}

export function buildTopMessage(
    topPlayers: Player[],
    lang: lang
): FormattedMessage {
    let message = `${t('topTitle', lang)}\n\n`

    if (topPlayers.length === 0) {
        message = t('topNoPlayers', lang)
    } else {
        const medals = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
        topPlayers.forEach((player, index) => {
            const medal = medals[index] || '🏅'
            message += `${medal} ${player.name}: ${player.total} punts\n`
        })
    }

    return { text: message, parse_mode: 'Markdown' }
}
