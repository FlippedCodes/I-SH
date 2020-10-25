const testdiscordToken = './config/config.json';

module.exports.run = async (client, fs, config) => {
  // setting inDev var
  console.log(`[${module.exports.help.name}] Setting environment variables...`);
  if (fs.existsSync(testdiscordToken)) {
    const discordToken = require(`.${testdiscordToken}`).discordToken;
    config.env.set('inDev', true);
    config.env.set('discordToken', discordToken);
  } else {
    config.env.set('inDev', false);
    config.env.set('discordToken', process.env.BotdiscordTokenISH);
  }
  console.log(`[${module.exports.help.name}] Environment variables set!`);
};

module.exports.help = {
  name: 'STARTUP_envPrep',
};
