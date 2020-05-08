// init Discord
const Discord = require('discord.js');
// init Discord client
const client = new Discord.Client({ disableEveryone: true });
// init sequelize
const sequelize = require('sequelize');
// init filesystem
const fs = require('fs');
// init config
const config = require('./config/main.json');

// create new collections in client and config
client.functions = new Discord.Collection();
client.commands = new Discord.Collection();
config.env = new Discord.Collection();

// import Functions and Commands
config.setup.startupFunctions.forEach((FCN) => {
  const INIT = require(`./functions/${FCN}.js`);
  INIT.run(client, fs, config);
});

// create conenction to DB
require('./database/SETUP_DBConnection');

// Login the bot
client.login(config.env.get('token'));

// trigger on bot login
client.on('ready', () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as ${client.user.tag} serving ${client.guilds.size} Servers!`);
  // set bot player status
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

// trigger on new message
client.on('message', (message) => {
  client.functions.get('EVENT_message').run(client, message, config);
});

// trigger on deleted message
// DISABLED: due to not trigger for messages before bot start
// client.on('messageDelete', async (message) => {
//   client.functions.get('EVENT_messageDelete').run(client, message, config);
// });
client.on('raw', async (packet) => {
  if (packet.t === 'MESSAGE_DELETE' && packet.d.guild_id) {
    // const message = new Discord.Message(client, packet);
    const guild = await client.guilds.find((guild) => guild.id === packet.d.guild_id);
    const entry = await guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then((audit) => audit.entries.first());
    if (!entry.executor.bot) client.functions.get('EVENT_messageDelete').run(client, packet.d, config);
  }
});

// logging errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
