# Bot Discord — Balla Gang | Diamond City

Bot qui gère :
- les messages de bienvenue/au revoir avec bannière générée automatiquement
- un système de tickets avec menu déroulant (Recrutement, Habitant, Affiliation, Question)

## 1. Créer le bot sur Discord

1. Va sur https://discord.com/developers/applications
2. **New Application** → nomme-la (ex : "Balla Gang | Diamond City")
3. Onglet **Bot** → **Reset Token** → copie le token (à garder secret !)
4. Toujours dans **Bot**, active l'intent **SERVER MEMBERS INTENT** (obligatoire pour les arrivées/départs)
5. Onglet **General Information** → copie l'**Application ID** (= `CLIENT_ID`)
6. Onglet **OAuth2 > URL Generator** :
   - Scopes : `bot`, `applications.commands`
   - Permissions : `Send Messages`, `Embed Links`, `Attach Files`, `Manage Channels`, `Manage Roles`
   - Ouvre l'URL générée pour inviter le bot sur ton serveur

## 2. Installer le projet

```bash
npm install
```

## 3. Configurer

```bash
cp .env.example .env
```

Remplis `.env` :

```
DISCORD_TOKEN=le_token_copié_à_l_étape_1
CLIENT_ID=l_application_id_copiée_à_l_étape_5
GUILD_ID=id_de_ton_serveur          # optionnel, pour tester plus vite
WELCOME_CHANNEL_ID=id_du_salon_de_bienvenue
GOODBYE_CHANNEL_ID=id_du_salon_d_au_revoir
SERVER_NAME=Balla Gang | Diamond City
TICKET_CATEGORY_ID=id_de_la_categorie_pour_les_tickets
TICKET_STAFF_ROLE_ID=id_du_role_staff   # optionnel
```

Pour récupérer un ID (salon, catégorie, rôle, serveur) : Paramètres Discord → Avancés → active le **Mode développeur**, puis clic droit → **Copier l'identifiant**.

### Images (optionnel)

Place tes images dans `assets/` :
- `background.jpg` → fond des bannières de bienvenue/au revoir
- `ticket-banner.jpg` → grande image du panneau de tickets
- `ticket-logo.png` → petit logo en haut à droite du panneau de tickets

Si un fichier est absent, le bot s'en passe automatiquement (dégradé de secours pour les bannières, pas d'image pour le panneau de tickets).

## 4. Déployer la commande slash

```bash
npm run deploy
```

Ça enregistre la commande `/ticket-panel`. Avec `GUILD_ID` renseigné elle apparaît immédiatement ; sans, ça peut prendre jusqu'à 1h (déploiement global).

## 5. Lancer le bot

```bash
npm start
```

## 6. Utilisation

**Bienvenue / Au revoir** : automatique, dès qu'un membre rejoint ou quitte le serveur.

**Tickets** :
1. Dans le salon de ton choix, tape `/ticket-panel` (il faut la permission "Gérer le serveur")
2. Le bot poste le panneau avec le menu déroulant "Choisissez une raison pour ouvrir un ticket..."
3. Quand un membre choisit une raison, un salon privé `ticket-pseudo` est créé, visible seulement par lui, le staff (si configuré) et le bot
4. Un bouton **Fermer le ticket** permet au propriétaire, au staff ou à un modérateur de fermer (supprimer) le salon

## 7. Héberger le bot 24/7

Pour que le bot reste en ligne en permanence, héberge-le sur un serveur (VPS, Railway, Render, etc.) plutôt que sur ton PC personnel.
