const bridgedChannel = require('../database/models/bridgedChannel');

const errHander = (err) => {
  console.error('ERROR:', err);
};

module.exports.run = async (client, message, args, config) => {
  if (message.author.id !== '172031697355800577') return message.react('❌');
  const body = `**[BROADCAST MESSAGE]**\n${args.join(' ')}`;
  const username = message.author.username;
  const avatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 512 });
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'] }).catch(errHander);
  allHubChannels.forEach(async (postChannel) => {
    const channel = client.channels.cache.find((channel) => channel.id === postChannel.channelID);
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.name === config.name);
    if (!hook) hook = await channel.createWebhook(config.name).catch(errHander);
    await hook.send(body, { username, avatarURL }).catch(errHander);
  });
};

module.exports.help = {
  name: 'adminbroadcast',
  usage: 'MESSAGE',
  desc: 'Notify every channel. [ADMINISTRATOR ONLY]',
};
