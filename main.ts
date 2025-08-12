import { setupCommands } from './src/bot/commands.ts'
import { startUp } from './src/bot/startup.ts'
import { setupCronjobs } from './src/cronjobs/cronjobs.ts'

const bot_lang = Deno.env.get('BOT_LANG') as 'cat' | 'es'

console.log(`Launching bot version: ${bot_lang}`)

const bot = startUp(
    bot_lang === 'cat'
        ? Deno.env.get('TELEGRAM_TOKEN_CAT')!
        : Deno.env.get('TELEGRAM_TOKEN_ES')!
)
setupCommands(bot, bot_lang)
setupCronjobs(bot, bot_lang)
