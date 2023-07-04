require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// start command
bot.start((ctx) => {
  ctx.reply('Your Sarathi is ready to share the knowledge, go to /help for all the commands');
});

// response for custom words
bot.hears('hello', (ctx) => {
  ctx.reply('Hello Sir, go to /help for all the commands');
});

// help command
bot.help((ctx) => {
  const command1 = '/quote - for random motivational quotes\n';
  const command2 = '/fortune - for random fortune quotes\n';
  const command3 =
    '/shlok - for random gita shlokes in sanskrit , hindi and english\n';
  const command4 = '/contests - for recent upcoming contests under 7 days\n';
  const command5 = '/joke - for random programming jokes\n';
  const command6 = '/advice- for random life adivices\n';

  const s =
    'Here are the list of commands you can use\n' +
    command1 +
    command2 +
    command3 +
    command4 +
    command5 +
    command6;
  ctx.reply(s);
});

/* Bot Commands */

// quotes command
bot.command('quote', (ctx) => {
  const url = 'https://api.quotable.io/random';

  axios
    .get(url)
    .then((res) => {
      ctx.reply(res.data.content);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// fortune command
bot.command('fortune', (ctx) => {
  const url = 'http://yerkee.com/api/fortune';
  axios
    .get(url)
    .then((res) => {
      ctx.reply(res.data.fortune);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// shlok command
bot.command('shlok', (ctx) => {
  let url = 'https://bhagavadgitaapi.in/slok/';

  const  randomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let chapter = randomInteger(1, 18);
  let shlok = randomInteger(1, 20);

  url = url + chapter;
  url = url + '/';
  url = url + shlok + '/';

  axios
    .get(url)
    .then((res) => {
      let arr = [];

      let s = '';

      arr.push('chapter:' + res.data.chapter);
      arr.push('verse:' + res.data.verse);
      arr.push(res.data.slok);
      arr.push(res.data.tej.ht);
      arr.push(res.data.purohit.et);

      for (let i = 0; i < arr.length; i++) {
        s = s + arr[i] + '\n' + '\n';
      }

      ctx.reply(s);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// joke command
bot.command('joke', (ctx) => {
  let url = 'https://backend-omega-seven.vercel.app/api/getjoke';

  axios
    .get(url)
    .then((res) => {
      let s = res.data[0].question + '\n' + '\n' + res.data[0].punchline;
      ctx.reply(s);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// roast
bot.command('roast', (ctx) => {
  let url = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

  axios
    .get(url)
    .then((res) => {
      ctx.reply(res.data.insult);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// advice
bot.command('advice', (ctx) => {
  let url = 'https://api.adviceslip.com/advice';

  axios
    .get(url)
    .then((res) => {
      ctx.reply(res.data.slip.advice);
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

// code for contests
bot.command('contests', (ctx) => {
  let url = 'https://kontests.net/api/v1/all';

  axios
    .get(url)
    .then((res) => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      });

      // Filter contests that start within 7 days from the current date, and are from LeetCode, CodeForces, or CodeChef
      const filteredContests = res.data.filter((contest) => {
        const startDate = new Date(contest.start_time);
        const timeDiff = startDate.getTime() - new Date().getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        return (
          daysDiff <= 7 &&
          ['LeetCode', 'CodeForces', 'CodeChef'].includes(contest.site)
        );
      });

      // Format the filtered contests as a string with proper spacing and contest URLs
      let s = '';
      for (const contest of filteredContests) {
        const startDate = new Date(contest.start_time).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        });
        s += `[${contest.site}](${contest.url})\nStarts on: ${startDate}\n\n`;
      }

      // Send the formatted contests string as a reply
      ctx.replyWithMarkdown(
        `*Contests within the next 7 days from LeetCode, CodeForces, and CodeChef (IST):*\nCurrent IST: ${now}\n\n${s}`
      );
    })
    .catch((error) => {
      ctx.reply('Sorry, this feature is not currently available.');
    });
});

bot.launch();
