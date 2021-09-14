const testToken = './config/config.json';

module.exports.run = async (client, fs, config) => {
  // setting inDev var
  console.log(`[${module.exports.help.name}] Setting environment variables...`);
  if (fs.existsSync(testToken)) {
    const discordToken = require(`.${testToken}`).discordToken;
    const telegramToken = require(`.${testToken}`).telegramToken;
    config.env.set('inDev', true);
    config.env.set('discordToken', discordToken);
    config.env.set('telegramToken', telegramToken);
  } else {
    config.env.set('inDev', false);
    config.env.set('discordToken', process.env.BotToken);
    config.env.set('telegramToken', process.env.BottelegramTokenISH);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
