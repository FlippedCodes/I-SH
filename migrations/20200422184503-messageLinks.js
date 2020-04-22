module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messagelinks', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('messagelinks'),
};
