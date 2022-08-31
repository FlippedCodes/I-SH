const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('Halp')
    .setColor('Green')
    .setDescription('This command is deprecated, please use discord embedded slash-commands feature instead.')
    .addFields([{
      name: 'Still need help?',
      value: `Read the wiki here: https://github.com/FlippedCodes/I-SH/wiki
      or join our server here: https://discord.gg/p9fbBAjbnh`,
    }]);
  return reply(interaction, { embeds: [embed] });
};

module.exports.data = new CmdBuilder()
  .setName('help')
  .setDescription('Shows a list of commands. [Deprecated]');
