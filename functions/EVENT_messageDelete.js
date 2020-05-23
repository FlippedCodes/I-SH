const BridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const errHander = (err) => { console.error('ERROR:', err); };

async function checkChannel(channelID) {
  const result = await BridgedChannel.findOne({ attributes: ['channelID'], where: { channelID } }).catch(errHander);
  return result;
}

async function getMessageInstance(messageID) {
  const result = await MessageLink.findOne({ attributes: ['messageInstanceID'], where: { messageID } }).catch(errHander);
  return result;
}

async function getDBMessages(messageInstanceID) {
  const result = await MessageLink.findAll({ attributes: ['messageID', 'channelID'], where: { messageInstanceID } }).catch(errHander);
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

async function checkDeletePermissions(message) {
  const permissions = await message.client.functions.get('FUNC_checkBotPermissions').run(message, 'MANAGE_MESSAGES');
  return permissions;
}

// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (client, message, config) => {
  // check if channel is part of service
  if (!await checkChannel(message.channel_id)) return;

  const allMessageIDs = await getMessages(message.id);
  if (!allMessageIDs) return;

  allMessageIDs.forEach(async (entry) => {
    if (message.id === entry.messageID) return;
    const channel = await client.channels.find((channel) => channel.id === entry.channelID);
    const targetMessage = await channel.fetchMessage(entry.messageID);
    if (!targetMessage.deleted && await checkDeletePermissions(targetMessage)) targetMessage.delete();
    else targetMessage.react('❌');
  });
};

module.exports.help = {
  name: 'EVENT_messageDelete',
};
