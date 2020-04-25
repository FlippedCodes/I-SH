const bridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const errHander = (err) => {
  console.error('ERROR:', err);
};

function createNewWebhook(config, channel) {
  channel.createWebhook(config.name).catch(errHander);
}

module.exports.run = async (client, message, config) => {
  // get channelID
  const channelID = message.channel.id;
  // check if channelID is part of i-sh: get hubID
  const sourceChannel = await bridgedChannel.findOne({ attributes: ['hubID'], where: { channelID } }).catch(errHander);
  if (!sourceChannel) return;
  const hubID = sourceChannel.hubID;
  // get all channels in hubID
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'], where: { hubID } }).catch(errHander);
  // create messageLink instance ID
  const OrgMessageLink = await MessageLink.create({ messageInstanceID: message.id, messageID: message.id });
  // post message in every channel besides original one
  allHubChannels.forEach(async (postChannel) => {
    const postChannelID = postChannel.channelID;
    if (postChannelID === channelID) return;
    const channel = client.channels.find((channel) => channel.id === postChannelID);
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.name === config.name);
    if (!hook) hook = await channel.createWebhook(config.name).catch(errHander);
    const sendMessage = await hook.send(`**_${message.channel.guild.name}_**\n${message.cleanContent}`, {
      username: message.author.username,
      avatarURL: message.author.avatarURL,
    }).catch(errHander);
    // create DB entry
    MessageLink.create({ messageInstanceID: message.id, messageID: sendMessage.id });
  });
  // log messages in DB

  // check message DB if there are expiered messages
};

module.exports.help = {
  name: 'FUNC_sharedChannels',
};
