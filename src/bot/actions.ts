import { Bot, Context } from 'https://deno.land/x/grammy/mod.ts'
import { getChatPunctuations, createRecord } from '../api/db.ts'

export function setupActions(bot: Bot) {
  bot.command('punts', async (context: Context) => {
    if (!context.chat) return

    const records = await getChatPunctuations(context.chat.id, 'month')

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
    let resposta = '🏆 *Classificació del mes* 🏆\n\n'

    // Calcular els dies que falten per acabar el mes actual
    const avui = new Date()
    const ultimDiaMes = new Date(
      avui.getFullYear(),
      avui.getMonth() + 1,
      0
    ).getDate()
    const diesRestants = ultimDiaMes - avui.getDate()

    resposta += `Falten *${diesRestants} dies* pel final de la lliga!\n\n`
    resposta += '```\n'
    resposta += 'Pos  Nom            Punts\n'
    resposta += '—————————————————————————\n'

    rànquing.forEach((usuari, index) => {
      // Determinar posició
      let posicio = `${index + 1}`.padEnd(4)
      if (index === 0) posicio = '1 🥇'
      else if (index === 1) posicio = '2 🥈'
      else if (index === 2) posicio = '3 🥉'
      else posicio = `${index + 1}. `

      // Formatar el nom amb padding
      const nomPadded = `${usuari.nom}`.padEnd(15)

      resposta += `${posicio} ${nomPadded} ${usuari.total}\n`
    })

    resposta += '```' // End monospace block

    context.reply(resposta, { parse_mode: 'Markdown' })
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
        Joc: 'elmot',
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
