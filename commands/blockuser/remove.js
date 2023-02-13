module.exports.run = async (interaction, HubName, user, BlockedUser, hubIDRaw) => {
  const deletedBlock = await BlockedUser.destroy({ where: { userID: user.id, channelID: interaction.channel.id } }).catch(ERR);
  if (!deletedBlock) messageFail(interaction, 'This user is not blocked from using the hub in this guild.');
  else messageSuccess(interaction, `The user ${user} \`${user.id}\` has been unblocked from this channel.`);
};

module.exports.data = { subcommand: true };
