const { PermissionsBitField } = require('discord.js');

const HubName = require('../database/models/hubName');

const BridgedChannel = require('../database/models/bridgedChannel');

const BlockedUser = require('../database/models/blockedUser');

module.exports.run = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  // check BanMembers permissions
  if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) return messageFail(interaction, `You are not authorized to use \`/${interaction.commandName}\` in this server.`);

  const subName = interaction.options.getSubcommand(true);
  const user = interaction.options.getUser('user', true);
  const hubID = await BridgedChannel.findOne({ attributes: ['hubID'], where: { channelID: interaction.channel.id } }).catch(ERR);
  if (!hubID) return messageFail(interaction, 'This channel is not part of a hub.');
  // TODO: check user permissions

  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, HubName, user, BlockedUser, hubID);
};

module.exports.data = new CmdBuilder()
  .setName('blockuser')
  .setDescription('Manage blocked users from this guild.')
  .addSubcommand((SC) => SC
    .setName('search')
    .setDescription('Check, if a user is blocked from using this hub.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('See all the users that are blocked from this guild.'))
  .addSubcommand((SC) => SC
    .setName('add')
    .setDescription('Add this channel to a hub.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('reason')
      .setDescription('The reason will be visible to the user.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('pardon')
    .setDescription('Remove the block from a user.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true)));
