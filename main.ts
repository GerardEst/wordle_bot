import { setupCommands } from './src/bot/commands.ts'
import { startUp } from './src/bot/startup.ts'
import { setupCronjobs } from './src/cronjobs/cronjobs.ts'

const bot = startUp(Deno.env.get('TELEGRAM_TOKEN')!)
setupCommands(bot)
setupCronjobs(bot)
