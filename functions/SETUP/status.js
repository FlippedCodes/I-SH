module.exports.run = async () => {
  if (DEBUG) return;
  console.log(`[${module.exports.data.name}] Setting status...`);
  await client.user.setStatus('online');
  const servercount = await client.guilds.cache.length;
  // TODO: update activity message
  await client.user.setActivity(`for messages in ${servercount} servers! | +help`, { type: 'LISTENING' });
  console.log(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: 'setup',
};
