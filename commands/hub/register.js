// creates channel DB entry
async function createHub(HubName, name, ownerID, maxHubs) {
  const result = await HubName.findAndCountAll({ where: { ownerID } }).catch(ERR);
  if (result.count >= maxHubs) return false;
  await HubName.create({ hubName: name, ownerID }).catch(ERR);
  return true;
}

module.exports.run = async (interaction, HubName) => {
  const hubnameStr = interaction.options.getString('hubname');
  const hubName = hubnameStr.replaceAll(' ', '_');
  const fittedHubName = `${interaction.id}_${hubName}`;
  if (fittedHubName.length > 50) return messageFail(interaction, 'Sorry, your hubname is too long... Try something shorter.');
  const created = await createHub(HubName, fittedHubName, interaction.user.id, config.commands.hub.maxAllowedHubs);
  if (created) {
    messageSuccess(interaction, `You created \`${hubName}\`!
      You can link with it by using \`/${interaction.commandName} join hubname: ${fittedHubName}\`.
      **Make sure you only give the hub name to servers that you want to invite.**`);
  } else messageFail(interaction, `Your account already owns a maximum of ${config.commands.hub.maxAllowedHubs} hubs. You can't create more then that!`);
};

module.exports.data = { subcommand: true };
