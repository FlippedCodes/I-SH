module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, type] = args;
  // check provided values
  switch (type) {
    case 'user':
      client.functions.get(`CMD_${module.exports.help.parent}_${subcmd}_${type}`)
        .run(client, message, args, config);
      return;

    default:
      return messageFail(client, message,
        `Command usage: 
        \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} ${type || 'user'} MESSAGEID REASON\`\`\``);
  }
};

module.exports.help = {
  name: 'CMD_hub_ban',
  parent: 'hub',
};
