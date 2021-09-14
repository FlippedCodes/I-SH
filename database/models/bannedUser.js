const Sequelize = require('sequelize');

module.exports = sequelize.define('bannedUser', {
  ID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  hubID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    references: {
      model: 'hubNames',
      key: 'hubID',
    },
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
},
{
  uniqueKeys: {
    banUnique: {
      fields: ['userID', 'hubID'],
    },
  },
});
