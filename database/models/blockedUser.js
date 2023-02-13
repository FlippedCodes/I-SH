const Sequelize = require('sequelize');

module.exports = sequelize.define('blockedUser', {
  blockID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  channelID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  hubID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  reason: {
    type: Sequelize.TEXT('tiny'),
    allowNull: false,
  },
  acknowledged: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  uniqueKeys: {
    blockUnique: {
      fields: ['userID', 'channelID', 'hubID'],
    },
  },
});
