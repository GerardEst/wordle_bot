const token = Deno.env.get('TELEGRAM_TOKEN')
const telegramApiUrl = `https://api.telegram.org/bot${token}/getWebhookInfo`

async function checkWebhook() {
  try {
    const res = await fetch(telegramApiUrl)
    const data = await res.json()

    console.log(data.result)
  } catch (error) {
    console.error('❌ Error checking webhook:', error)
  }
}

checkWebhook()
