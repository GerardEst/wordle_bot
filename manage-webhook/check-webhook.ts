import 'jsr:@std/dotenv/load'

const token = Deno.env.get('TELEGRAM_TOKEN')
const telegramApiUrl = `https://api.telegram.org/bot${token}/getWebhookInfo`

try {
  const res = await fetch(telegramApiUrl)
  const data = await res.json()

  console.log(data.result)
} catch (error) {
  console.error('❌ Error checking webhook:', error)
}
