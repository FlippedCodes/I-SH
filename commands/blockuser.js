const HubName = require('../database/models/hubName');

const BridgedChannel = require('../database/models/bridgedChannel');

const BlockedUser = require('../database/models/blockedUser');

module.exports.run = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const subName = interaction.options.getSubcommand(true);
  // FIXME: user is null
  const user = interaction.options.getUser(true);
  const hubID = await BridgedChannel.findOne({ attributes: ['hubID'], where: { channelID: interaction.channel.id } }).catch(ERR);
  if (!hubID) return messageFail(interaction, 'This channel is not a hub channel.');

  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, HubName, user, BlockedUser, hubID);
};

module.exports.data = new CmdBuilder()
  .setName('blockuser')
  .setDescription('Manage blocked users.')
  .addSubcommand((SC) => SC
    .setName('search')
    .setDescription('Check, if a user is blocked from using this hub.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('block')
    .setDescription('Add this channel to a hub.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('pardon')
    .setDescription('Remove the block from a user.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Give me the user in question.')
      .setRequired(true)));
