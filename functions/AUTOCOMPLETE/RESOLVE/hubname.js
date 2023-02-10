const hubName = require('../../../database/models/hubName');

module.exports.run = async (interaction) => {
  const DBentries = await hubName.findAll({ attributes: ['hubName'], where: { ownerID: interaction.user.id } }).catch(ERR);

  const output = DBentries.map((entry) => ({ name: entry.hubName, value: `${entry.hubName}` }));
  return output;
};

module.exports.data = {
  name: 'hubname',
};
