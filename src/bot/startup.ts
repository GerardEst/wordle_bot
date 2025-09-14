import { Bot, webhookCallback } from 'https://deno.land/x/grammy/mod.ts'
import { supalog } from '../api/log.ts'

const dev = Deno.env.get('ENV') === 'dev'

function cors(response: Response, origin = 'https://mooot.cat'): Response {
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Max-Age', '86400')

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    })
}

async function handlePrepareShare(req: Request, bot: Bot) {
    console.log('handling preparation of share')
    try {
        const body = await req.json()

        console.log('got the body', body)

        // Validate required parameters
        if (!body.message || !body.user_id) {
            console.log('Missing parameters')
            return cors(
                new Response(
                    JSON.stringify({
                        error: 'Missing required parameters: message and user_id',
                    }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
            )
        }

        console.log("try to prepare message")
        // Call Telegram's savePreparedInlineMessage method
        const result = await bot.api.savePreparedInlineMessage(
            body.user_id,
            {
                type: 'article',
                id: Date.now().toString(),
                title: `Mooot`,
                input_message_content: {
                    message_text: body.message,
                    parse_mode: 'HTML',
                },
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Jugar',
                                url: 'https://t.me/mooot_cat_bot/mooot',
                            },
                        ],
                    ],
                },
            },
            {
                allow_user_chats: true,
                allow_bot_chats: true,
                allow_group_chats: true,
                allow_channel_chats: false,
            }
        )

        console.log("got the message", result)

        return cors(
            new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        )
    } catch (error) {
        console.error('Error in handlePrepareShare:', error)
        supalog.error('Error in handlePrepareShare:', error)
        return cors(
            new Response(
                JSON.stringify({ error: 'Failed to prepare inline message' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
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
                if (url.pathname === '/prepare-share') {
                    console.log("somebody wants to share", req.method)
                    if (req.method === 'OPTIONS') {
                        // Handle preflight request
                        return cors(new Response(null, { status: 204 }))
                    }
                    if (req.method === 'POST') {
                        console.log('its a post')
                        return await handlePrepareShare(req, bot)
                    }
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
