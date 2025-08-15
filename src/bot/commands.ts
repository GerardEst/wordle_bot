import { Bot, Context, Keyboard } from 'https://deno.land/x/grammy/mod.ts'
import * as api from '../api/games.ts'
import * as charactersApi from '../api/characters.ts'
import * as awardsApi from '../api/awards.ts'
import {
    buildRankingMessageFrom,
    buildPunctuationTableMessage,
    buildAwardsMessage,
    buildCurrentAwardsMessage,
    buildTopMessage,
    buildTimetrialRankingMessageFrom,
} from './messages.ts'
import { getPoints, getTime } from './utils.ts'
import { EMOJI_REACTIONS } from '../conf.ts'
import { getAllCharacters, getChatCharacters } from '../api/characters.ts'
import { lang } from '../interfaces.ts'
import { t } from '../translations.ts'

export function setupCommands(bot: Bot, bot_lang: lang) {
    bot.command(t('classification', bot_lang), (ctx: Context) =>
        sendClasification(ctx, bot_lang)
    )
    bot.command(t('timetrial', bot_lang), (ctx: Context) => {
        sendTimetrialClassification(ctx, bot_lang)
    })
    bot.command(t('legend', bot_lang), (ctx: Context) => {
        sendLegend(ctx, bot_lang)
    })
    bot.command(t('trophies', bot_lang), (ctx: Context) => {
        showTrophiesOptions(ctx, bot_lang)
    })
    bot.command('top', (ctx: Context) => {
        sendTop(ctx, bot_lang)
    })
    bot.command(t('addCharacter', bot_lang), (ctx: Context) => {
        sendAddCharacterOptions(ctx, bot_lang)
    })
    bot.command(t('removeCharacter', bot_lang), (ctx: Context) => {
        sendRemoveCharacterOptions(ctx, bot_lang)
    })
    bot.command(t('instructions', bot_lang), (ctx: Context) => {
        sendInstructions(ctx, bot_lang)
    })

    // Welcome message when bot is added to a group
    bot.on('my_chat_member', (ctx: Context) => {
        handleChatMemberUpdate(ctx, bot_lang)
    })

    bot.on('message', (ctx: Context) => {
        reactToMessage(ctx, bot_lang)
    })
}

async function reactToMessage(ctx: Context, lang: lang) {
    if (!ctx.message || !ctx.message.text) return

    const isFromLang = checkLang(ctx.message.text)

    if (isFromLang && isFromLang === lang) {
        await reactToGame(ctx, isFromLang)
    } else if (ctx.message.text.includes(t('add', lang))) {
        sendAddCharacter(ctx, lang)
    } else if (ctx.message.text.includes(t('remove', lang))) {
        sendRemoveCharacter(ctx, lang)
    } else if (ctx.message.text === t('showcase', lang)) {
        sendShowcase(ctx, lang)
    } else if (ctx.message.text === t('monthTrophies', lang)) {
        sendMonthTrophies(ctx, lang)
    } else if (ctx.message.text === t('closeOptions', lang)) {
        await ctx.reply(t('optionsClosed', lang), {
            reply_markup: { remove_keyboard: true },
        })
    }
}

function checkLang(message: string) {
    if (message.includes('#mooot')) return 'cat'
    if (message.includes('#wardle_es')) return 'es'
    if (message.includes('#wardle_en')) return 'en'
    return null
}

async function sendClasification(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const records = await api.getChatRanking(ctx.chat.id, 'month', lang)
    const message = buildRankingMessageFrom(records, lang)

    ctx.reply(message.text, { parse_mode: message.parse_mode })
}

async function sendTimetrialClassification(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const records = await api.getChatRanking(
        ctx.chat.id,
        'month',
        lang,
        undefined,
        true
    )
    const message = buildTimetrialRankingMessageFrom(records, lang)

    ctx.reply(message.text, { parse_mode: message.parse_mode })
}

function sendLegend(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const message = buildPunctuationTableMessage(lang)
    ctx.reply(message.text, { parse_mode: message.parse_mode })
}

function showTrophiesOptions(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const keyboard = new Keyboard()
    keyboard.text(t('showcase', lang))
    keyboard.row()
    keyboard.text(t('monthTrophies', lang))
    keyboard.row()
    keyboard.text(t('closeOptions', lang))
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply(t('selectOption', lang), { reply_markup: keyboard })
}

async function sendTop(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const topPlayers = await api.getTopPlayersGlobal(lang)
    const message = buildTopMessage(topPlayers, lang)

    ctx.reply(message.text, { parse_mode: 'Markdown' })
}

async function sendAddCharacterOptions(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const allCharacters = await getAllCharacters(lang)

    const keyboard = new Keyboard()
    for (const character of allCharacters) {
        keyboard.text(t('add', lang) + character.name)
        keyboard.row()
    }
    keyboard.text(t('closeOptions', lang))
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply(t('selectOption', lang), { reply_markup: keyboard })
}

async function sendRemoveCharacterOptions(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const chatCharacters = await getChatCharacters(ctx.chat.id)

    if (chatCharacters.length === 0) {
        ctx.reply(t('noCharacters', lang))
        return
    }

    const keyboard = new Keyboard()
    for (const character of chatCharacters) {
        keyboard.text(t('remove', lang) + character.name)
        keyboard.row()
    }
    keyboard.text(t('closeOptions', lang))
    keyboard.resized()
    keyboard.oneTime()

    ctx.reply(t('whichCharaterToDelete', lang), { reply_markup: keyboard })
}

async function sendAddCharacter(ctx: Context, lang: lang) {
    const message = ctx.message
    if (!message || !message.text) return

    const characterName = message.text.split(t('add', lang))[1]
    await charactersApi.addCharacterToChat(ctx.message.chat.id, characterName)

    ctx.reply(`${characterName} ${t('charHasBeenAdded', lang)}`, {
        reply_markup: { remove_keyboard: true },
    })
}

async function sendRemoveCharacter(ctx: Context, lang: lang) {
    const message = ctx.message
    if (!message || !message.text) return

    const characterName = message.text.split(t('remove', lang))[1]
    const deletedChar = await charactersApi.removeCharacterFromChat(
        ctx.message.chat.id,
        characterName
    )
    if (deletedChar) {
        ctx.reply(`${characterName} ${t('charHasBeenRemoved', lang)}`, {
            reply_markup: { remove_keyboard: true },
        })
    } else {
        ctx.reply(t('cantRemoveChar', lang))
    }
}

async function sendShowcase(ctx: Context, lang: lang) {
    const message = ctx.message
    if (!message || !message.text) return

    const awards = await awardsApi.getAwardsOf(message.chat.id, lang)
    const replyMessage = buildAwardsMessage(awards, lang)

    ctx.reply(replyMessage.text, {
        parse_mode: replyMessage.parse_mode,
        reply_markup: { remove_keyboard: true },
    })
}

function sendMonthTrophies(ctx: Context, lang: lang) {
    const message = buildCurrentAwardsMessage(lang)

    ctx.reply(message.text, {
        parse_mode: message.parse_mode,
        reply_markup: { remove_keyboard: true },
    })
}

async function reactToGame(ctx: Context, lang: lang) {
    if (!ctx.message || !ctx.message.text) return

    const points = getPoints(ctx.message.text)
    const time = getTime(ctx.message.text)

    const userTodayGames = await api.getChatPunctuations(
        ctx.message.chat.id,
        'day',
        lang,
        ctx.message.from.id
    )

    const isGameToday = userTodayGames.length > 0

    try {
        await (isGameToday
            ? ctx.react('🌚')
            : ctx.react(EMOJI_REACTIONS[points]))
    } catch (error: any) {
        console.error('Failed to react to message:', error.message)
    }

    // We don't save the game if user already have a game today
    if (isGameToday) return

    // Save player game
    await api.createRecord({
        chatId: ctx.message.chat.id,
        userId: ctx.message.from.id,
        userName: `${ctx.message.from.first_name} ${
            ctx.message.from.last_name || ''
        }`.trim(),
        points,
        time,
        lang,
    })
}

function sendInstructions(ctx: Context, lang: lang) {
    if (!ctx.chat) return

    const message = t('instructionsMessage', lang)
    ctx.reply(message, { parse_mode: 'Markdown' })
}

async function handleChatMemberUpdate(ctx: Context, lang: lang) {
    if (!ctx.myChatMember || !ctx.chat) return

    const { old_chat_member, new_chat_member } = ctx.myChatMember

    // Check if bot was just added to the group
    if (
        old_chat_member.status === 'left' &&
        (new_chat_member.status === 'member' ||
            new_chat_member.status === 'administrator')
    ) {
        const welcomeMessage = t('welcomeMessage', lang)
        await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' })
    }
}
