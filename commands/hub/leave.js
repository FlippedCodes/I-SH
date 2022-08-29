// removes a server from the ParticipatingServers table
async function removeServer(ParticipatingServer, serverID) {
  const success = await ParticipatingServer.update(
    { active: false },
    { where: { serverID, active: true } },
  )
    .catch(ERR);
  return success[0];
}

module.exports.run = async (interaction, ParticipatingServer) => {
  // TODO: Check if in DMs


  
  const serverID = interaction.guildId;
  const serverRemoved = await removeServer(ParticipatingServer, serverID);
  if (serverRemoved >= 1) {
    messageSuccess(interaction,
      `The server with the ID \`${serverID}\` got disabled from the participating Servers list.`);
  } else {
    messageFail(interaction,
      `The server with the ID \`${serverID}\` couldn't be found of the list.`);
  }
};

module.exports.data = { subcommand: true };
