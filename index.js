// init Discord
const { Client, IntentsBitField, Collection } = require('discord.js');
// init filesystem
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// use contructor to create intent bit field
const intents = new IntentsBitField([
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
]);
// init Discord client
global.client = new Client({ disableEveryone: true, intents });
// init config
global.config = require('./config.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor(16449540);
  client.channels.cache.get(config.logChannel).send({ embeds: [embed] });
  return;
};

// create new collections in client and config
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

client.login(process.env.discordToken)
  .then(() => {
    // import Functions and Commands; startup database connection
    fs.readdirSync('./functions/STARTUP').forEach((FCN) => {
      if (FCN.search('.js') === -1) return;
      const INIT = require(`./functions/STARTUP/${FCN}`);
      INIT.run(fs);
    });
  });

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.name}] Logged in as "${client.user.tag}"!`);

  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // run startup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run(client, config);
  });
});

// trigger on new message
client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message));

// trigger on channelDeletion
client.on('channelDelete', (channel) => client.functions.get('EVENT_channelDelete').run(channel));

// trigger on guildDelete
client.on('guildDelete', (guild) => client.functions.get('EVENT_guildDelete').run(guild));

// trigger on deleted message with raw package
client.on('raw', async (packet) => {
  if (packet.t === 'MESSAGE_DELETE' && packet.d.guild_id) {
    client.functions.get('EVENT_messageDelete').run(packet.d);
  }
});

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));
