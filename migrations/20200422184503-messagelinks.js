module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messageLinks', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      messageUnique: {
        fields: ['messageID', 'channelID'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('messageLinks'),
};
