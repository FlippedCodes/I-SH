const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction, HubName, user, BlockedUser, hubID) => {
  const blockedUserInfo = await BlockedUser.findOne({ where: { hubID: hubID.hubID, userID: user.id } }).catch(ERR);
  if (!blockedUserInfo) return messageFail(interaction, 'This user is not blocked in this hub.');
  const embed = new EmbedBuilder()
    .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setAuthor({ name: user.tag })
    .setDescription('User is blocked from sending messages from other guilds to this channel.')
    .setColor('Green')
    .addFields([
      { name: 'Blocked since:', value: `<t:${Date.parse(blockedUserInfo.createdAt) / 1000}>` },
      { name: 'Acknowledged:', value: prettyCheck(blockedUserInfo.acknowledged) },
      { name: 'Reason:', value: blockedUserInfo.reason },
    ]);
  reply(interaction, { embeds: [embed], ephemeral: true });
};

module.exports.data = { subcommand: true };
