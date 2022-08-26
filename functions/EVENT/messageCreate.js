const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

// const discardDeprecationWarning = require('../../database/models/discardDeprecationWarning');

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
  // debug protection
  if (DEBUG) return;
  // return if not prefix
  if (message.author.bot) return;
  if (!message.content.startsWith('a!')) return;

  const userID = message.author.id;

  if (await checkUser(userID)) return;

  const defaultBody = 'Hi there! I have been upgraded to Slash-Commands (v.2.0.0) and no longer support the old prefix of `+`. Please use the new `/` instead!';

  const confirmMessage = await message.reply({ embeds: [embed(defaultBody)], components: [buttons], fetchReply: true });
  // For some reason that isnta-deletes the message?
  // await sentMessage.delete({ timeout: 20000 });
  // start button collector
  const filter = (i) => userID === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 20000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'discard') {
      await addUser(userID);
      confirmMessage.edit({ embeds: [embed('Message discarded and won\'t be shown again for you.')], components: [] });
      return;
    }
    return confirmMessage.edit({ embeds: [embed('Unknown response')], components: [] });
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) confirmMessage.edit({ embeds: [embed(defaultBody)], components: [] });
  });
};

module.exports.data = {
  name: 'messageCreate',
};
