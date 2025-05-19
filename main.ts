import { setupActions } from './src/bot/actions.ts'
import { startUp } from './src/bot/startup.ts'

const bot = startUp(Deno.env.get('TELEGRAM_TOKEN')!)

setupActions(bot)

// Define cronjobs
Deno.cron('Run once a minute', '* * * * *', () => {
  console.log('Hello, cron!')
})
