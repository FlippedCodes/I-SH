// gets hub names from DB
async function getHubNames(BlockedUser, ownerID) {
  const result = await BlockedUser.findAll({ attributes: ['hubName'], where: { ownerID } }).catch(ERR);
  if (result) return result;
  return null;
}

module.exports.run = async (interaction, HubName, user, BlockedUser, hubID) => {
  const blockedUsers = await getHubNames(BlockedUser, interaction.user.id);
  if (!blockedUsers.length) return messageFail(interaction, 'You don\'t have any users blocked.');
  const names = blockedUsers.map((entry) => `• ${entry.hubName}`).join('\n');
  const desc = `**Blocked Users:**\n\n${names}`;
  messageSuccess(interaction, desc.length >= 4000 ? `${desc.slice(0, 4000)}...\nAnd more...` : desc);
};

module.exports.data = { subcommand: true };
