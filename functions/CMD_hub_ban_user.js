module.exports.run = async (client, message, args, config) => {
  // get subcmd from args
  const [subcmd, type, messageID, reason] = args;
  if (!messageID || !reason) {
    return messageFail(message,
      `Command usage: 
    \`\`\`${config.prefix}${module.exports.help.parent} ${subcmd} ${type || 'user'} ${messageID || 'MESSAGEID'} ${reason || 'REASON'}\`\`\``);
  }
  // get complete reason
  let cutLength = 0;
  [subcmd, type, messageID].map((arg) => cutLength = cutLength + arg.length + 1);
  const slicedReason = await args.join(' ').slice(cutLength);
  messageSuccess(message, `\`\`\`${slicedReason}\`\`\``);
  // check permissions
  // get messageID => parse messageInstanceID
  // get messageInstanceID => get channelID
  // get channel from channelID and lookup messageID
  // get hubID from channelID
  // get author => parse userID
  // check if owner: dont ban owner
  // post bannedUserEntry [hubID + userID]
  // update owner
};

module.exports.help = {
  name: 'CMD_hub_ban_user',
  parent: 'hub',
};
