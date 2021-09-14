const BridgedChannel = require('../database/models/bridgedChannel');

const HubName = require('../database/models/hubName');

const errHander = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_richEmbedMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// gets hubID from DB
async function getHubID(hubName) {
  const result = await HubName.findOne({ attributes: ['hubID'], where: { hubName } }).catch(errHander);
  if (result) return result.hubID;
  return null;
}

// creates channel DB entry
async function createBridgedChannel(hubID, channelID, serverID) {
  if (await BridgedChannel.findOne({ where: { channelID } }).catch(errHander)) return false;
  if (await BridgedChannel.findOne({ where: { serverID, hubID } }).catch(errHander)) return false;
  const [bridgedChannel] = await BridgedChannel.findOrCreate({
    where: { channelID }, defaults: { serverID, hubID },
  }).catch(errHander);
  return true;
}

async function checkPermissions(message) {
  const permissions = await message.client.functions.get('FUNC_checkPermissions').run(message.member, message, 'MANAGE_CHANNELS');
  return permissions;
}

module.exports.run = async (client, message, args, config) => {
  // check DM
  if (message.channel.type === 'dm') return messageFail(message, 'You can\'t link a DM channel!');
  // check user permissions
  if (!await checkPermissions(message)) return messageFail(message, 'Hold on! You dont have permissions to manage this channel. Try asking an admin or link another chnanel where you have permissions instead.');

  // get subcmd from args
  const [subcmd, hubName] = args;
  // check if hubname is present
  if (!hubName) {
    return messageFail(message,
      `Command usage: 
      \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} HUBNAME\`\`\``);
  }
  // get hubID
  const hubID = await getHubID(hubName);
  if (!hubID) return messageFail(message, `There is no hub named \`${hubName}\`! But you can create one by using \`${config.prefix}${module.exports.help.parent} register\`.`);

  // get custom channel
  const channelID = message.channel.id;
  const serverID = message.guild.id;
  const created = await createBridgedChannel(hubID, channelID, serverID);
  if (created) {
    messageSuccess(client, message, `This channel is now linked with \`${hubName}\``);
  } else {
    messageFail(message, `A channel in this server is already linked with \`${hubName}\`! Try unlinking it first by using \`${config.prefix}${module.exports.help.parent} leave\`.`);
  }
};

module.exports.help = {
  name: 'CMD_hub_join',
  parent: 'hub',
};
