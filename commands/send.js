const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const bridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const buttons = (servername) => new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('servername')
      .setLabel(servername)
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary),
  ]);

module.exports.run = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const content = interaction.options.getString('message', true).replaceAll('\\n', `
  `);

  // get channelID
  const channelID = interaction.channel.id;
  // check if channelID is part of i-sh: get hubID
  // TODO: create channelcache for channels in list to reduce db calls
  const sourceChannel = await bridgedChannel.findOne({ attributes: ['hubID'], where: { channelID } }).catch(ERR);
  if (!sourceChannel) return messageFail(interaction, 'This channel is not linked with any other channel');
  // only remove old entries if new message gets sended to avoid DB overload
  client.functions.get('ENGINE_serverlink_messageGarbageCollection').run(config);
  const hubID = sourceChannel.hubID;
  // get all channels in hubID
  const allHubChannels = await bridgedChannel.findAll({ attributes: ['channelID'], where: { hubID } }).catch(ERR);
  // create messageLink instance ID
  // await MessageLink.create({ messageInstanceID: interaction.id, messageID: message.id, channelID: message.channel.id });
  const predoneButtons = buttons(interaction.channel.guild.name);
  const username = interaction.user.username;
  const avatarURL = interaction.user.avatarURL({ format: 'png', dynamic: true, size: 512 });
  // lookup if existing attachment
  // const files = [];
  // if (message.attachments.size > 0) message.attachments.forEach((file) => files.push(file.url));
  // post message in every channel besides original one
  allHubChannels.forEach(async (postChannel) => {
    const postChannelID = postChannel.channelID;
    const channel = client.channels.cache.find((channel) => channel.id === postChannelID);
    const channelWebhooks = await channel.fetchWebhooks();
    let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
    if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
    const sentMessage = await hook.send({
      content, components: [predoneButtons], username, avatarURL,
    }).catch(ERR);
    // create DB entry for messageLink
    MessageLink.create({ messageInstanceID: interaction.id, messageID: sentMessage.id, channelID: postChannelID });
  });
  messageSuccess(interaction, 'Sending your message to all channels...');
};

module.exports.data = new CmdBuilder()
  .setName('send')
  .setDescription('Send a message in this linked channel.')
  .addStringOption((option) => option.setName('message').setDescription('Message that should be sent').setRequired(true));
