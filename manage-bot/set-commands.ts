import { Bot } from 'https://deno.land/x/grammy/mod.ts'

const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN')!)

const commands = [
  {
    command: '/puntatge',
    description: "Mostra la taula d'equivalències de punts",
  },
  {
    command: '/classificacio',
    description: 'Mostra la classificació actual',
  },
  {
    command: '/extres',
    description: 'Afegeix un jugador especial',
  },
  {
    command: '/premis',
    description: 'Obre les opcions de premis',
  },
  {
    command: '/top',
    description: 'Mostra el top 3 mundial',
  },
]

bot.api.setMyCommands(commands)
