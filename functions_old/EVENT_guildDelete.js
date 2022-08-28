const BridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const ERR = (err) => { console.error('ERROR:', err); };

// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (guild) => {
  guild.channels.forEach(async (channel) => {
    if (!channel.type !== 'text') return;
    const channelID = channel.id;
    const checkedChannel = await BridgedChannel.findOne({ attributes: ['channelID'], where: { channelID } }).catch(ERR);
    if (!checkedChannel) return;
    BridgedChannel.destroy({ where: { channelID } }).catch(ERR);
    MessageLink.destroy({ where: { channelID } }).catch(ERR);
  });
};

module.exports.help = {
  name: 'EVENT_guildDelete',
};
