import * as api from '../api/games.ts'
import { Bot } from 'https://deno.land/x/grammy/mod.ts'
import {
    buildFinalAdviseMessage,
    buildCharactersActionsMessage,
    buildNewAwardsMessage,
} from '../bot/messages.ts'
import { getChatCharacters } from '../api/characters.ts'
import {
    getPointsForHability,
    getCurrentMonth,
    getTimeForHability,
    getFormatTime,
} from '../bot/utils.ts'
import { giveAwardTo } from '../api/awards.ts'
import { lang, Result } from '../interfaces.ts'

export function setupCronjobs(bot: Bot, lang: lang) {
    Deno.cron(
        'Send league end advise msg at 9 or 10 of every end of month',
        '0 8 28-31 * *',
        () => {
            const now = new Date()
            const isLastDay =
                now.getDate() ===
                new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

            if (isLastDay) {
                sendEndAdviseToChats(bot, lang)
            }
        }
    )

    Deno.cron(
        'End league at 22 or 23 of every end of month',
        '0 21 28-31 * *',
        () => {
            const now = new Date()
            const isLastDay =
                now.getDate() ===
                new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

            if (isLastDay) handleEndOfMonth(bot, lang)
        }
    )

    Deno.cron(
        'Send characters actions at 12 or 13 of every day',
        '0 11 * * *',
        () => {
            sendCharactersActions(bot, lang)
        }
    )
}

async function sendEndAdviseToChats(bot: Bot, lang: lang) {
    const message = buildFinalAdviseMessage(lang)
    const chats = await api.getChats(lang)

    for (const chat of chats) {
        await bot.api.sendMessage(chat, message.text, {
            parse_mode: message.parse_mode,
        })
    }
}

export async function handleEndOfMonth(bot: Bot, lang: lang, chatId?: number) {
    const chats = chatId ? [chatId] : await api.getChats(lang)

    for (const chat of chats) {
        const results = await api.getChatRanking(chat, 'month', lang)
        const timetrialResults = await api.getChatRanking(
            chat,
            'month',
            lang,
            undefined,
            true
        )

        await saveAwardsToDb(chat, results, timetrialResults, lang)
        await sendResultsToChats(bot, chat, results, timetrialResults, lang)
    }
}

async function saveAwardsToDb(
    chat: number,
    results: Result[],
    timetrialResults: Result[],
    lang: lang
) {
    const top3PlayerIds = new Set<number>()
    const MAXIMUM_CHARACTER_ID = 100

    // Award top 3 positions
    for (let i = 0; i < 3; i++) {
        // If the id is from a npc (id>MAXIMUM_CHARACTER_ID), skip the trophy. NPCs don't win trophies.
        if (results[i] && results[i].id > MAXIMUM_CHARACTER_ID) {
            await giveAwardTo(
                chat,
                results[i].id,
                parseInt(`${getCurrentMonth()}${i}`),
                lang
            )
            top3PlayerIds.add(results[i].id)
        }

        if (
            timetrialResults[i] &&
            timetrialResults[i].id > MAXIMUM_CHARACTER_ID
        ) {
            await giveAwardTo(
                chat,
                timetrialResults[i].id,
                parseInt(`${getCurrentMonth()}${i + 5}`),
                lang
            )
            top3PlayerIds.add(timetrialResults[i].id)
        }
    }

    // Give consolation trophy only to players who didn't get top 3 in any league
    const consolationTrophyId = parseInt(`${getCurrentMonth()}9`)

    for (const player of results) {
        if (!top3PlayerIds.has(player.id) && player.id > MAXIMUM_CHARACTER_ID) {
            await giveAwardTo(chat, player.id, consolationTrophyId, lang)
        }
    }
}

async function sendResultsToChats(
    bot: Bot,
    chat: number,
    results: Result[],
    timetrialResults: Result[],
    lang: lang
) {
    const message = buildNewAwardsMessage(results, timetrialResults, lang)

    await bot.api.sendMessage(chat, message.text, {
        parse_mode: message.parse_mode,
    })
}

export async function sendCharactersActions(
    bot: Bot,
    lang: lang,
    chatId?: number
) {
    const chats = chatId ? [chatId] : await api.getChats(lang)

    for (const chat of chats) {
        const characters = await getChatCharacters(chat)

        for (const character of characters) {
            const points = getPointsForHability(character.hability)
            const time = getTimeForHability(character.hability)

            await api.createRecord({
                chatId: chat,
                characterId: character.id,
                points,
                time,
                lang,
            })

            const formattedTime = getFormatTime(time)
            const message = buildCharactersActionsMessage(
                character.name,
                points,
                formattedTime
            )

            await bot.api.sendMessage(chat, message.text, {
                parse_mode: message.parse_mode,
                disable_notification: true
            })
        }
    }
}
