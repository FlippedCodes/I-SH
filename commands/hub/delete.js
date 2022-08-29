const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('delete')
      .setEmoji('✅')
      .setLabel('Delete')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('keep')
      .setEmoji('❌')
      .setLabel('Keep')
      .setStyle(ButtonStyle.Secondary),
  ]);

// count channel entrys
async function countChannels(BridgedChannel, hubID) {
  const result = await BridgedChannel.findAndCountAll({ where: { hubID } }).catch(ERR);
  return result.count;
}

// check for hubName and get hubID
async function getHubID(HubName, name) {
  const result = await HubName.findOne({ attributes: ['hubID', 'ownerID'], where: { hubName: name } }).catch(ERR);
  if (result) return [result.hubID, result.ownerID];
  return [null];
}

module.exports.run = async (interaction, HubName, BridgedChannel, hubnameStr) => {
  // parse values
  const [hubID, ownerID] = await getHubID(HubName, hubnameStr);
  const channelAmmount = await countChannels(BridgedChannel, hubID);

  // check hub entry
  if (!hubID) return messageFail(interaction, `There is no hub named ${hubnameStr}. Please check your spelling and try again.`);
  // check owner
  // TODO: Add managment exception
  if (ownerID !== interaction.user.id) return messageFail(interaction, `You are not the owner of ${hubnameStr}.`);

  const message = await new EmbedBuilder()
    .setDescription(`You are about to delete the hub **${hubnameStr}** with **${channelAmmount}** connected channels which can't be undone! \nAre you sure?`)
    .setColor('Orange');
  const confirmMessage = await reply(interaction, {
    embeds: [message], components: [buttons], fetchReply: true, ephemeral: true,
  });
  // start button collector
  const buttonCollector = confirmMessage.createMessageComponentCollector({ time: 10000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    used.deferUpdate();
    if (used.customId === 'delete') {
      await BridgedChannel.destroy({ where: { hubID } }).catch(ERR);
      const deletedHub = await HubName.destroy({ where: { hubID } }).catch(ERR);

      if (!deletedHub) message.setDescription('Oh no! It seems something went wrong... Please try again another time. If this error persists, feel free to contact us on our support server.');
      else message.setDescription('Your hub has been deleted!');
      return reply(interaction, { embeds: [message], ephemeral: true }, true);
      // using new message, because editing ephemeral is not possible
      // return confirmMessage.edit({ embeds: [message], components: [] });
    }
    message
      .setDescription('Crisis avoided! Your hub has not been deleted!')
      .setColor('Green');
    return reply(interaction, { embeds: [message], ephemeral: true }, true);
    // return confirmMessage.edit({ embeds: [message], ephemeral: true, components: [] });
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size !== 0) return;
    message.setDescription('Your response took too long. Please run the command again.');
    reply(interaction, { embeds: [message], ephemeral: true }, true);
    // confirmMessage.edit({ embeds: [message], components: [] });
  });
};

module.exports.data = { subcommand: true };
