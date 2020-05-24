const { Op } = require('sequelize');

const MessageLink = require('../database/models/messageLink');

module.exports.run = async (config) => {
  const date = new Date();
  const currentTimestamp = date.getTime();
  const calculatedTimestamp = currentTimestamp - config.messageLinkTime;
  MessageLink.destroy({ where: { createdAt: { [Op.lt]: calculatedTimestamp } } });
};

module.exports.help = {
  name: 'FUNC_messageGarbageCollection',
};
