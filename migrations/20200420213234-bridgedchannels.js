module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bridgedChannels', {
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
      references: {
        model: 'hubnames',
        key: 'hubID',
      },
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      uniqueLink: {
        fields: ['serverID', 'hubID'],
      },
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('bridgedChannels'),
};
