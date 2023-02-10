module.exports.run = async (interaction, HubName, BridgedChannel) => {
  const hubNameVal = interaction.options.getString('hubname');

  const hub = await HubName.findOne({ attributes: ['hubID'], where: { hubName: hubNameVal } }).catch(ERR);
  const allServers = await BridgedChannel.findAll({ attributes: ['serverID'], where: { hubID: hub.hubID } }).catch(ERR);

  const serversFormatted = allServers.map((entry) => `• ${client.guilds.cache.get(entry.serverID).name || entry.serverID}`).join('\n');
  if (!allServers.length) return messageFail(interaction, 'There are no guilds in this hub.');
  const desc = `**All ${allServers.length} guilds that are in this hub:**\n${serversFormatted}`;
  return messageSuccess(interaction, desc.length >= 4000 ? `${desc.slice(0, 4000)}...\nAnd more...` : desc);
};

module.exports.data = { subcommand: true };
