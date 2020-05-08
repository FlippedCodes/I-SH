module.exports.run = async (client, message, args, config) => {
  // TODO: check ownerID
  // TODO: check how many channels bot is in and warn before removing that all channels get disconnected. transfer ownership instead.
  message.reply('del');
};

module.exports.help = {
  name: 'CMD_hub_delete',
};
