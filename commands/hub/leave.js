const { ChannelType, PermissionsBitField } = require('discord.js');

// deletes channel entry from DB
async function deleteChannel(BridgedChannel, channelID) {
  const result = await BridgedChannel.destroy({ where: { channelID } }).catch(ERR);
  return result;
}

module.exports.run = async (interaction, HubName, BridgedChannel) => {
  if (interaction.channel.type === ChannelType.DM) return messageFail(interaction, 'You can\'t link a DM channel!');

  // check MANAGE_CHANNELS permissions
  if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageChannels)) return messageFail(interaction, `You are not authorized to use \`/${interaction.commandName} join\` in this server.`);

  // delete channel entry from database
  const created = await deleteChannel(BridgedChannel, interaction.channel.id);
  // check if channel entry is deleted and give feedback
  if (created) messageSuccess(interaction, 'This channel is now no longer linked!');
  else messageFail(interaction, 'This channel is not linked with any hub! You can\'t unlink it.');
};

module.exports.data = { subcommand: true };
