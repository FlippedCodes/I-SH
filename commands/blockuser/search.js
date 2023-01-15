// gets hub names from DB
async function getBlock(BlockedUser, userID, hubID) {
  const result = await BlockedUser.findOne({ where: { hubID, userID } }).catch(ERR);
  if (result) return result;
  return null;
}

module.exports.run = async (interaction, HubName, user, BlockedUser, hubID) => {
  const blockedUserInfo = await getBlock(BlockedUser, user.id, hubID);
  if (!blockedUserInfo) return messageSuccess(interaction, 'This user is not blocked in this hub');
  messageSuccess(interaction, `**Your hub names:**\n\n${names}`);
};

module.exports.data = { subcommand: true };
