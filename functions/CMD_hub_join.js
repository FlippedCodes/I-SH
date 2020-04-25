const BridgedChannel = require('../database/models/bridgedChannel');

const HubName = require('../database/models/hubName');

const errHander = (err) => {
  console.error('ERROR:', err);
};

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

// gets hubID from DB
async function getHubID(hubName) {
  const result = await HubName.findOne({ attributes: ['hubID'], where: { hubName } }).catch(errHander);
  if (result) return result.hubID;
  return null;
}

// creates channel DB entry
async function createBridgedChannel(hubID, channelID) {
  const result = await BridgedChannel.findOne({ where: { channelID } }).catch(errHander);
  if (result) return false;
  const [bridgedChannel] = await BridgedChannel.findOrCreate({
    where: { channelID }, defaults: { hubID },
  }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, hubName, customChnanelID] = args;
  // check if hubname is present
  if (!hubName) {
    return messageFail(client, message,
      `Command usage: 
      \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} ${hubName || 'HUBNAME'} [CHANNELID]\`\`\``);
  }
  // get hubID
  const hubID = await getHubID(hubName);
  if (!hubID) return messageFail(client, message, `There is no hub named \`${hubName}\`! But you can create one by using \`${config.prefix}${module.exports.help.parent} register\`.`);

  // get custom channel
  let channelID = message.channel.id;
  if (customChnanelID) channelID = customChnanelID;

  const created = await createBridgedChannel(hubID, channelID);
  if (created) {
    let successMessage = `This channel is now linked with \`${hubName}\``;
    if (customChnanelID) successMessage = `The channel <#${channelID}> is now linked with \`${hubName}\``;
    messageSuccess(client, message, successMessage);
  } else {
    messageFail(client, message, `The channel you are trying to link is already linked with \`${hubName}\`! Try unlinking it by using \`${config.prefix}${module.exports.help.parent} leave\`.`);
  }
};

module.exports.help = {
  name: 'CMD_hub_join',
  parent: 'hub',
};
