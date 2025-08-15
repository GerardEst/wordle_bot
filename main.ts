import { setupCommands } from './src/bot/commands.ts'
import { startUp } from './src/bot/startup.ts'
import { setupCronjobs } from './src/cronjobs/cronjobs.ts'
import { lang } from './src/interfaces.ts'

// We need a default for deployment. In runtime it gets the lang from env correctly
const bot_lang = (Deno.env.get('BOT_LANG') as lang) || 'cat'

console.log(`Launching bot version: ${bot_lang}`)

const bot = startUp(Deno.env.get(`TELEGRAM_TOKEN_${bot_lang.toUpperCase()}`)!)

setupCommands(bot, bot_lang)
setupCronjobs(bot, bot_lang)
