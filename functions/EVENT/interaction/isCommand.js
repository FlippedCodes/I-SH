module.exports.run = async (interaction) => {
  const mainCMD = interaction.commandName.replace('_dev', '');

  const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
  if (command) return command.run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'isCommand',
};
