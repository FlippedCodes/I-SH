module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('offlinestats', {
    ID: {
      type: Sequelize.STRING(30),
      primaryKey: true,
    },
    time: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('offlinestats'),
};
