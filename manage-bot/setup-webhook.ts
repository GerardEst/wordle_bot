console.log('Setting up webhook for Telegram bot...')

async function setupWebhook() {
  const token = Deno.env.get('TELEGRAM_TOKEN')
  const domain = Deno.env.get('DOMAIN')

  const telegramApiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${domain}`

  console.log(`Setting webhook to: ${domain}`)

  try {
    const response = await fetch(telegramApiUrl)
    const data = await response.json()

    if (data.ok) {
      console.log('✅ Webhook setup successful!')
      console.log(data)
    } else {
      console.error('❌ Webhook setup failed:', data)
    }
  } catch (error) {
    console.error('❌ Error setting webhook:', error)
  }
}

setupWebhook()
