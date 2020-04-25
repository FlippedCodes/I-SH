const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, config) => {
  // prepare title and desc for embed
  const embed = new RichEmbed()
    .setTitle('Halp')
    .setColor(message.member.displayColor)
    .setDescription('For additional Info, please ask `Phil | Flipper#3621`');
  // creating embed fields for every command
  client.commands.forEach((CMD) => {
    embed.addField(
      `\`${config.prefix}${CMD.help.name} ${CMD.help.usage || ''}\``,
      CMD.help.desc, false,
    );
  });
  embed.addField('Need Help?', `
  Join the help server here: https://discord.gg/fMYD6XR`);
  message.channel.send(embed);
};

module.exports.help = {
  name: 'help',
  title: 'Help',
  desc: 'Shows this help of commans.',
};
