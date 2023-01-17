const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const bridgedChannel = require('../../../database/models/bridgedChannel');

const MessageLink = require('../../../database/models/messageLink');

const buttons = (servername) => new ActionRowBuilder()
  // TODO: implement secound function, dont bother implementing into existing one
  .addComponents([
    new ButtonBuilder()
      .setCustomId('servername')
      .setLabel(servername.length >= 80 ? `${servername.slice(0, 76)}...` : servername)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary),
  ]);

module.exports.run = async (message) => {
  // TODO: attach invite, if setting is on
  // get channelID
  const channelID = message.channel.id;
  // check if channelID is part of i-sh: get hubID
  // TODO: create channelcache for channels in list to reduce db calls
  const sourceChannel = await bridgedChannel.findOne({ attributes: ['hubID'], where: { channelID } }).catch(ERR);
  if (!sourceChannel) return;
  // only remove old entries if new message gets sended to avoid DB overload
  client.functions.get('ENGINE_serverlink_messageGarbageCollection').run(config);
  const hubID = sourceChannel.hubID;
  // get all channels in hubID
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'], where: { hubID } }).catch(ERR);
  // create messageLink instance ID
  await MessageLink.create({ messageInstanceID: message.id, messageID: message.id, channelID: message.channel.id });
  const predoneButtons = buttons(message.channel.guild.name);
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
    if (!channel) return console.warn('Channel', postChannelID, 'not found');
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
    if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
    const sentMessage = await hook.send({
      content: message.content, components: [predoneButtons], username, avatarURL, files,
    }).catch(ERR);
    // create DB entry for messageLink
    MessageLink.create({ messageInstanceID: message.id, messageID: sentMessage.id, channelID: postChannelID });
  });
};

module.exports.help = {
  name: 'sharedChannels',
};
