require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { registerWelcomeHandlers } = require('./welcome');
const { registerTicketHandlers } = require('./tickets');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const commands = [
  new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Envoie le panneau de tickets dans ce salon (staff uniquement)')
    .toJSON(),
];

// Enregistre les commandes slash auprès de Discord à chaque démarrage du bot.
// Ça évite d'avoir à lancer "npm run deploy" séparément (pratique sur Railway).
async function deployCommands() {
  if (!process.env.CLIENT_ID) {
    console.warn('CLIENT_ID manquant dans les variables d\'environnement : impossible d\'enregistrer les commandes /.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('Commandes / enregistrees sur le serveur (GUILD_ID).');
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('Commandes / enregistrees globalement (peut prendre jusqu\'a 1h pour apparaitre).');
    }
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des commandes / :', err);
  }
}

client.once('ready', async () => {
  console.log(`Connecte en tant que ${client.user.tag}`);
  await deployCommands();
});

registerWelcomeHandlers(client);
registerTicketHandlers(client);

client.login(process.env.DISCORD_TOKEN);
