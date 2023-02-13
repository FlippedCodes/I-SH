module.exports.run = async (interaction, HubName, user, BlockedUser, hubIDRaw) => {
  const reason = interaction.options.getString('reason', true);
  const created = await BlockedUser.findOrCreate({
    where: { hubID: hubIDRaw.hubID, userID: user.id, channelID: interaction.channel.id }, defaults: { reason },
  }).catch(ERR);
  if (created[1]) {
    messageSuccess(interaction, `You blocked \`${user.tag}\` from messenging this server through the hub.`);
  } else messageFail(interaction, `The user \`${user.tag}\` is already blocked from from messenging this server through this hub.`);
};

module.exports.data = { subcommand: true };
