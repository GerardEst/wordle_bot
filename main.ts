import { setupCommands } from './src/bot/commands.ts'
import { startUp } from './src/bot/startup.ts'
import { setupCronjobs } from './src/cronjobs/cronjobs.ts'

// Debug environment variables
console.log('All environment variables:', Object.fromEntries(Deno.env.toObject()))
console.log('BOT_LANG raw value:', Deno.env.get('BOT_LANG'))

const bot_lang = (Deno.env.get('BOT_LANG') as 'cat' | 'es') || 'cat'

console.log(`Launching bot version: ${bot_lang}`)

const bot = startUp(
    bot_lang === 'cat'
        ? Deno.env.get('TELEGRAM_TOKEN_CAT')!
        : Deno.env.get('TELEGRAM_TOKEN_ES')!
)
setupCommands(bot, bot_lang)
setupCronjobs(bot, bot_lang)
