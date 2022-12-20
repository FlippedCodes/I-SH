const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType,
} = require('discord.js');

const discardDeprecationWarning = require('../../database/models/discardDeprecationWarning');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('discard')
      .setEmoji('✅')
      .setLabel('Don\'t show this again')
      .setStyle(ButtonStyle.Primary),
  ]);

const embed = (body) => new EmbedBuilder()
  .setDescription(body)
  .setColor('Red');

async function addUser(userID) {
  const added = await discardDeprecationWarning.findOrCreate({ where: { userID } }).catch(ERR);
  const created = await added[1];
  return created;
}

async function checkUser(userID) {
  const user = await discardDeprecationWarning.findOne({ where: { userID } });
  return user;
}

module.exports.run = async (message) => {
  // return if bot and dm
  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) return messageFail(interaction, 'Hello! Sorry, but this is for servers only.');

  client.functions.get('ENGINE_serverlink_sharedChannels').run(message);
};

module.exports.data = {
  name: 'messageCreate',
};
