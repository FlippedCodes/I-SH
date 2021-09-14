// DISABLED: not done
module.exports.run = async (client, message, args, config) => {
  // check if in DM
  if (message.channel.type !== 'dm') return messageFail(message, 'This command can only be used in DM!');
  message.reply('rnme');
  // renames the hub
};

module.exports.help = {
  name: 'CMD_hub_rename',
};
