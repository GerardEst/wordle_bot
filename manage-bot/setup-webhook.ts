console.log('Setting up webhook for Telegram bot...')

async function setupWebhook(bot: 'es' | 'cat') {
    const token =
        bot === 'cat'
            ? Deno.env.get('TELEGRAM_TOKEN_CAT')
            : Deno.env.get('TELEGRAM_TOKEN_ES')

    const domain =
        bot === 'cat' ? Deno.env.get('DOMAIN_CAT') : Deno.env.get('DOMAIN_ES')

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

setupWebhook('es')
setupWebhook('cat')
