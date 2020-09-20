const HubName = require('../database/models/hubName');

const BridgedChannel = require('../database/models/bridgedChannel');

const MessageLink = require('../database/models/messageLink');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
async function messageFail(client, message, body) {
  const result = client.functions.get('FUNC_MessageEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
  return result;
}

// count channel entrys
async function countChannels(hubID) {
  const result = await BridgedChannel.findAndCountAll({ where: { hubID } }).catch(errHander);
  return result.count;
}

// check for hubName and get hubID
async function getHubID(hubName) {
  const result = await HubName.findOne({ attributes: ['hubID', 'ownerID'], where: { hubName } }).catch(errHander);
  if (result) return [result.hubID, result.ownerID];
  return [null];
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, hubName] = args;
  // check if hubname is present
  if (!hubName) {
    return messageFail(client, message,
      `Command usage: 
      \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} ${hubName || 'HUBNAME'}\`\`\``);
  }

  // parse values
  const [hubID, ownerID] = await getHubID(hubName);
  const channelAmmount = await countChannels(hubID);

  // check hub entry
  if (!hubID) return messageFail(client, message, `There is no hub named ${hubName}. Please check your spelling and try again.`);
  // check owner
  // TODO: Add managment exception
  if (ownerID !== message.author.id) return messageFail(client, message, `You are not the owner of the hub ${hubName}.`);

  // sending pre deletion message
  const confirmMessage = await messageFail(client, message, `You are about to delete the hub **${hubName}** with ${channelAmmount} connected channels which can't be undone! \nAre you sure?`);
  await confirmMessage.react('❌');
  await confirmMessage.react('✅');

  // start reaction collector
  const filter = (reaction, user) => user.id === ownerID;
  const reactionCollector = confirmMessage.createReactionCollector(filter, { time: 10000 });
  reactionCollector.on('collect', async (reaction) => {
    reactionCollector.stop();
    switch (reaction.emoji.name) {
      case '❌':
        return messageSuccess(client, message, 'Crisis avoided! Your hub has not been deleted!');
      case '✅':
        // deleted channels and hub
        // const deletedMessages = await MessageLink.destroy({ where: { hubID } }).catch(errHander);
        const deletedChannels = await BridgedChannel.destroy({ where: { hubID } }).catch(errHander);
        const deletedHub = await HubName.destroy({ where: { hubID } }).catch(errHander);

        if (deletedHub && deletedChannels) messageSuccess(client, message, 'Your hub has now been deleted!');
        else messageFail(client, message, 'Oh no! It seems something went wrong... Please try again another time. If this error persists, feel free to contact us on our support server.');
        return;
      default:
        return messageFail(client, message, 'Please only choose one othe the two options! Try again.');
    }
  });
  reactionCollector.on('end', () => confirmMessage.delete());
};

module.exports.help = {
  name: 'CMD_hub_delete',
  parent: 'hub',
};
