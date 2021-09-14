// prepares command usage message
function CommandUsage(prefix, cmdName, subcmd) {
  return `Command usage: 
    \`\`\`${prefix}${cmdName} ${subcmd}\`\`\``;
}

module.exports.run = async (client, message, args, config) => {
  const currentCMD = module.exports.help;
  const [subcmd] = args;
  const commandValues = currentCMD.usage.split('|');
  if (commandValues.includes(subcmd)) {
    client.functions.get(`CMD_hub_${subcmd}`)
      .run(client, message, args, config);
  } else {
    messageFail(message, CommandUsage(config.prefix, currentCMD.name, currentCMD.usage));
  }
};

module.exports.help = {
  name: 'hub',
  title: 'Manage hub',
  usage: 'register|delete|join|leave|list|ban',
  desc: 'Manage hubs and links between channels.',
};
