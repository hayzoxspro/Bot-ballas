require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Envoie le panneau de tickets dans ce salon (staff uniquement)')
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.CLIENT_ID) {
      throw new Error('CLIENT_ID manquant dans le .env (ID de l\'application, visible sur le Developer Portal).');
    }

    console.log('Déploiement de la commande /ticket-panel...');

    if (process.env.GUILD_ID) {
      // Déploiement sur un seul serveur : instantané, pratique en test
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('Commande déployée sur le serveur (GUILD_ID).');
    } else {
      // Déploiement global : peut prendre jusqu'à 1h pour apparaître
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('Commande déployée globalement (peut prendre jusqu\'à 1h).');
    }
  } catch (err) {
    console.error('Erreur lors du déploiement des commandes :', err);
  }
})();
