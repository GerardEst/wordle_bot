import { setupActions } from './src/bot/actions.ts'
import { startUp } from './src/bot/startup.ts'
import { setupCronjobs } from './src/cronjobs/cronjobs.ts'

const bot = startUp(Deno.env.get('TELEGRAM_TOKEN')!)
setupActions(bot)
setupCronjobs(bot)
