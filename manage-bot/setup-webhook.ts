import { lang } from '../src/interfaces.ts'

console.log('Setting up webhook for Telegram bot...')

async function setupWebhook(bot: lang) {
    const token = Deno.env.get(`TELEGRAM_TOKEN_${bot.toUpperCase()}`)
    const domain = Deno.env.get(`DOMAIN_${bot.toUpperCase()}`)

    const telegramApiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${domain}`

    console.log(`Setting webhook to: ${domain}`)

    try {
        const response = await fetch(telegramApiUrl)
        const data = await response.json()

        if (data.ok) {
            console.log(`Webhook for ${bot} setup successful!`)
            console.log(data)
        } else {
            console.error(`Webhook setup for ${bot} failed:`, data)
        }
    } catch (error) {
        console.error(`Error setting webhook for ${bot}:`, error)
    }
}

setupWebhook('cat')
setupWebhook('es')
setupWebhook('en')
