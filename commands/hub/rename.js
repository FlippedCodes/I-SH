module.exports.run = async (interaction, HubName) => {
  const oldHubnameStr = interaction.options.getString('hubname');
  const newHubnameStr = interaction.options.getString('newhubname');

  const newHubName = newHubnameStr.replaceAll(' ', '_');
  const fittedHubName = `${interaction.id}_${newHubName}`;
  if (fittedHubName.length > 50) return messageFail(interaction, 'Sorry, your new hubname ist too long... Try something shorter.');
  // update db entry
  const updated = await HubName.update({ hubName: fittedHubName }, { where: { hubName: oldHubnameStr, ownerID: interaction.user.id } }).catch(ERR);
  if (updated) {
    messageSuccess(interaction, `You updated \`${newHubName}\`!
      You can link with it by using \`/${interaction.commandName} join hubname: ${fittedHubName}\`.
      **Make sure you only give the hub name to servers that you want to invite.**`);
  } else messageFail(interaction, `It seems that you don't own ${oldHubnameStr} or it doesn't exist.`);
};

module.exports.data = { subcommand: true };
