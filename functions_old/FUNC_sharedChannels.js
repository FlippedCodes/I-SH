const { EmbedBuilder } = require('discord.js');

const bridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const errHander = (err) => {
  console.error('ERROR:', err);
};

function createNewWebhook(config, channel) {
  channel.createWebhook(config.name).catch(errHander);
}

function createMessage(message) {
  // const embed = new EmbedBuilder().setDescription(message.channel.guild.name, message.channel.guild.iconURL);
  // return [message.content, embed];
  return `**_${message.channel.guild.name}_**\n${message.content}`;
}

module.exports.run = async (client, message, config) => {
  // get channelID
  const channelID = message.channel.id;
  // check if channelID is part of i-sh: get hubID
  // TODO: create channelcache for channels in list to reduce db calls
  const sourceChannel = await bridgedChannel.findOne({ attributes: ['hubID'], where: { channelID } }).catch(errHander);
  if (!sourceChannel) return;
  // only remove old entries if new message gets sended to avoid DB overload
  client.functions.get('FUNC_messageGarbageCollection').run(config);
  const hubID = sourceChannel.hubID;
  // get all channels in hubID
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'], where: { hubID } }).catch(errHander);
  // create messageLink instance ID
  await MessageLink.create({ messageInstanceID: message.id, messageID: message.id, channelID: message.channel.id });
  // prepare messages beforehand to avoid API load
  const body = createMessage(message);
  const username = message.author.username;
  const avatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 512 });
  // lookup if existing attachment
  const files = [];
  if (message.attachments.size > 0) message.attachments.forEach((file) => files.push(file.url));
  // post message in every channel besides original one
  allHubChannels.forEach(async (postChannel) => {
    const postChannelID = postChannel.channelID;
    if (postChannelID === channelID) return;
    const channel = client.channels.cache.find((channel) => channel.id === postChannelID);
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.name === config.name);
    if (!hook) hook = await channel.createWebhook(config.name).catch(errHander);
    const sentMessage = await hook.send(body, { username, avatarURL, files }).catch(errHander);
    // create DB entry for messageLink
    MessageLink.create({ messageInstanceID: message.id, messageID: sentMessage.id, channelID: postChannelID });
  });
};

module.exports.help = {
  name: 'FUNC_sharedChannels',
};
