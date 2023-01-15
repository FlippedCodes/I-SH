const { ChannelType } = require('discord.js');

module.exports.run = async (message) => {
  // return if bot and dm
  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) return messageFail(interaction, 'Hello! Sorry, but this is for servers only.');

  client.functions.get('ENGINE_serverlink_sharedChannels').run(message);
};

module.exports.data = {
  name: 'messageCreate',
};
