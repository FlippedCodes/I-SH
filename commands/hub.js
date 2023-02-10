const HubName = require('../database/models/hubName');

const BridgedChannel = require('../database/models/bridgedChannel');

module.exports.run = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const subName = interaction.options.getSubcommand(true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, HubName, BridgedChannel);
};

module.exports.data = new CmdBuilder()
  .setName('hub')
  .setDescription('Manage your hubs.')
  .addSubcommand((SC) => SC
    .setName('register')
    .setDescription('Add a new hub.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Tell me, what you want your hub to be called.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('list')
    .setDescription('See all the hubs you own and what they are called.'))
  .addSubcommand((SC) => SC
    .setName('listservers')
    .setDescription('List all servers that are part of a hub.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Give me the hub name you want to seee the .')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('join')
    .setDescription('Add this channel to a hub.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Give me your hub name.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('leave')
    .setDescription('Remove this channel from the hub'))
  .addSubcommand((SC) => SC
    .setName('rename')
    .setDescription('Rename a existing hub.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Tell me, which hub you want to rename.')
      .setAutocomplete(true)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('newhubname')
      .setDescription('Write down, how the new hub should be called.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('transfer')
    .setDescription('Transfer a hub to a new owner.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Give me your hub name.')
      .setAutocomplete(true)
      .setRequired(true))
    .addUserOption((option) => option
      .setName('user')
      .setDescription('Select the user you want to transfer the hub to.')
      .setRequired(true)))
  .addSubcommand((SC) => SC
    .setName('delete')
    .setDescription('Delete a hub and destroy the link between all channels.')
    .addStringOption((option) => option
      .setName('hubname')
      .setDescription('Give me your hub name.')
      .setAutocomplete(true)
      .setRequired(true)));
