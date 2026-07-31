require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { registerWelcomeHandlers } = require('./welcome');
const { registerTicketHandlers } = require('./tickets');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', () => {
  console.log(`Connecte en tant que ${client.user.tag}`);
});

registerWelcomeHandlers(client);
registerTicketHandlers(client);

client.login(process.env.DISCORD_TOKEN);
