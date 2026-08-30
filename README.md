# ⚡ Saynarelec

<div align="center">

  **Plateforme web moderne pour entreprise d'électricité générale, rénovation & énergie solaire en Belgique.**

  [![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white&style=flat-square)](https://supabase.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white&style=flat-square)](https://cloudinary.com/)
  [![EmailJS](https://img.shields.io/badge/EmailJS-Form_Delivery-EA580C?logo=mail.ru&logoColor=white&style=flat-square)](https://www.emailjs.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

  [Demo / Site Web](https://saynarelec.com) • [Fonctionnalités](#-fonctionnalités) • [Technologies](#-technologies) • [Installation](#-installation-rapide) • [Déploiement](#-déploiement) • [Licence](#-licence)

</div>

---

## 📌 Présentation du Projet

**Saynarelec** est une application web vitrine et commerciale haute performance conçue pour les services d'électricité générale, de rénovation, de mise en conformité RGIE et d'installations photovoltaïques en Belgique.

Le projet met l'accent sur :
- Une **expérience utilisateur ultra-fluide** et réactive avec micro-animations (`Framer Motion`).
- Une **optimisation SEO avancée** (données structurées Schema.org `Electrician` / `WebSite`, OpenGraph, balises dynamiques `react-helmet-async`).
- Un **système multilingue** (FR / NL / EN) intégré.
- Un module de **demande de devis & contact interactif** connecté à EmailJS et Supabase.

---

## ✨ Fonctionnalités Clés

- 🌍 **Support Multilingue (i18n)** : Gestion dynamique des langues (Français, Néerlandais, Anglais) avec persistance de préférence.
- ⚡ **Performance & Vitesse** : Construit sur Vite avec un code splitting optimisé et un chargement d'images via Cloudinary CDN.
- 🎨 **Design Moderne & UI Radix** : Composants accessibles basés sur Radix UI et Tailwind CSS, conformes aux standards de design actuels.
- 🔍 **SEO & RGIE Ready** :
  - Métadonnées complètes pour Google et réseaux sociaux.
  - JSON-LD structuré pour les entreprises locales d'électricité en Belgique.
  - Pages dédiées pour chaque corps de métier (mise en conformité, dépannage, solaire, etc.).
- 📩 **Formulaire de Devis & Contact** : Formulaire interactif et validé (`react-hook-form` + `zod`) avec expédition instantanée de courriels (`EmailJS`).
- 🖼 **Galerie & Réalisations** : Visualiseur de projets interactif avec Lightbox haute résolution.
- 📱 **Mobile-First & PWA-Ready** : Design entièrement adaptatif pour smartphones, tablettes et ordinateurs, avec barre de statut dynamique sur mobile.

---

## 🛠 Technologies & Outils

### Frontend Core
- **[React 18](https://reactjs.org/)** — Bibliothèque UI déclarative.
- **[Vite](https://vitejs.dev/)** — Outil de build et serveur de développement ultra-rapide.
- **[React Router v6](https://reactrouter.com/)** — Routage côté client avec redirections optimisées.
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)** — Gestion de l'état asynchrone et du cache de données.

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework CSS utilitaire.
- **[Radix UI](https://www.radix-ui.com/)** — Primitives de composants headless accessibles.
- **[Framer Motion](https://www.framer.com/motion/)** — Animations fluides et transitions de pages.
- **[Lucide React](https://lucide.dev/)** — Bibliothèque d'icônes vectorielles modernes.

### Backend & Intégrations
- **[Supabase](https://supabase.com/)** — Stockage et gestion de base de données.
- **[Cloudinary](https://cloudinary.com/)** — CDN et hébergement des médias d'illustration.
- **[EmailJS](https://www.emailjs.com/)** — Envoi des notifications de formulaires sans serveur backend dédié.

---

## 📁 Structure du Projet

```text
saynarelec/
├── public/                 # Assets statiques (favicons, robots.txt, manifest)
├── src/
│   ├── api/                # Clients API et points d'accès externes
│   ├── assets/             # Images, icônes et styles globaux
│   ├── components/         # Composants réutilisables
│   │   ├── site/           # Composants métier du site (Hero, Services, Contact, etc.)
│   │   ├── ui/             # Composants d'interface génériques (Radix / Shadcn)
│   │   ├── SEO.jsx         # Gestionnaire de balises OpenGraph et meta
│   │   └── ScrollToTop.jsx # Remise à zéro du scroll lors de la navigation
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Contexte i18n, client Supabase, utilitaires
│   ├── pages/              # Pages principales (Home, Services, Contact, Legal)
│   ├── App.jsx             # Configuration des routes et des providers
│   ├── main.jsx            # Point d'entrée React
│   └── index.css           # Définitions CSS globales et thèmes Tailwind
├── index.html              # Template HTML principal avec JSON-LD & meta SEO
├── tailwind.config.js      # Configuration personnalisée Tailwind CSS
├── vite.config.js          # Configuration Vite
└── package.json            # Dépendances et scripts NPM
```

---

## 🚀 Installation Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- `npm`, `yarn` ou `pnpm`

### 1. Cloner le dépôt
```bash
git clone https://github.com/Saynaro/saynarelec.git
cd saynarelec
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet en vous basant sur la configuration suivante :

```env
# SUPABASE
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre_cle_anonyme"

# CLOUDINARY
VITE_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="votre_upload_preset"

# EMAILJS
VITE_EMAILJS_PUBLIC_KEY="votre_public_key"
VITE_EMAILJS_SERVICE_ID="votre_service_id"
VITE_EMAILJS_TEMPLATE_ID="votre_template_id"
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 📜 Scripts Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Lance le serveur local Vite avec HMR |
| `npm run build` | Compile l'application pour la production dans `/dist` |
| `npm run preview` | Prévisualise la version de production en local |
| `npm run lint` | Analyse le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs de linting |
| `npm run typecheck`| Vérifie la cohérence des types TypeScript / JSConfig |

---

## 🌐 Déploiement

Pour déployer sur une plateforme comme **Vercel**, **Netlify** ou un serveur VPS :

1. Construisez le bundle de production :
   ```bash
   npm run build
   ```
2. Déployez le dossier `dist/` généré.
3. Configurez les redirections SPA (`_redirects` pour Netlify ou `vercel.json` pour Vercel) :
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 📄 Licence

Distribué sous la licence **MIT**. Voir le fichier [`LICENSE`](LICENSE) pour plus d'informations.
