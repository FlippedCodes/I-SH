module.exports.run = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  messageSuccess(interaction, 'Here is our ToS and privacy policy: https://github.com/FlippedCodes/I-SH/wiki/ToS-and-Privacy-Policy');
};

module.exports.data = new CmdBuilder()
  .setName('tos')
  .setDescription('Link to the applications ToS and privacy policy');
