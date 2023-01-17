const Sequelize = require('sequelize');

module.exports = sequelize.define('blockedUser', {
  userID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  hubID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  acknowledged: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
