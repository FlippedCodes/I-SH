const TG = require('telegram-bot-api');

module.exports.run = async (client, config) => {
  const telegramClient = new TG({
    token: config.env.get('telegramToken'),
  });

  telegramClient.getMe()
    .then(console.log)
    .catch(console.err);
};

module.exports.help = {
  name: 'SETUP_telegramBot',
};
