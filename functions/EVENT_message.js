module.exports.run = async (client, message, config) => {
  // return if unwanted
  if (message.author.bot) return;
  // if (message.channel.type === 'dm') return;

  // put comamnd in array
  const messageArray = message.content.split(/\s+/g);
  const command = messageArray[0];
  const args = messageArray.slice(1);

  // return if not prefix
  if (!command.startsWith(config.prefix)) return client.functions.get('FUNC_sharedChannels').run(client, message, config);

  // remove prefix and lowercase
  const cmd = client.commands.get(command.slice(config.prefix.length).toLowerCase());

  // run cmd if existent
  if (cmd) {
    cmd.run(client, message, args, config)
      .catch(console.log);
  }
};

module.exports.help = {
  name: 'EVENT_message',
};
