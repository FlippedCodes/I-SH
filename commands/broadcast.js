const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const bridgedChannel = require('../database/models/bridgedChannel');

const button = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('servername')
      .setLabel('OFFICIAL BROADCAST')
      .setDisabled(true)
      .setStyle(ButtonStyle.Primary),
  ]);

module.exports.run = async (interaction) => {
  if (interaction.user.id !== '172031697355800577') return messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``, null, false);
  await interaction.deferReply({ ephemeral: true });

  const body = interaction.options.getString('message', true).replaceAll('\\n', `
  `);
  const username = interaction.user.username;
  const avatarURL = interaction.user.avatarURL({ format: 'png', dynamic: true, size: 512 });
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'] }).catch(ERR);
  allHubChannels.forEach(async (postChannel) => {
    const channel = client.channels.cache.find((channel) => channel.id === postChannel.channelID);
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
    if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
    await hook.send({
      content: body, components: [button], username, avatarURL,
    }).catch(ERR);
  });
  messageSuccess(interaction, 'Sending your message to all channels.');
};

module.exports.data = new CmdBuilder()
  .setName('broadcast')
  .setDescription('Broadcasts a message to all channels. [OWNER ONLY].')
  .addStringOption((option) => option.setName('message').setDescription('Message that should be broadcasted').setRequired(true));
