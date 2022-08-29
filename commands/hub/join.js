const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField,
} = require('discord.js');

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

// check for hubName and get hubID
async function getHubID(HubName, name) {
  const result = await HubName.findOne({ attributes: ['hubID', 'ownerID'], where: { hubName: name } }).catch(ERR);
  if (result) return result.hubID;
  return null;
}

// creates channel DB entry
async function createBridgedChannel(BridgedChannel, hubID, channelID, serverID) {
  if (await BridgedChannel.findOne({ where: { channelID } }).catch(ERR)) return false;
  if (await BridgedChannel.findOne({ where: { serverID, hubID } }).catch(ERR)) return false;
  const [bridgedChannel] = await BridgedChannel.findOrCreate({
    where: { channelID }, defaults: { serverID, hubID },
  }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, HubName, BridgedChannel, hubnameStr) => {
  if (interaction.channel.type === ChannelType.DM) return messageFail(interaction, 'You can\'t link a DM channel!');

  // check MANAGE_CHANNELS permissions
  if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageChannels)) return messageFail(interaction, `You are not authorized to use \`/${interaction.commandName} join\` in this server.`);

  const permissions = interaction.guild.members.me.permissionsIn(interaction.channel);
  const ViewChannel = permissions.has(PermissionsBitField.Flags.ViewChannel);
  const ManageMessages = permissions.has(PermissionsBitField.Flags.ManageMessages);
  const ManageWebhooks = permissions.has(PermissionsBitField.Flags.ManageWebhooks);
  const permissionMissing = `${!ViewChannel ? '\n• `View Channel`' : ''}${!ManageMessages ? '\n• `Manage Messages`' : ''}${!ManageWebhooks ? '\n• `Manage Webhooks`' : ''}`;
  if (!(ViewChannel && ManageWebhooks)) return messageFail(interaction, `I'm missing the following permission(s) for this channel:${permissionMissing}\nPlease fix it and try again.`);

  // get hubID
  const hubID = await getHubID(HubName, hubnameStr);
  if (!hubID) return messageFail(interaction, `There is no hub named \`${hubnameStr}\`! But you can create one by using \`/${interaction.commandName} register\`.`);

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
      const created = await createBridgedChannel(BridgedChannel, hubID, interaction.channel.id, interaction.guild.id);

      if (!created) message.setDescription(`A channel in this server is already linked with \`${hubnameStr}\`! Try unlinking it first by using \`/${interaction.commandName} leave\`.`);
      else {
        message
          .setDescription(`All good to go! This channel is now linked with \`${hubnameStr}\`.`)
          .setColor('Green');
      }
      return reply(interaction, { embeds: [message], ephemeral: true }, true);
      // using new message, because editing ephemeral is not possible
      // return confirmMessage.edit({ embeds: [message], components: [] });
    }
    message
      .setDescription('You cant join a hub without accepting. Please run the command again to accept.')
      .setColor('Red');
    return reply(interaction, { embeds: [message], ephemeral: true }, true);
    // return confirmMessage.edit({ embeds: [message], ephemeral: true, components: [] });
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size !== 0) return;
    message.setDescription('Your response took too long. Please run the command again.');
    reply(interaction, { embeds: [message], ephemeral: true }, true);
    // confirmMessage.edit({ embeds: [message], components: [] });
  });
};

module.exports.data = { subcommand: true };
