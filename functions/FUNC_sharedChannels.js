const bridgedChannel = require('../database/models/bridgedChannel');

module.exports.run = async (client, message, config) => {
  // get channel entry with hub name

  // get all channels in hub

  // post message in every channel besides original one

  // log messages in DB

  // check message DB if there are expiered messages
};

module.exports.help = {
  name: 'FUNC_sharedChannels',
};
