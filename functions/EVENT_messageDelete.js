// Deletes all messages in every channel, if its deleted in one
module.exports.run = async (client, message, config) => {
  // TODO: make messageDelete event

  // get message and channel ID

  // check if channel is part of service

  // check DB for messageID

  // get messageInstanceID

  // get all messageIDs

  // [REQUIERES MESSAGE MANAGING PERMISSIONS]
  // for each loop [
  //  check if message excists: delete
  //  delete DB entry
  // ]
};

module.exports.help = {
  name: 'EVENT_messageDelete',
};
