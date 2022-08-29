// gets hub names from DB
async function getHubNames(HubName, ownerID) {
  const result = await HubName.findAll({ attributes: ['hubName'], where: { ownerID } }).catch(ERR);
  if (result) return result;
  return null;
}

module.exports.run = async (interaction, HubName) => {
  const hubNames = await getHubNames(HubName, interaction.user.id);
  if (!hubNames.length) return messageFail(interaction, `You don't own any hubs. Create one, using \`/${interaction.commandName} register\``);
  const names = hubNames.map((entry) => `• ${entry.hubName}`).join('\n');
  messageSuccess(interaction, `**Your hub names:**\n\n${names}`);
};

module.exports.data = { subcommand: true };
