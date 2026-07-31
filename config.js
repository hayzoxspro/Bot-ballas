const path = require('path');

module.exports = {
  // ---------- Général ----------
  serverName: process.env.SERVER_NAME || 'Balla Gang | Diamond City',

  // ---------- Bienvenue ----------
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || 'METS_L_ID_DU_SALON_ICI',
  embedTitle: 'Ho ! Un nouveau membre !',
  accentColor: '#9b59b6',
  backgroundImagePath: path.join(__dirname, 'assets', 'background.jpg'),

  // ---------- Au revoir ----------
  goodbyeChannelId: process.env.GOODBYE_CHANNEL_ID || 'METS_L_ID_DU_SALON_ICI',
  goodbyeEmbedTitle: 'Un membre nous quitte...',
  goodbyeAccentColor: '#e74c3c',
  goodbyeBackgroundImagePath: path.join(__dirname, 'assets', 'background.jpg'),

  // ---------- Tickets ----------
  ticketPanelTitle: 'Ticket Ballas',
  ticketAccentColor: '#c724b1', // violet/rose comme le logo
  // Image principale affichée dans le panneau (mets ton image dans assets/ticket-banner.jpg)
  ticketBannerImagePath: path.join(__dirname, 'assets', 'ticket-banner.jpg'),
  // Petite image en haut à droite du panneau (le logo, ex. assets/ticket-logo.png)
  ticketLogoImagePath: path.join(__dirname, 'assets', 'ticket-logo.png'),
  // Catégorie Discord dans laquelle créer les salons de ticket
  ticketCategoryId: process.env.TICKET_CATEGORY_ID || 'METS_L_ID_DE_LA_CATEGORIE_ICI',
  // Rôle du staff qui a accès à tous les tickets (optionnel, laisse vide si aucun)
  ticketStaffRoleId: process.env.TICKET_STAFF_ROLE_ID || '',
  // Les raisons proposées dans le menu déroulant
  ticketReasons: [
    { label: 'Recrutement', value: 'recrutement', description: 'Tu veux rejoindre le gang' },
    { label: 'Habitant', value: 'habitant', description: 'Question en tant qu\'habitant du serveur' },
    { label: 'Affiliation', value: 'affiliation', description: 'Demande d\'affiliation entre gangs/organisations' },
    { label: 'Question', value: 'question', description: 'Une autre question' },
  ],
};
