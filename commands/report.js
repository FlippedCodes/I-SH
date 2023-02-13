const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, time,
} = require('discord.js');

const bridgedChannel = require('../database/models/bridgedChannel');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('accept')
      .setEmoji('✅')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('deny')
      .setEmoji('❌')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setLabel('ToS')
      .setURL('https://github.com/FlippedCodes/I-SH/wiki/ToS-and-Privacy-Policy')
      .setStyle(ButtonStyle.Link),
  ]);

// // check for hubName and get hubID
// async function getHubID(channelID) {
//   const result = await HubName.findOne({ attributes: ['hubID'], where: { channelID } }).catch(ERR);
//   if (result) return result.hubID;
//   return null;
// }

module.exports.run = async (interaction) => {
  if (interaction.channel.type === ChannelType.DM) return messageFail(interaction, 'You can\' use this command in DM!');
  await interaction.deferReply({ ephemeral: true });

  // get hubID
  const hubID = await bridgedChannel.findOne({ attributes: ['hubID'], where: { channelID: interaction.channel.id } }).catch(ERR);
  // const hubID = await getHubID(interaction.channel.id);
  if (!hubID) return messageFail(interaction, 'Please run this command in the channel you saw the message in.\nDon\'t worry, the bots and your message wont show up for anyone else in this command.\n\nMake sure the channel this command is run in is a shared channel, otherwise this will not work.');

  const messageID = interaction.options.getString('messageid');
  const reason = interaction.options.getString('reason');
  if (isNaN(messageID)) return messageFail(interaction, 'Please provide a valid message ID');
  const reportedMessage = await interaction.channel.messages.fetch(messageID).catch(() => null);
  if (!reportedMessage) return messageFail(interaction, 'Please provide a valid message ID');

  const message = await new EmbedBuilder()
    .setDescription('Please confirm that you have read the ToS and Privacy Policy.')
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
      const reportChannel = client.channels.cache.find((channel) => channel.id === config.commands.report.logChannel);

      const files = reportedMessage.attachments.map((file) => file.attachment).join('\n');

      const embedReport = await new EmbedBuilder()
        .setTitle('Message Report!')
        .addFields([
          {
            name: 'Message ID',
            value: reportedMessage.id,
          },
          {
            name: 'Username sender',
            value: reportedMessage.author.tag,
          },
          {
            name: 'User(/Webook) ID',
            value: reportedMessage.author.id,
          },
          {
            name: 'Timestamp',
            value: time(reportedMessage.createdAt),
          },
          {
            name: 'Guild',
            value: reportedMessage.guild.name,
          },
          {
            name: 'Guild ID',
            value: reportedMessage.guildId,
          },
          {
            name: 'User reporter',
            value: interaction.user.id,
          },
          {
            name: 'Reason for report',
            value: reason,
          },
        ]);
      if (files) {
        embedReport.addFields([
          {
            name: 'Attachemnts:',
            value: files,
          },
        ]);
      }

      reportedMessage.embeds.push(embedReport);
      await reportChannel.send({
        content: reportedMessage.content === '' ? 'No Message' : reportedMessage.content,
        embeds: reportedMessage.embeds,
      });
      message
        .setDescription('Your report has been sent! If possible, please join our Discord server to explain further your decision on why you reported this message: https://discord.gg/p9fbBAjbnh.')
        .setColor('Green');
    } else {
      message
        .setDescription('Please read the ToS and accept, before reporting.')
        .setColor('Red');
    }
    return reply(interaction, { embeds: [message], ephemeral: true }, true);
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size !== 0) return;
    message.setDescription('Your response took too long. Please run the command again.');
    reply(interaction, { embeds: [message], ephemeral: true }, true);
  });
};

module.exports.data = new CmdBuilder()
  .setName('report')
  .setDescription('Report a message.')
  .addStringOption((option) => option.setName('messageid').setDescription('The message id you would like to report.').setRequired(true))
  .addStringOption((option) => option.setName('reason').setDescription('The message id you would like to report.').setRequired(true));
