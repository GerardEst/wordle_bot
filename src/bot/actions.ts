import { Bot, Context } from 'https://deno.land/x/grammy/mod.ts'
import { getChatPunctuations, createRecord } from '../api/db.ts'

export function setupActions(bot: Bot) {
  bot.command('punts', async (context: Context) => {
    if (!context.chat) {
      return
    }

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

  bot.on('message', async (context: Context) => {
    console.log(context)
    if (!context.message || !context.message.text) {
      return
    }

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
}

function getPoints(message: string) {
  const tries = message.split(' ')[2].split('/')[0]
  if (tries === 'X') {
    return 0
  }

  const points = 6 - parseInt(tries)

  return points + 1
}
