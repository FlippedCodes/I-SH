const Sequelize = require('sequelize');

module.exports = sequelize.define(
  'bridgedChannel',
  {
    channelID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      unique: true,
    },
    serverID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    hubID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    allowInvites: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    uniqueKeys: {
      uniqueLink: {
        fields: ['serverID', 'hubID'],
      },
    },
  },
);
