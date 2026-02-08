# 📊 Dashboard Projet Pilote CME

> 📚 **[→ COMMENCEZ ICI : LISEZ-MOI-EN-PREMIER.md](LISEZ-MOI-EN-PREMIER.md)** - Guide de bienvenue et démarrage rapide
> 
> 📖 **[→ Index complet de la documentation (INDEX.md)](INDEX.md)** - Guide de navigation dans toute la documentation

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Projet%20Gouvernemental-green)]()

Tableau de bord de reporting pour le suivi de l'exécution de la phase pilote du projet de digitalisation du Carnet Mère-Enfant.

## 🎯 Objectif

Suivre en temps réel la progression du projet pilote de digitalisation du carnet mère-enfant dans 5 établissements de santé de Côte d'Ivoire, avec un objectif de 400 femmes enceintes enregistrées sur la période du 03/02/2026 au 27/02/2026.

## ✨ Fonctionnalités

- 📈 Suivi en temps réel des indicateurs clés
- 👩‍⚕️ Monitoring des sages-femmes formées et présentes
- 🤰 Suivi des femmes enceintes (reçues, enregistrées, connectées)
- 📊 Visualisations graphiques de progression
- 🏥 Comparaison entre établissements
- 🎯 Taux d'atteinte des objectifs quotidiens

## 🏥 Établissements suivis

- CHU COCODY
- CHR ABOBO
- HG YOPOUGON-ATTIE
- HG BINGERVILLE
- FSU WILLIAMSVILLE

## 🚀 Déploiement

Consultez le fichier [DEPLOIEMENT.md](./DEPLOIEMENT.md) pour les instructions complètes de déploiement gratuit sur Vercel ou d'autres plateformes.

### Démarrage rapide en local

```bash
# Installer les dépendances
yarn install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Lancer en développement
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn/ui
- **Base de données**: PostgreSQL + Prisma ORM
- **Charts**: Chart.js, Recharts, Plotly.js
- **Authentification**: NextAuth.js

## 📁 Structure du projet

```
├── app/                    # Pages et routes Next.js (App Router)
│   ├── api/               # API routes
│   ├── application/       # Page données application
│   ├── comparaison/       # Page comparaison
│   ├── supervision/       # Page données supervision
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
│   ├── constants.ts       # Constantes du projet
│   ├── db.ts             # Client Prisma
│   └── utils.ts          # Fonctions utilitaires
├── prisma/               # Schéma et migrations Prisma
│   └── schema.prisma     # Définition du modèle de données
└── public/               # Fichiers statiques

```

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète des variables nécessaires.

## 📄 Licence

Ce projet est développé pour le Ministère de la Santé de Côte d'Ivoire dans le cadre du projet de digitalisation du carnet mère-enfant.
