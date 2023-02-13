const { PermissionsBitField } = require('discord.js');

const BridgedChannel = require('../database/models/bridgedChannel');

module.exports.run = async (interaction) => {
  const allowInvites = interaction.options.getBoolean('allow');


  // check ManageChannels user permissions
  if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageChannels)) return messageFail(interaction, `You are not authorized to use \`/${interaction.commandName}\` in this server.`);

  // get hub
  const hubChannel = await BridgedChannel.findOne({ where: { channelID: interaction.channel.id } }).catch(ERR);
  if (!hubChannel) return messageFail(interaction, 'This channel is not part of a hub.');

  // check, if the bot can create invites
  if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.CreateInstantInvite)) return messageFail(interaction, 'Please allow the bot to create invites.');

  // update db entry
  const updated = await hubChannel.update({ allowInvites }).catch(ERR);
  // const updated = await BridgedChannel.update({ allowInvites }, { where: { channelID: interaction.channel.id } }).catch(ERR);
  if (updated) {
    if (allowInvites) messageSuccess(interaction, 'You allowed this channel to share and show invites.');
    else messageSuccess(interaction, 'The channel no longer shows and shares invites.');
  } else messageFail(interaction, 'Something went wrong: `allowInvites - update failed`');
};

module.exports.data = new CmdBuilder()
  .setName('allowinvites')
  .setDescription('Allow invites to other servers and allow your invite to be shared with other servers.')
  .addBooleanOption((option) => option
    .setName('allow')
    .setDescription('Toggle on or off.')
    .setRequired(true));
