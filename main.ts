import 'jsr:@std/dotenv/load'

import { Bot, webhookCallback } from 'https://deno.land/x/grammy/mod.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'

const dev = Deno.env.get('ENV') === 'dev'
const app = new Application()

// Airtable
const url = `https://api.airtable.com/v0/${Deno.env.get(
  'AIRTABLE_DB_ID'
)}/Puntuacions`

// Telegram
const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN'))
app.use(webhookCallback(bot, 'oak'))

// Deno.serve(async (req) => {
//   // Grammy gestiona la resposta internament
//   try {
//     return await bot.handleUpdate(req)
//   } catch (err) {
//     console.error('Error al processar update:', err)
//     return new Response('Error', { status: 500 })
//   }
// })

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
  const isFromElmot = context.text.includes('#ElMot')

  if (isFromElmot) {
    const points = getPoints(context.text)

    // Guardar els punts del jugador
    await createRecord({
      'ID Xat': context.chat.id,
      'ID Usuari': context.from.id,
      'Nom Usuari': context.from.firstName,
      Puntuació: points,
      Data: new Date().toISOString(),
    })
  }
})

//bot.start()

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
