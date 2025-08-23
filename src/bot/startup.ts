import { Bot, webhookCallback } from 'https://deno.land/x/grammy/mod.ts'
const dev = Deno.env.get('ENV') === 'dev'

async function handlePrepareShare(req: Request, bot: Bot) {
    try {
        const body = await req.json()
        
        // Validate required parameters
        if (!body.result || !body.user_id) {
            return new Response(
                JSON.stringify({ error: 'Missing required parameters: result and user_id' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Call Telegram's savePreparedInlineMessage method
        const result = await bot.api.savePreparedInlineMessage(
            body.user_id,
            body.result,
            {
                allow_user_chats: body.allow_user_chats,
                allow_bot_chats: body.allow_bot_chats,
                allow_group_chats: body.allow_group_chats,
                allow_channel_chats: body.allow_channel_chats
            }
        )

        return new Response(
            JSON.stringify(result),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Error in handlePrepareShare:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to prepare inline message' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

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
                const url = new URL(req.url)
                
                // Handle /prepare-share endpoint
                if (url.pathname === '/prepare-share' && req.method === 'POST') {
                    return await handlePrepareShare(req, bot)
                }
                
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
