module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messagelinks', {
    messageInstanceID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    messageID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('messagelinks'),
};
