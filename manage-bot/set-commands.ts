import { Bot } from 'https://deno.land/x/grammy/mod.ts'

const bot = new Bot(Deno.env.get('TELEGRAM_TOKEN')!)

const commands = [
  {
    command: '/llegenda',
    description: "Mostra la taula d'equivalències de punts",
  },
  {
    command: '/classificacio',
    description: 'Mostra la classificació actual',
  },
  {
    command: '/premis',
    description: 'Obre les opcions de premis',
  },
  {
    command: '/top',
    description: 'Mostra el top 3 mundial',
  },
  {
    command: '/afegirpersonatge',
    description: 'Afegeix un personatge a la lliga',
  },
  {
    command: '/eliminarpersonatge',
    description: 'Elimina un personatge de la lliga',
  },
]

bot.api.setMyCommands(commands)
