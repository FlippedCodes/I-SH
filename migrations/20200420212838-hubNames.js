module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('hubnames', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('hubnames'),
};