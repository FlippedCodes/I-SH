const Sequelize = require('sequelize');

module.exports = sequelize.define('bannedUser', {
  userID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
    autoIncrement: true,
  },
  reason: Sequelize.TEXT,
});
