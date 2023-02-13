const { PermissionsBitField } = require('discord.js');

const BridgedChannel = require('../../database/models/bridgedChannel');

const MessageLink = require('../../database/models/messageLink');

async function getMessages(messageID) {
  // check DB for messageID and get messageInstanceID
  const messageInstanceID = await MessageLink.findOne({ attributes: ['messageInstanceID'], where: { messageID } }).catch(ERR);
  if (!messageInstanceID) return null;
  // get all messageIDs
  const coreID = messageInstanceID.messageInstanceID;
  const allMessageIDs = await MessageLink.findAll({ attributes: ['messageID', 'channelID'], where: { messageInstanceID: coreID } }).catch(ERR);
  MessageLink.destroy({ where: { messageInstanceID: coreID } });
  return allMessageIDs;
}

// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (message) => {
  // check if channel is part of service
  if (!await BridgedChannel.findOne({ attributes: ['channelID'], where: { channelID: message.channelId } }).catch(ERR)) return;

  const allMessageIDs = await getMessages(message.id);
  if (!allMessageIDs) return;

  allMessageIDs.forEach(async (entry) => {
    if (message.id === entry.messageID) return;
    const channel = await client.channels.cache.get(entry.channelID);
    if (!channel.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ManageMessages)) return;
    targetMessage.delete();
  });
};

module.exports.help = {
  name: 'EVENT_messageDelete',
};
