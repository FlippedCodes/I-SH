const BridgedChannel = require('../database/models/bridgedChannel');

const HubName = require('../database/models/hubName');

const errHander = (err) => { console.error('ERROR:', err); };

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
async function createBridgedChannel(hubID, channelID, serverID) {
  let result = false;
  result = await BridgedChannel.findOne({ where: { channelID } }).catch(errHander);
  result = await BridgedChannel.findOne({ where: { serverID, hubID } }).catch(errHander);
  if (result) return false;
  const [bridgedChannel] = await BridgedChannel.findOrCreate({
    where: { channelID }, defaults: { serverID, hubID },
  }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config) => {
  // TODO: check if server has already the same shared channel
  // TODO: check user permissions
  // Hold on! You dont have permissions to manage this channel. Try asking an admin or link another chnanel where you have permissions instead.
  // get subcmd from args
  const [subcmd, hubName] = args;
  // check if hubname is present
  if (!hubName) {
    return messageFail(client, message,
      `Command usage: 
      \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} HUBNAME\`\`\``);
  }
  // get hubID
  const hubID = await getHubID(hubName);
  if (!hubID) return messageFail(client, message, `There is no hub named \`${hubName}\`! But you can create one by using \`${config.prefix}${module.exports.help.parent} register\`.`);

  // get custom channel
  const channelID = message.channel.id;
  const serverID = message.guild.id;
  const created = await createBridgedChannel(hubID, channelID, serverID);
  if (created) {
    messageSuccess(client, message, `This channel is now linked with \`${hubName}\``);
  } else {
    messageFail(client, message, `This channel is already linked with \`${hubName}\`! Try unlinking it first by using \`${config.prefix}${module.exports.help.parent} leave\`.`);
  }
};

module.exports.help = {
  name: 'CMD_hub_join',
  parent: 'hub',
};
