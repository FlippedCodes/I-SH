module.exports.run = async (interaction, HubName, user, BlockedUser, hubID) => {
  const blockedUsers = await BlockedUser.findAll({ attributes: ['userID'], where: { channelID: interaction.channel.id } }).catch(ERR);
  if (!blockedUsers.length) return messageFail(interaction, 'You don\'t have any users blocked from your guild.');
  const names = blockedUsers.map((entry) => `• \`${entry.userID}\` - <@${entry.userID}>`).join('\n');
  const desc = `**Blocked Users:**\n${names}`;
  messageSuccess(interaction, desc.length >= 4000 ? `${desc.slice(0, 4000)}...\nAnd more...` : desc);
};

module.exports.data = { subcommand: true };
