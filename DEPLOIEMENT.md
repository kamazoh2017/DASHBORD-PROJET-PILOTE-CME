# Guide de déploiement - Dashboard Projet Pilote CME

## 📋 Description de l'application

Ce projet est un **tableau de bord de reporting** pour le suivi de l'exécution de la phase pilote du projet de digitalisation du Carnet Mère-Enfant (CME).

### Fonctionnalités principales :

1. **Suivi en temps réel** des données de 5 établissements de santé :
   - CHU COCODY
   - CHR ABOBO  
   - HG YOPOUGON-ATTIE
   - HG BINGERVILLE
   - FSU WILLIAMSVILLE

2. **Indicateurs suivis** :
   - Nombre de sages-femmes formées et présentes
   - Nombre de femmes enceintes reçues
   - Nombre de femmes enceintes enregistrées dans le système
   - Nombre de femmes enceintes connectées à l'application

3. **Visualisations** :
   - Graphiques de progression quotidienne
   - Comparaison entre les établissements
   - Taux d'atteinte des objectifs (objectif : 400 femmes enceintes, 22 par jour ouvrable)
   - Période du projet : 03/02/2026 au 27/02/2026

### Stack technique :

- **Frontend** : Next.js 14, React 18, TypeScript
- **UI** : Tailwind CSS, Radix UI, Shadcn/ui
- **Base de données** : PostgreSQL avec Prisma ORM
- **Graphiques** : Chart.js, Recharts, Plotly.js
- **Authentification** : NextAuth.js

## 🚀 Déploiement gratuit sur Vercel (3 semaines)

Vercel offre un hébergement gratuit parfait pour ce projet pendant 3 semaines :

### Étape 1 : Prérequis

1. Un compte GitHub (vous l'avez déjà)
2. Un compte Vercel gratuit : [vercel.com/signup](https://vercel.com/signup)
3. Une base de données PostgreSQL accessible en ligne

### Étape 2 : Préparer la base de données

Votre fichier `.env` contient déjà une base de données PostgreSQL hébergée. Gardez ces informations :

```
DATABASE_URL="postgresql://role_2f0c98b1b:Iy5R2jkJLBWQwqd0xxBYbxkBVpHj1p0s@db-2f0c98b1b.db003.hosteddb.reai.io:5432/2f0c98b1b?connect_timeout=15"
```

### Étape 3 : Déployer sur Vercel

#### Option A : Via l'interface Vercel (Recommandée)

1. **Connectez-vous à Vercel** : [vercel.com](https://vercel.com)

2. **Importez votre projet** :
   - Cliquez sur "Add New..." → "Project"
   - Sélectionnez votre repository GitHub : `kamazoh2017/DASHBORD-PROJET-PILOTE-CME`
   - Cliquez sur "Import"

3. **Configurez les variables d'environnement** :
   Dans la section "Environment Variables", ajoutez :
   ```
   DATABASE_URL = postgresql://role_2f0c98b1b:Iy5R2jkJLBWQwqd0xxBYbxkBVpHj1p0s@db-2f0c98b1b.db003.hosteddb.reai.io:5432/2f0c98b1b?connect_timeout=15
   
   ABACUSAI_API_KEY = 9c02ad76f0504deebcb5334a0ce54cd2
   ```

4. **Configurez les paramètres de build** :
   - Framework Preset : Next.js
   - Build Command : `yarn build` (par défaut)
   - Output Directory : `.next` (par défaut)
   - Install Command : `yarn install` (par défaut)

5. **Déployez** :
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes que le build se termine
   - Vercel générera une URL publique : `https://votre-projet.vercel.app`

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Suivre les instructions et confirmer les paramètres

# Pour déployer en production
vercel --prod
```

### Étape 4 : Initialiser la base de données

Après le premier déploiement, vous devez initialiser les tables de la base de données :

1. **Via Vercel Dashboard** :
   - Allez dans votre projet Vercel
   - Cliquez sur "Settings" → "Functions"
   - Ou utilisez Vercel CLI :

```bash
# Se connecter au projet
vercel link

# Exécuter les migrations Prisma
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db push
```

2. **Remplir les données initiales** (optionnel) :
   Si vous avez un script de seed :
   ```bash
   npx prisma db seed
   ```

### Étape 5 : Vérifier le déploiement

1. Ouvrez l'URL fournie par Vercel
2. Vérifiez que le tableau de bord s'affiche correctement
3. Testez la navigation entre les pages :
   - Page d'accueil (Vue d'ensemble)
   - Page Supervision
   - Page Application  
   - Page Comparaison

## 🔧 Configuration avancée

### Variables d'environnement complètes

Créez un fichier `.env.production` avec :

```bash
# Base de données PostgreSQL
DATABASE_URL="postgresql://role_2f0c98b1b:Iy5R2jkJLBWQwqd0xxBYbxkBVpHj1p0s@db-2f0c98b1b.db003.hosteddb.reai.io:5432/2f0c98b1b?connect_timeout=15"

# API Key pour AbacusAI (si utilisé)
ABACUSAI_API_KEY="9c02ad76f0504deebcb5334a0ce54cd2"

# NextAuth (optionnel pour l'authentification)
NEXTAUTH_URL="https://votre-domaine.vercel.app"
NEXTAUTH_SECRET="generer-un-secret-aleatoire-ici"

# Google Sheets (si vous utilisez l'import automatique)
SUPERVISION_SHEET_ID="1PknFijL8kB1OCKvVf5AnzHpXolAjrJCgGlCGGqcvKhM"
APPLICATION_SHEET_ID="10kme9THRbZFP7kBaFmvwrSCp_QgToEjCF6GrQBwap_w"
```

### Domaine personnalisé (optionnel)

Pour utiliser votre propre nom de domaine :
1. Allez dans Vercel Dashboard → Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions Vercel

## 📊 Utilisation de l'application

### Actualisation des données

L'application peut récupérer automatiquement les données depuis Google Sheets. Pour déclencher une actualisation manuelle, utilisez le bouton "Actualiser les données" dans l'interface.

### Structure des données

Le schéma de base de données contient 3 tables principales :

1. **SupervisionData** : Données de supervision quotidienne par établissement
2. **ApplicationData** : Données d'utilisation de l'application mobile
3. **DataRefreshLog** : Historique des actualisations de données

## 🆓 Alternatives gratuites à Vercel

Si vous souhaitez explorer d'autres options gratuites :

### 1. **Netlify**
- Déploiement similaire à Vercel
- 100 GB de bande passante/mois
- Site : [netlify.com](https://netlify.com)

### 2. **Render**
- Hébergement gratuit avec base de données PostgreSQL incluse
- Idéal pour Next.js
- Site : [render.com](https://render.com)

### 3. **Railway**
- 500 heures gratuites/mois
- PostgreSQL inclus
- Site : [railway.app](https://railway.app)

### 4. **Fly.io**
- Conteneurs gratuits
- PostgreSQL intégré
- Site : [fly.io](https://fly.io)

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ne jamais committer le fichier `.env` dans Git !

Actuellement, votre fichier `.env` est dans le repository. Pour corriger cela :

```bash
# Retirer .env du tracking Git
git rm --cached .env

# Vérifier que .env est dans .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Commit
git add .gitignore
git commit -m "Sécurité: Retirer .env du repository"
git push
```

Ensuite, changez vos mots de passe de base de données !

## 📞 Support

Pour toute question :
- Issues GitHub : [github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME/issues](https://github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME/issues)
- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)

## 📝 Checklist de déploiement

- [ ] Compte Vercel créé
- [ ] Repository GitHub connecté à Vercel
- [ ] Variables d'environnement configurées
- [ ] Première build réussie
- [ ] Migrations de base de données exécutées
- [ ] Application accessible via URL Vercel
- [ ] Données de test ajoutées
- [ ] Navigation testée
- [ ] Graphiques fonctionnels
- [ ] .env retiré du repository (sécurité)

Bonne chance avec votre déploiement ! 🚀
