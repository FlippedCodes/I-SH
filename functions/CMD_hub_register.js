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

// creates channel DB entry
async function createHub(hubName, ownerID, maxHubs) {
  const result = await HubName.findAndCountAll({ where: { ownerID } }).catch(errHander);
  if (result.count >= maxHubs) return false;
  await HubName.create({ hubName, ownerID }).catch(errHander);
  return true;
}

module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, checkHubName] = args;
  // check if hubname is present
  if (!checkHubName) {
    return messageFail(client, message,
      `Command usage: 
      \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} ${checkHubName || 'HUBNAME'}\`\`\``);
  }

  const hubName = args.join('_').slice(subcmd.length + 1);
  const fittedHubName = `${message.id}_${hubName}`;
  if (fittedHubName.length > 50) return messageFail(client, message, 'Sorry, your hubname ist too long... Try something shorter.');
  const created = await createHub(fittedHubName, message.author.id, config.maxAllowedHubs);
  if (created) messageSuccess(client, message, `You created \`${hubName}\`! You can link with it by using \`${config.prefix}${module.exports.help.parent} join ${fittedHubName} [CHANNELID]\`.`);
  else messageFail(client, message, `Your account already owns a maximum of ${config.maxAllowedHubs} hubs. You can't create more then that!`);
};

module.exports.help = {
  name: 'CMD_hub_register',
  parent: 'hub',
};
