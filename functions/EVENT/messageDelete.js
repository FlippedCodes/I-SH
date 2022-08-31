const { PermissionsBitField } = require('discord.js');

const BridgedChannel = require('../../database/models/bridgedChannel');

const MessageLink = require('../../database/models/messageLink');

async function checkChannel(channelID) {
  const result = await BridgedChannel.findOne({ attributes: ['channelID'], where: { channelID } }).catch(ERR);
  return result;
}

async function getMessageInstance(messageID) {
  const result = await MessageLink.findOne({ attributes: ['messageInstanceID'], where: { messageID } }).catch(ERR);
  return result;
}

async function getDBMessages(messageInstanceID) {
  const result = await MessageLink.findAll({ attributes: ['messageID', 'channelID'], where: { messageInstanceID } }).catch(ERR);
  return result;
}

function deleteDBMessage(messageInstanceID) {
  MessageLink.destroy({ where: { messageInstanceID } });
}

async function getMessages(messageID) {
  // check DB for messageID and get messageInstanceID
  const messageInstanceID = await getMessageInstance(messageID);
  if (!messageInstanceID) return null;
  // get all messageIDs
  const coreID = messageInstanceID.messageInstanceID;
  const allMessageIDs = await getDBMessages(coreID);
  deleteDBMessage(coreID);
  return allMessageIDs;
}

// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (message) => {
  // check if channel is part of service
  if (!await checkChannel(message.channel_id)) return;

  const allMessageIDs = await getMessages(message.id);
  if (!allMessageIDs) return;

  allMessageIDs.forEach(async (entry) => {
    if (message.id === entry.messageID) return;
    const channel = await client.channels.cache.find((channel) => channel.id === entry.channelID);
    const targetMessage = await channel.messages.fetch(entry.messageID);
    if (targetMessage.deleted) return;
    if (!channel.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ManageMessages)) return;
    targetMessage.delete();
  });
};

module.exports.help = {
  name: 'EVENT_messageDelete',
};
