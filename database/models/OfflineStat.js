const Sequelize = require('sequelize');

module.exports = sequelize.define('offlineStat', {
  ID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  time: Sequelize.STRING(30),
});
