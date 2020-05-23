module.exports.run = async (message, type) => {
  if (message.channel.type === 'dm') return true;
  const botperms = message.guild.me.permissionsIn(message.channel);
  const hasPermissions = botperms.has(type);
  return hasPermissions;
};

module.exports.help = {
  name: 'FUNC_checkBotPermissions',
};
