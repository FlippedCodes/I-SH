global.messageFail = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('EmbedBuilder')
    .run(interaction, body, '', color || 16449540, false, ephemeral || true);
  return sentMessage;
};

global.messageSuccess = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('EmbedBuilder')
    .run(interaction, body, '', color || 4296754, false, ephemeral || false);
  return sentMessage;
};

// raw reply to commands
global.reply = (interaction, payload, followUp = false) => {
  if (followUp) return interaction.followUp(payload);
  // check if message needs to be edited or if its a first reply
  if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
  return interaction.reply(payload);
};

global.prettyCheck = (question) => {
  if (question) return '✅';
  return '❌';
};

module.exports.data = {
  name: 'globalFunc',
};
