const {
  EmbedBuilder,
  AttachmentBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType,
} = require('discord.js');
const fs = require('fs');
const CONFIG = require('./config');

const SELECT_MENU_ID = 'ticket_reason_select';
const CLOSE_BUTTON_ID = 'ticket_close';

/**
 * Construit le message du panneau de tickets (embed + menu déroulant + éventuels fichiers).
 * Utilisé à la fois par la commande /ticket-panel et si besoin ailleurs.
 */
function buildTicketPanelMessage() {
  const embed = new EmbedBuilder()
    .setColor(CONFIG.ticketAccentColor)
    .setTitle(CONFIG.ticketPanelTitle);

  const files = [];

  if (fs.existsSync(CONFIG.ticketBannerImagePath)) {
    const ext = CONFIG.ticketBannerImagePath.split('.').pop();
    const name = `ticket-banner.${ext}`;
    files.push(new AttachmentBuilder(CONFIG.ticketBannerImagePath, { name }));
    embed.setImage(`attachment://${name}`);
  }

  if (fs.existsSync(CONFIG.ticketLogoImagePath)) {
    const ext = CONFIG.ticketLogoImagePath.split('.').pop();
    const name = `ticket-logo.${ext}`;
    files.push(new AttachmentBuilder(CONFIG.ticketLogoImagePath, { name }));
    embed.setThumbnail(`attachment://${name}`);
  }

  const select = new StringSelectMenuBuilder()
    .setCustomId(SELECT_MENU_ID)
    .setPlaceholder('Choisissez une raison pour ouvrir un ticket...')
    .addOptions(
      CONFIG.ticketReasons.map((reason) => ({
        label: reason.label,
        value: reason.value,
        description: reason.description,
      }))
    );

  const row = new ActionRowBuilder().addComponents(select);

  return { embeds: [embed], components: [row], files };
}

function registerTicketHandlers(client) {
  client.on('interactionCreate', async (interaction) => {
    // ----- Ouverture d'un ticket -----
    if (interaction.isStringSelectMenu() && interaction.customId === SELECT_MENU_ID) {
      await handleTicketOpen(interaction);
      return;
    }

    // ----- Fermeture d'un ticket -----
    if (interaction.isButton() && interaction.customId === CLOSE_BUTTON_ID) {
      await handleTicketClose(interaction);
      return;
    }

    // ----- Commande slash pour poster le panneau -----
    if (interaction.isChatInputCommand() && interaction.commandName === 'ticket-panel') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
        await interaction.reply({ content: 'Tu n\'as pas la permission de faire ça.', ephemeral: true });
        return;
      }
      const panel = buildTicketPanelMessage();
      await interaction.channel.send(panel);
      await interaction.reply({ content: 'Panneau de tickets envoyé.', ephemeral: true });
    }
  });
}

async function handleTicketOpen(interaction) {
  const guild = interaction.guild;
  const member = interaction.member;
  const reasonValue = interaction.values[0];
  const reason = CONFIG.ticketReasons.find((r) => r.value === reasonValue);
  const reasonLabel = reason ? reason.label : reasonValue;

  await interaction.deferReply({ ephemeral: true });

  // Empêche les doublons : un ticket déjà ouvert pour ce membre
  const existing = guild.channels.cache.find(
    (c) => c.topic === `ticket-owner:${member.id}` && c.parentId === CONFIG.ticketCategoryId
  );
  if (existing) {
    await interaction.editReply({ content: `Tu as déjà un ticket ouvert : ${existing}` });
    return;
  }

  const overwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    {
      id: member.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    },
    {
      id: client_id(interaction),
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ManageChannels,
      ],
    },
  ];

  if (CONFIG.ticketStaffRoleId) {
    overwrites.push({
      id: CONFIG.ticketStaffRoleId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    });
  }

  const channelOptions = {
    name: `ticket-${member.user.username}`.toLowerCase().slice(0, 90),
    type: ChannelType.GuildText,
    topic: `ticket-owner:${member.id}`,
    permissionOverwrites: overwrites,
  };
  if (CONFIG.ticketCategoryId && CONFIG.ticketCategoryId !== 'METS_L_ID_DE_LA_CATEGORIE_ICI') {
    channelOptions.parent = CONFIG.ticketCategoryId;
  }

  const ticketChannel = await guild.channels.create(channelOptions);

  const embed = new EmbedBuilder()
    .setColor(CONFIG.ticketAccentColor)
    .setTitle(CONFIG.ticketPanelTitle)
    .setDescription(`Ticket ouvert par ${member} pour la raison : **${reasonLabel}**\n\nUn membre du staff va te répondre. En attendant, décris ta demande en détail.`);

  const closeButton = new ButtonBuilder()
    .setCustomId(CLOSE_BUTTON_ID)
    .setLabel('Fermer le ticket')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(closeButton);

  await ticketChannel.send({
    content: CONFIG.ticketStaffRoleId ? `<@&${CONFIG.ticketStaffRoleId}> ${member}` : `${member}`,
    embeds: [embed],
    components: [row],
  });

  await interaction.editReply({ content: `Ton ticket a été créé : ${ticketChannel}` });
}

async function handleTicketClose(interaction) {
  const channel = interaction.channel;
  const isOwner = channel.topic === `ticket-owner:${interaction.user.id}`;
  const isStaff =
    CONFIG.ticketStaffRoleId && interaction.member.roles.cache.has(CONFIG.ticketStaffRoleId);
  const isManager = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels);

  if (!isOwner && !isStaff && !isManager) {
    await interaction.reply({ content: 'Tu n\'as pas la permission de fermer ce ticket.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: 'Ce ticket va être fermé dans 5 secondes...' });
  setTimeout(() => {
    channel.delete().catch((err) => console.error('Erreur suppression du ticket :', err));
  }, 5000);
}

function client_id(interaction) {
  return interaction.client.user.id;
}

module.exports = { registerTicketHandlers, buildTicketPanelMessage };
