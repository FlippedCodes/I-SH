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
  reason: Sequelize.TEXT,
  acknowledged: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});
