import { Bot, webhookCallback } from 'https://deno.land/x/grammy/mod.ts'
const dev = Deno.env.get('ENV') === 'dev'

export function startUp(token: string) {
    const bot = new Bot(token)

    if (dev) {
        console.log('Starting bot in development mode (polling)')
        bot.start()
        console.warn(
            'Remember to set the webhook again after your local development with "deno task set-webhook" or rebuilding in production'
        )
    } else {
        console.log('Starting bot in production mode (webhook)')

        const handleUpdate = webhookCallback(bot, 'std/http')

        Deno.serve(async (req) => {
            try {
                const contentType = req.headers.get('content-type') || ''
                if (contentType.includes('application/json')) {
                    return await handleUpdate(req)
                }

                // For non-webhook requests, we return a simple message
                return new Response(
                    'Motbot is tracking your rankings! Enjoy the games ✅',
                    { status: 200 }
                )
            } catch (err) {
                console.error('Error handling request:', err)
                return new Response('Error handling request', { status: 500 })
            }
        })
    }

    return bot
}
