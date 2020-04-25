const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  const embed = new RichEmbed().setTitle('Halp');
  if (message.channel.type !== 'dm') embed.setColor(message.member.displayColor);
  // creating embed fields for every command
  client.commands.forEach((CMD) => {
    if (!CMD.help.title) return;
    embed.addField(CMD.help.title,
      `\`${config.prefix}${CMD.help.name} ${CMD.help.usage || ''}\`
      ${CMD.help.desc}`, false);
  });
  embed.addField('Need Help?', 'Join the halp serwer here: https://discord.gg/7J2RKDR')
    .setFooter(client.user.tag, client.user.displayAvatarURL)
    .setTimestamp();
  message.channel.send({ embed });
};

module.exports.help = {
  name: 'help',
  title: 'Help',
  desc: 'Shows this help of commans.',
};
