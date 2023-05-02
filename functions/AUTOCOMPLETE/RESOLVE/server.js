const hubName = require('../../../database/models/hubName');

const bridgedChannel = require('../../../database/models/bridgedChannel');

module.exports.run = async (interaction) => {
  const hubNameVal = interaction.options.getString('hubname');
  if (!hubNameVal) return [{ name: 'Please select the \'hubname\' first', value: '0' }];
  const hub = await hubName.findOne({ attributes: ['hubID'], where: { hubName: hubNameVal } }).catch(ERR);
  const allServers = await bridgedChannel.findAll({ attributes: ['serverID'], where: { hubID: hub.hubID } }).catch(ERR);

  const output = allServers.map((entry) => {
    console.log(`DEBUG ${entry.serverID}`);
    const name = client.guilds.cache.get(entry.serverID).name || entry.serverID;
    return { name, value: entry.serverID };
  });
  return output;
};

module.exports.data = {
  name: 'server',
};
