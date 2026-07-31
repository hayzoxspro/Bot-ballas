const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const CONFIG = require('./config');
const { generateWelcomeBanner, generateGoodbyeBanner } = require('./banner');

function registerWelcomeHandlers(client) {
  client.on('guildMemberAdd', async (member) => {
    try {
      const channel = await member.guild.channels.fetch(CONFIG.welcomeChannelId).catch(() => null);
      if (!channel) {
        console.warn('Salon de bienvenue introuvable. Vérifie WELCOME_CHANNEL_ID.');
        return;
      }

      const bannerBuffer = await generateWelcomeBanner(member);
      const attachment = new AttachmentBuilder(bannerBuffer, { name: 'welcome.png' });

      const embed = new EmbedBuilder()
        .setColor(CONFIG.accentColor)
        .setTitle(CONFIG.embedTitle)
        .setDescription(`Bienvenue ${member} !`)
        .setImage('attachment://welcome.png');

      await channel.send({ embeds: [embed], files: [attachment] });
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message de bienvenue :', err);
    }
  });

  client.on('guildMemberRemove', async (member) => {
    try {
      const channel = await member.guild.channels.fetch(CONFIG.goodbyeChannelId).catch(() => null);
      if (!channel) {
        console.warn('Salon d\'au revoir introuvable. Vérifie GOODBYE_CHANNEL_ID.');
        return;
      }

      const bannerBuffer = await generateGoodbyeBanner(member);
      const attachment = new AttachmentBuilder(bannerBuffer, { name: 'goodbye.png' });

      const embed = new EmbedBuilder()
        .setColor(CONFIG.goodbyeAccentColor)
        .setTitle(CONFIG.goodbyeEmbedTitle)
        .setDescription(`${member.user.username} vient de quitter le serveur.`)
        .setImage('attachment://goodbye.png');

      await channel.send({ embeds: [embed], files: [attachment] });
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message d\'au revoir :', err);
    }
  });
}

module.exports = { registerWelcomeHandlers };
