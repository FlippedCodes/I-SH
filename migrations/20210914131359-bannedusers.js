module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bannedUsers', {
    ID: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    hubID: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'hubNames',
        key: 'hubID',
      },
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    uniqueKeys: {
      banUnique: {
        fields: ['userID', 'hubID'],
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('bannedUsers'),
};
