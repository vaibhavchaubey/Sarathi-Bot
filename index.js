// importing libraries
const {Telegraf} = require('telegraf')

const bot = new Telegraf('5886159351:AAFsDcEHIuxLtsKDy-NRpzsOvMHFs8SyFV4')


// start command
bot.use((ctx)=>{
    ctx.reply("Hii Human!!")
})

bot.launch()
