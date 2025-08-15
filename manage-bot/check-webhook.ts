import { lang } from '../src/interfaces.ts'

async function checkWebhook(bot: lang) {
    const token = Deno.env.get(`TELEGRAM_TOKEN_${bot.toUpperCase()}`)!

    const telegramApiUrl = `https://api.telegram.org/bot${token}/getWebhookInfo`
    try {
        const res = await fetch(telegramApiUrl)
        const data = await res.json()

        console.log(data.result)
    } catch (error) {
        console.error(`❌ Error checking webhook for bot ${bot}:`, error)
    }
}

checkWebhook('cat')
checkWebhook('en')
checkWebhook('es')
