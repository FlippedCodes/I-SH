const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'messageLink',
  {
    messageInstanceID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    messageID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    channelID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
  },
  {
    uniqueKeys: {
      messageUnique: {
        fields: ['messageID', 'channelID'],
      },
    },
  },
);
