const BridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const errHander = (err) => { console.error('ERROR:', err); };

// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (guild) => {
  console.log(guild);
  guild.channels.cache.forEach(async (channel) => {
    if (!channel.type !== 'text') return;
    const channelID = channel.id;
    const checkedChannel = await BridgedChannel.findOne({ attributes: ['channelID'], where: { channelID } }).catch(errHander);
    if (!checkedChannel) return;
    BridgedChannel.destroy({ where: { channelID } }).catch(errHander);
    MessageLink.destroy({ where: { channelID } }).catch(errHander);
  });
};

module.exports.help = {
  name: 'EVENT_guildDelete',
};
