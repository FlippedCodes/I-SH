const Sequelize = require('sequelize');

module.exports = sequelize.define('bridgedChannel', {
  channelID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    unique: true,
  },
  hubID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: 'hubnames',
      key: 'hubID',
    },
  },
});
