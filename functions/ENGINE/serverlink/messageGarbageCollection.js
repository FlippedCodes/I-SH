const { Op } = require('sequelize');

const MessageLink = require('../../../database/models/messageLink');

module.exports.run = async (config) => {
  const date = new Date();
  const currentTimestamp = date.getTime();
  // 2022-08-30 - set to 6 months of storage
  const calculatedTimestamp = currentTimestamp - config.messageLinkTime;
  MessageLink.destroy({ where: { createdAt: { [Op.lt]: calculatedTimestamp } } });
};

module.exports.help = {
  name: 'messageGarbageCollection',
};
