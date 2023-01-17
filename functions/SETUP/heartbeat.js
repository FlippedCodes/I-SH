let running = false;

// Calls all the functions that are needed for a heartbeat
module.exports.run = async () => {
  if (DEBUG) return;
  if (running) return;
  running = true;
  console.log(`[${module.exports.data.name}] Start sending heartbeats...`);
  // botlists
  // TODO: Better implementation: call on startup or when servercount changes
  // TODO: Generelize function as all are quite simmilar
  // client.functions.get('HEARTBEAT_BOTLIST_botsondiscord').run();
  // client.functions.get('HEARTBEAT_BOTLIST_discordbotlist').run();
  // client.functions.get('HEARTBEAT_BOTLIST_discordlist').run();
  // client.functions.get('HEARTBEAT_BOTLIST_discords').run();
  // client.functions.get('HEARTBEAT_BOTLIST_discordbots').run();
  // client.functions.get('HEARTBEAT_BOTLIST_motiondevelopment').run();
  // uptime page
  // TODO: curreclty not set up
  // client.functions.get('HEARTBEAT_uptime').run();
};

module.exports.data = {
  name: 'heartbeat',
  callOn: '-',
};
