const BridgedChannel = require('../database/models/bridgedChannel');

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

// deletes channel entry from DB
async function deleteChannel(channelID) {
  const result = await BridgedChannel.destroy({ where: { channelID } }).catch(errHander);
  return result;
}

module.exports.run = async (client, message, args, config) => {
  // TODO: check user permissions
  // Hold on! You dont have permissions to manage this channel. Try asking an admin to remove the link.

  // get custom channel
  const channelID = message.channel.id;

  const created = await deleteChannel(channelID);
  if (created) {
    messageSuccess(client, message, 'This channel is now not longer linked!');
  } else {
    messageFail(client, message, 'This channel is not linked with any hub! You can\'t unlink it.');
  }
};

module.exports.help = {
  name: 'CMD_hub_leave',
  parent: 'hub',
};
