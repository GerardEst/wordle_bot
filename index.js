const { Telegram } = require('puregram')


const bot = new Telegram({
  token: process.env.TOKEN
})

bot.updates.startPolling()
bot.updates.on('message', context => {
    console.log(context)
    
    context.reply('yoo!')
})