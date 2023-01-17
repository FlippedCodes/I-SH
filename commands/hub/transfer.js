const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('accept')
      .setEmoji('✅')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('deny')
      .setEmoji('❌')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Primary),
  ]);

module.exports.run = async (interaction, HubName) => {
  const hubnameStr = interaction.options.getString('hubname');
  const user = interaction.options.getUser('user', true);

  if (user.id === interaction.user.id) return messageFail(interaction, 'Nice try.');

  if (user.bot) return messageFail(interaction, 'You can\'t transfer a hub to a bot.');

  // check if user is exceeding maximum of allowed hubs
  const result = await HubName.findAndCountAll({ where: { ownerID: user.id } }).catch(ERR);
  if (result.count >= config.commands.hub.maxAllowedHubs) return messageFail(interaction, 'The target user already has 3 hubs. You can\'t add more.');

  const message = await new EmbedBuilder()
    .setDescription('⚠️ You are about to move the hub to the mentioned user. You will no longer be able to maintain the hub. Are you sure?')
    .setColor('Orange');
  const confirmMessage = await reply(interaction, {
    embeds: [message], components: [buttons], fetchReply: true, ephemeral: true,
  });
  // start button collector
  const buttonCollector = confirmMessage.createMessageComponentCollector({ time: 10000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    used.deferUpdate();
    if (used.customId === 'accept') {
      // update db entry
      const updated = await HubName.update({ ownerID: user.id }, { where: { hubName: hubnameStr, ownerID: interaction.user.id } }).catch(ERR);
      if (!updated) message.setDescription(`It seems that you don't own ${hubnameStr} or it doesn't exist.`);
      else {
        message
          .setDescription(`Successfully tranfered ${hubnameStr} to ${user}.`)
          .setColor('Green');
      }
      return reply(interaction, { embeds: [message], ephemeral: true }, true);
    }
    message
      .setDescription('You decided to keep the hub.')
      .setColor('Green');
    return reply(interaction, { embeds: [message], ephemeral: true }, true);
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size !== 0) return;
    message.setDescription('Your response took too long. Please run the command again.');
    reply(interaction, { embeds: [message], ephemeral: true }, true);
  });
};

module.exports.data = { subcommand: true };
