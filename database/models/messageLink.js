const Sequelize = require('sequelize');

module.exports = sequelize.define('messageLink', {
  messageInstanceID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  messageID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  channelID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
