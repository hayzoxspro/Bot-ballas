const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const CONFIG = require('./config');

/**
 * Génère une bannière générique (800x300), utilisée pour la bienvenue et l'au revoir.
 * options.mainText : le gros texte affiché ("Bienvenue" ou "Au revoir")
 * options.subText : le texte plus petit en dessous
 * options.backgroundImagePath : chemin de l'image de fond
 * options.accentColor : couleur de la bordure de l'avatar + du nom du serveur
 */
async function generateBanner(member, options) {
  const { mainText, subText, backgroundImagePath, accentColor } = options;
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // --- Fond ---
  if (fs.existsSync(backgroundImagePath)) {
    const bg = await loadImage(backgroundImagePath);
    ctx.drawImage(bg, 0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // --- Avatar circulaire à gauche ---
  const avatarSize = 160;
  const avatarX = 60;
  const avatarY = height / 2 - avatarSize / 2;

  try {
    const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
    const avatarImg = await loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = accentColor;
    ctx.stroke();
  } catch (e) {
    console.warn('Impossible de charger l\'avatar :', e.message);
  }

  // --- Textes ---
  const textX = avatarX + avatarSize + 40;

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px sans-serif';
  ctx.fillText(mainText, textX, 150);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#d1d1d1';
  ctx.fillText(subText, textX, 195);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = accentColor;
  ctx.fillText(CONFIG.serverName, textX, 240);

  return canvas.toBuffer('image/png');
}

function generateWelcomeBanner(member) {
  return generateBanner(member, {
    mainText: 'Bienvenue',
    subText: 'sur le serveur Discord',
    backgroundImagePath: CONFIG.backgroundImagePath,
    accentColor: CONFIG.accentColor,
  });
}

function generateGoodbyeBanner(member) {
  return generateBanner(member, {
    mainText: 'Au revoir',
    subText: 'quitte le serveur Discord',
    backgroundImagePath: CONFIG.goodbyeBackgroundImagePath,
    accentColor: CONFIG.goodbyeAccentColor,
  });
}

module.exports = { generateWelcomeBanner, generateGoodbyeBanner };
