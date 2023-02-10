module.exports.run = async (interaction, HubName, BridgedChannel) => {
  const hubNameVal = interaction.options.getString('hubname');
  const serverID = interaction.options.getString('server');

  const hub = await HubName.findOne({ attributes: ['hubID'], where: { hubName: hubNameVal } }).catch(ERR);

  const deletedLink = await BridgedChannel.destroy({ where: { hubID: hub.hubID, serverID } }).catch(ERR);
  if (!deletedLink) return messageFail(interaction, 'Oh no! It seems something went wrong... Please try again another time. If this error persists, feel free to contact us on our support server.');
  messageSuccess(interaction, `You have successfully kicked the requested server (\`${serverID}\`).\nIt's recommended that you rename your hub with '/hub rename' to prevent them from rejoining. (Existing guilds will not be kicked from this.)`);
};

module.exports.data = { subcommand: true };
