const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const bridgedChannel = require('../../../database/models/bridgedChannel');

const MessageLink = require('../../../database/models/messageLink');

const BlockedUser = require('../../../database/models/blockedUser');

const button = (servername) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('servername')
      .setLabel(servername.length >= 80 ? `${servername.slice(0, 76)}...` : servername)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary),
  ]);

const buttonWithInvite = (servername, invite) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setURL(invite.url)
      .setLabel(servername.length >= 80 ? `${servername.slice(0, 76)}...` : servername)
      .setStyle(ButtonStyle.Link),
  ]);

module.exports.run = async (message) => {
  // get channelID
  const channelID = message.channel.id;
  // check if channelID is part of i-sh: get hubID
  // TODO: create channelcache for channels in list to reduce db calls. maybe with a redis DB
  const sourceChannel = await bridgedChannel.findOne({ attributes: ['hubID', 'allowInvites'], where: { channelID } }).catch(ERR);
  if (!sourceChannel) return;
  // only remove old entries if new message gets sended to avoid DB overload
  client.functions.get('ENGINE_serverlink_messageGarbageCollection').run(config);
  const hubID = sourceChannel.hubID;
  // get all channels in hubID
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID', 'allowInvites'], where: { hubID } }).catch(ERR);
  // create messageLink instance ID
  await MessageLink.create({ messageInstanceID: message.id, messageID: message.id, channelID: message.channel.id });
  // invite logic for source channel
  const predoneButtons = button(message.channel.guild.name);
  const predoneButtonsWInv = sourceChannel.allowInvites
    // 1 week inv
    ? buttonWithInvite(message.channel.guild.name, await message.channel.createInvite({ maxAge: 604800, unique: false }))
    : predoneButtons;
  const username = message.author.username;
  const avatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 512 });
  // lookup if existing attachment
  const files = [];
  if (message.attachments.size > 0) message.attachments.forEach((file) => files.push(file.url));
  // check userid combination with hubid to make less noise on the DB
  const testBlocked = await BlockedUser.findOne({ attributes: ['userID'], where: { hubID, userID: message.author.id } }).catch(ERR);
  allHubChannels
  // filter channel list if user is in blocklist
  // .filter(async (postChannel) => {
  //   const postChannelID = postChannel.channelID;
  //   // check if it is the same channel
  //   if (postChannelID === channelID) return;

  //   const blockedUserInfo = await BlockedUser.findOne({ attributes: ['userID'], where: { channelID: postChannelID, userID: message.author.id } }).catch(ERR);
  //   console.log(blockedUserInfo);
  //   return !blockedUserInfo;
  // })
  // post message in every channel besides original one
    .forEach(async (postChannel) => {
      const postChannelID = postChannel.channelID;
      // check if it is the same channel
      if (postChannelID === channelID) return;

      const channel = client.channels.cache.find((channel) => channel.id === postChannelID);

      if (testBlocked) {
        // filter channel list if user is in blocklist
        // TODO: Better implemetnation by just getting all info once and use collections to find if user is blocked
        // blockID needs to be selected, as its needed to update 'acknowledged'
        const blockedInfo = await BlockedUser.findOne({ attributes: ['blockID', 'reason', 'acknowledged'], where: { channelID: postChannelID, userID: message.author.id } }).catch(ERR);
        if (blockedInfo) {
          if (blockedInfo.acknowledged) return;
          const desc = `You have been blocked from \`${channel.guild.name}\` for the following reason:\n**${blockedInfo.reason}**\n\nThis warning will not be displayed again.`;
          await messageFail(message, desc);
          return blockedInfo.update({ acknowledged: true });
        }
      }

      if (!channel) return console.warn('Channel', postChannelID, 'not found');
      const channelWebhooks = await channel.fetchWebhooks();
      let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
      if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
      const sentMessage = await hook.send({
        content: message.content,
        // invite logic for remote channel
        components: [postChannel.allowInvites ? predoneButtonsWInv : predoneButtons],
        username,
        avatarURL,
        files,
      }).catch(ERR);
      // create DB entry for messageLink
      MessageLink.create({ messageInstanceID: message.id, messageID: sentMessage.id, channelID: postChannelID });
    });
};

module.exports.help = {
  name: 'sharedChannels',
};
