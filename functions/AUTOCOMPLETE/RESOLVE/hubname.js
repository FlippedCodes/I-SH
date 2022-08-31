const hubName = require('../../../database/models/hubName');

async function getHubNames(ownerID) {
  const result = await hubName.findAll({ attributes: ['hubName'], where: { ownerID } }).catch(ERR);
  return result;
}

module.exports.run = async (serverID) => {
  const DBentries = await getHubNames(serverID);

  const output = DBentries.map((entry) => ({ name: entry.hubName, value: `${entry.hubName}` }));
  return output;
};

module.exports.data = {
  name: 'hubname',
};
