async function checkWebhook(bot: 'es' | 'cat') {
    const token =
        bot === 'cat'
            ? Deno.env.get('TELEGRAM_TOKEN_CAT')!
            : Deno.env.get('TELEGRAM_TOKEN_ES')!

    const telegramApiUrl = `https://api.telegram.org/bot${token}/getWebhookInfo`
    try {
        const res = await fetch(telegramApiUrl)
        const data = await res.json()

        console.log(data.result)
    } catch (error) {
        console.error(`❌ Error checking webhook for bot ${bot}:`, error)
    }
}

checkWebhook('es')
checkWebhook('cat')
