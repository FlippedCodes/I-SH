const Sequelize = require('sequelize');

const testdiscordToken = '../config/config.json';

const config = require('../config/main.json');

module.exports.run = () => {
  console.log('[DB] Connecting...');
  let database;
  let user;
  let password;
  let host;
  if (config.env.get('inDev')) {
    const DBCredentials = require(testdiscordToken).development;
    database = DBCredentials.database;
    user = DBCredentials.username;
    password = DBCredentials.password;
    host = DBCredentials.host;
  } else {
    database = process.env.DBNameISH;
    user = process.env.DBUsernameISH;
    password = process.env.DBPasswISH;
    host = process.env.DBHost;
  }
  const sequelize = new Sequelize(
    database, user, password, { host, dialect: 'mysql', logging: config.env.get('inDev') },
  );
  console.log('[DB] Connected!');

  global.sequelize = sequelize;
};

module.exports.help = {
  name: 'STARTUP_DBConnection',
};