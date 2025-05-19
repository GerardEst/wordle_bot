import 'jsr:@std/dotenv/load'

import { Bot, webhookCallback } from 'https://deno.land/x/grammy/mod.ts'

const dev = Deno.env.get('ENV') === 'dev'

// Airtable
const url = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/Puntuacions`

// Telegram
const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN')!)

// Set up bot commands and handlers
bot.command('punts', async (context) => {
  const records = await getChatPunctuations(context.chat.id, 'all')

  if (!records || records.length === 0) {
    return context.reply('Encara no hi ha puntuacions en aquest xat.')
  }

  // Agrupar i sumar punts per usuari
  const puntuacionsPerUsuari: Record<string, { nom: string; total: number }> =
    {}

  for (const record of records) {
    const usuariId = record.fields['ID Usuari']
    const nomUsuari = record.fields['Nom Usuari']
    const punts = record.fields['Puntuació']

    if (!puntuacionsPerUsuari[usuariId]) {
      puntuacionsPerUsuari[usuariId] = {
        nom: nomUsuari,
        total: 0,
      }
    }

    puntuacionsPerUsuari[usuariId].total += punts
  }

  // Ordenar de més a menys
  const rànquing = Object.values(puntuacionsPerUsuari).sort(
    (a, b) => b.total - a.total
  )

  // Generar text amb emojis
  const medalles = ['🥇', '🥈', '🥉']
  const resposta = rànquing
    .map((u, i) => {
      const posició = i + 1
      const prefix = medalles[i] || `${posició}.`
      return `${prefix} ${u.nom} - ${u.total} punts`
    })
    .join('\n')

  context.reply(resposta)
})

bot.on('message', async (context) => {
  console.log(context)
  const isFromElmot = context.message.text.includes('#ElMot')

  if (isFromElmot) {
    const points = getPoints(context.message.text)

    // Guardar els punts del jugador
    await createRecord({
      'ID Xat': context.message.chat.id,
      'ID Usuari': context.message.from.id,
      'Nom Usuari': context.message.from.first_name,
      Puntuació: points,
      Data: new Date().toISOString(),
    })
  }
})

if (dev) {
  bot.start()
} else {
  // Set up webhook handling with Deno.serve
  const handleUpdate = webhookCallback(bot, 'std/http')

  Deno.serve(async (req) => {
    console.log(req)
    try {
      console.log('try to handle update')
      // Check if the request is a valid webhook update from Telegram
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        // Clone the request before trying to read the body
        const clonedReq = req.clone()

        try {
          // Try to parse body as JSON to validate it's a proper update
          const body = await clonedReq.json()
          if (
            body &&
            (body.update_id !== undefined || body.message !== undefined)
          ) {
            return await handleUpdate(req)
          }
        } catch (jsonError) {
          console.error('Invalid JSON in request:', jsonError)
          return new Response('Invalid JSON', { status: 400 })
        }
      }

      // If we reach here, it's not a valid Telegram update
      // Return a simple response for health checks or invalid requests
      return new Response('Bot server running!', { status: 200 })
    } catch (err) {
      console.error('Error handling request:', err)
      return new Response('Error handling request', { status: 500 })
    }
  })
}

export function getPoints(message: string) {
  const tries = message.split(' ')[2].split('/')[0]
  if (tries === 'X') {
    return 0
  }

  const points = 6 - parseInt(tries)

  return points + 1
}

function buildFormula(chatId: number, period: 'all' | 'week' | 'day') {
  let formula = `{ID Xat} = ${chatId}`

  if (period === 'day') {
    formula = `AND({ID Xat} = ${chatId}, IS_SAME({Data}, TODAY(), 'day'))`
  } else if (period === 'week') {
    formula = `AND({ID Xat} = ${chatId}, IS_SAME({Data}, TODAY(), 'week'))`
  }

  return formula
}

async function getChatPunctuations(
  chatId: number,
  period: 'all' | 'week' | 'day'
) {
  const params = new URLSearchParams({
    filterByFormula: buildFormula(chatId, period),
    view: 'Llista',
  })

  console.log(params.toString())

  const res = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  console.log(data)

  return data.records
}

async function createRecord(fields: Record<string, any>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('AIRTABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields,
        },
      ],
    }),
  })

  if (!res.ok) {
    console.error('Error creant el registre:', await res.text())
    return
  }

  const data = await res.json()
}
