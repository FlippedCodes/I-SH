const HubName = require('../database/models/hubName');

const ERR = (err) => { console.error('ERROR:', err); };

// creates a embed messagetemplate for succeded actions
function messageSuccess(client, message, body) {
  client.functions.get('FUNC_EmbedBuilderMessage')
    .run(client.user, message.channel, body, '', 4296754, false);
}

// creates a embed messagetemplate for failed actions
function messageFail(client, message, body) {
  client.functions.get('FUNC_EmbedBuilderMessage')
    .run(client.user, message.channel, body, '', 16449540, false);
}

// gets hub names from DB
async function getHubNames(ownerID) {
  const result = await HubName.findAll({ attributes: ['hubName'], where: { ownerID } }).catch(ERR);
  if (result) return result;
  return null;
}

module.exports.run = async (client, message, args, config) => {
  // check if in DM
  if (message.channel.type !== 'dm') return messageFail(client, message, 'This command can only be used in DM!');
  // get hubNames
  const hubNames = await getHubNames(message.author.id);
  let names = '';
  await hubNames.forEach((entry) => names += `${entry.hubName}\n`);
  messageSuccess(client, message, `Your Hubs:\n\`\`\`\n${names}\`\`\``);
};

module.exports.help = {
  name: 'CMD_hub_list',
};
