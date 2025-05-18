import 'jsr:@std/dotenv/load'

import { Telegram } from 'npm:puregram'

const bot = new Telegram({
  token: process.env.TOKEN,
})
bot.updates.startPolling()
bot.updates.on('message', (context) => {
  console.log(context)

  const isFromElmot = context.text.includes('#ElMot')

  if (isFromElmot) {
    const points = getPoints(context.text)
    console.log(points)
  }
})

export function getPoints(message: string) {
  const tries = parseInt(message.split(' ')[2].split('/')[0])

  // Max points are 5 (6-1 solving on first try), min points are 0 (6-6)
  const points = 6 - tries

  return points
}
