const { Op } = require('sequelize');

const MessageLink = require('../database/models/messageLink');

module.exports.run = async (config) => {
  const date = new Date();
  const currentTimestamp = date.getTime();
  const calculatedTimestamp = config.messageLinkTime + currentTimestamp;
  // FIXME: fix operator and timestamp to fit the DB timestamp
  MessageLink.destroy({ where: { createdAt: { [Op.gt]: calculatedTimestamp } } });
};

module.exports.help = {
  name: 'FUNC_messageGarbageCollection',
};
