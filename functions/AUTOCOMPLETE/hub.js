module.exports.run = async (interaction) => {
  const command = interaction.options.getFocused(true);
  const userID = interaction.user.id;
  const response = await client.functions.get(`AUTOCOMPLETE_RESOLVE_${command.name}`).run(interaction).catch(ERR);
  return interaction.respond(response);
};

module.exports.data = {
  name: 'guildmgr',
};
