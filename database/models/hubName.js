const Sequelize = require('sequelize');

module.exports = sequelize.define('hubName', {
  hubID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  hubName: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
  },
  ownerID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
