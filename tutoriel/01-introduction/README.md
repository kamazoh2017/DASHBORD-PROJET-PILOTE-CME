# Module 1 : Introduction au Développement Web Moderne

## 🎯 Objectifs du Module

À la fin de ce module, vous serez capable de :

- ✅ Comprendre l'écosystème du développement web moderne
- ✅ Installer et configurer votre environnement de développement
- ✅ Comprendre l'architecture du Dashboard CME
- ✅ Connaître les fondamentaux de chaque technologie utilisée

**Durée** : 2 heures

## 📚 Table des Matières

1. [Vue d'ensemble du Stack](#vue-densemble-du-stack)
2. [Installation de l'environnement](#installation-de-lenvironnement)
3. [Architecture du projet](#architecture-du-projet)
4. [Premier contact avec le code](#premier-contact-avec-le-code)

---

## Vue d'ensemble du Stack

### Qu'est-ce qu'un "stack" technologique ?

Un **stack** (pile) est l'ensemble des technologies utilisées pour construire une application. Notre stack s'appelle **"T3 Stack moderne"** :

```
┌─────────────────────────────────────┐
│         Frontend (Client)           │
│  Next.js + React + TypeScript       │
│  Tailwind CSS + Shadcn/ui           │
└──────────────┬──────────────────────┘
               │ API Routes
┌──────────────▼──────────────────────┐
│         Backend (Serveur)           │
│  Next.js API Routes                 │
│  Prisma ORM                         │
└──────────────┬──────────────────────┘
               │ SQL Queries
┌──────────────▼──────────────────────┐
│      Base de Données                │
│         PostgreSQL                  │
└─────────────────────────────────────┘
```

### Technologies Principales

#### 1. **Next.js 14** - Le Framework Full-Stack

**C'est quoi ?**
- Framework React pour créer des applications web
- Permet de faire à la fois le frontend ET le backend
- Créé par Vercel en 2016

**Pourquoi on l'utilise ?**
- ✅ Très rapide (Server Components)
- ✅ SEO optimisé (Server-Side Rendering)
- ✅ Routing automatique
- ✅ API Routes intégrées
- ✅ Déploiement facile

**Alternatives :**
- Remix (plus récent, axé sur les standards web)
- SvelteKit (plus léger, langage différent)
- Nuxt (équivalent pour Vue.js)

**Parts de marché (2026) :**
- Next.js : 65%
- Remix : 15%
- SvelteKit : 10%
- Autres : 10%

#### 2. **TypeScript** - JavaScript Typé

**C'est quoi ?**
- Sur-ensemble de JavaScript avec typage statique
- Créé par Microsoft en 2012
- Compile vers JavaScript

**Exemple :**
```typescript
// JavaScript (pas sûr)
function add(a, b) {
  return a + b
}
add(1, "2") // ❌ Erreur à l'exécution

// TypeScript (sûr)
function add(a: number, b: number): number {
  return a + b
}
add(1, "2") // ✅ Erreur détectée avant l'exécution
```

**Pourquoi on l'utilise ?**
- ✅ Détecte les erreurs avant l'exécution
- ✅ Autocomplétion intelligente
- ✅ Refactoring sûr
- ✅ Documentation automatique

**Adoption :**
- 95% des nouveaux projets utilisent TypeScript
- Standard de l'industrie depuis 2020

#### 3. **Prisma** - ORM Moderne

**C'est quoi ?**
- Object-Relational Mapping (ORM)
- Permet de parler à la base de données en JavaScript/TypeScript
- Créé en 2019

**Exemple :**
```typescript
// Sans Prisma (SQL brut)
const result = await db.query(
  "SELECT * FROM users WHERE email = $1", 
  [email]
)

// Avec Prisma (type-safe)
const user = await prisma.user.findUnique({
  where: { email }
})
```

**Pourquoi on l'utilise ?**
- ✅ Type-safe (erreurs détectées avant exécution)
- ✅ Migrations automatiques
- ✅ Requêtes optimisées
- ✅ Studio visuel pour explorer la DB

**Alternatives :**
- Drizzle (plus récent, plus léger)
- TypeORM (plus ancien, plus complexe)
- Sequelize (très ancien, moins type-safe)

#### 4. **PostgreSQL** - Base de Données

**C'est quoi ?**
- Base de données relationnelle (SQL)
- Open source depuis 1996
- La plus avancée techniquement

**Pourquoi on l'utilise ?**
- ✅ Très fiable (ACID compliant)
- ✅ Performante
- ✅ Gratuite et open source
- ✅ Supportée partout

**Alternatives :**
- MySQL (plus simple, moins de features)
- MongoDB (NoSQL, pour données non structurées)
- SQLite (très léger, pour petites apps)

#### 5. **Tailwind CSS** - Framework CSS

**C'est quoi ?**
- Framework CSS utility-first
- Créé en 2017
- Classes atomiques

**Exemple :**
```html
<!-- Ancien CSS -->
<style>
.button {
  background-color: blue;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
<button class="button">Click</button>

<!-- Tailwind CSS -->
<button class="bg-blue-500 px-5 py-2 rounded">
  Click
</button>
```

**Pourquoi on l'utilise ?**
- ✅ Très rapide à écrire
- ✅ Pas de conflits CSS
- ✅ Responsive facile
- ✅ Optimisé automatiquement

**Alternatives :**
- Bootstrap (plus ancien, composants pré-faits)
- Material UI (Material Design de Google)
- Chakra UI (composants React stylés)

#### 6. **next-intl** - Internationalisation

**C'est quoi ?**
- Bibliothèque pour gérer plusieurs langues
- Spécialisée pour Next.js

**Pourquoi on l'utilise ?**
- ✅ Supporte Server Components
- ✅ Type-safe
- ✅ Performant (pas de JS côté client)

#### 7. **Vercel** - Plateforme de Déploiement

**C'est quoi ?**
- Plateforme cloud pour déployer Next.js
- Créée par les créateurs de Next.js
- CDN global automatique

**Pourquoi on l'utilise ?**
- ✅ Déploiement en 1 clic
- ✅ HTTPS automatique
- ✅ Gratuit pour petits projets
- ✅ Preview deployments sur PR

**Alternatives :**
- Netlify (similaire, pour tous frameworks)
- Railway (avec base de données incluse)
- AWS (plus complexe, plus flexible)

---

## Installation de l'environnement

### Étape 1 : Node.js

**Installer Node.js 18 ou supérieur**

👉 [https://nodejs.org/](https://nodejs.org/)

Télécharger la version **LTS** (Long Term Support)

**Vérifier l'installation :**
```bash
node --version  # doit afficher v18.x.x ou plus
npm --version   # doit afficher 9.x.x ou plus
```

### Étape 2 : Git

**Installer Git**

👉 [https://git-scm.com/](https://git-scm.com/)

**Vérifier l'installation :**
```bash
git --version  # doit afficher git version 2.x.x
```

**Configurer Git :**
```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### Étape 3 : VS Code

**Installer Visual Studio Code**

👉 [https://code.visualstudio.com/](https://code.visualstudio.com/)

**Extensions recommandées :**

Ouvrir VS Code → Extensions (Ctrl+Shift+X) → Installer :

1. **ESLint** - Linter JavaScript/TypeScript
2. **Prettier** - Formateur de code
3. **Tailwind CSS IntelliSense** - Autocomplétion Tailwind
4. **Prisma** - Support Prisma
5. **GitLens** - Améliorations Git
6. **Error Lens** - Erreurs en ligne
7. **Auto Rename Tag** - Renommer les balises HTML

### Étape 4 : PostgreSQL (Optionnel)

**Option A : PostgreSQL Local**

👉 [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

**Option B : PostgreSQL Cloud (Recommandé pour débuter)**

- **Supabase** : [https://supabase.com](https://supabase.com) (500 MB gratuit)
- **Neon** : [https://neon.tech](https://neon.tech) (0.5 GB gratuit)

### Étape 5 : Cloner le Projet

```bash
# Cloner le repository
git clone https://github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME.git

# Entrer dans le dossier
cd DASHBORD-PROJET-PILOTE-CME

# Installer les dépendances
npm install

# Copier .env.example vers .env
cp .env.example .env
```

### Étape 6 : Configurer .env

Éditer le fichier `.env` et remplir :

```env
# Base de données
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# API Key (optionnel)
ABACUSAI_API_KEY="votre-clé"
```

### Étape 7 : Initialiser la Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# Explorer la DB visuellement
npx prisma studio
```

### Étape 8 : Lancer le Projet

```bash
npm run dev
```

👉 Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Architecture du Projet

### Structure des Dossiers

```
DASHBORD-PROJET-PILOTE-CME/
│
├── app/                    # Pages et routes (Next.js App Router)
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── supervision/        # Page Supervision
│   ├── application/        # Page Application
│   ├── comparaison/        # Page Comparaison
│   └── api/                # API Routes (Backend)
│
├── components/             # Composants React réutilisables
│   ├── ui/                 # Composants UI (boutons, inputs, etc.)
│   ├── sidebar.tsx         # Barre latérale
│   └── language-switcher.tsx
│
├── lib/                    # Code utilitaire
│   ├── db.ts               # Client Prisma
│   ├── constants.ts        # Constantes
│   └── utils.ts            # Fonctions utilitaires
│
├── messages/               # Traductions (i18n)
│   ├── ja.json             # Japonais
│   ├── en.json             # Anglais
│   └── fr.json             # Français
│
├── prisma/                 # Configuration base de données
│   └── schema.prisma       # Schéma des tables
│
├── public/                 # Fichiers statiques (images, etc.)
│
├── .env                    # Variables d'environnement (SECRET!)
├── .env.example            # Template des variables
├── next.config.js          # Configuration Next.js
├── package.json            # Dépendances npm
└── tailwind.config.ts      # Configuration Tailwind
```

### Flux de Données

```
┌──────────┐
│ Browser  │
└────┬─────┘
     │ 1. Requête HTTP (GET /)
     ▼
┌──────────────────┐
│  Next.js Server  │
│  (app/page.tsx)  │
└────┬─────────────┘
     │ 2. Fetch data from DB
     ▼
┌──────────────────┐
│  Prisma Client   │
│   (lib/db.ts)    │
└────┬─────────────┘
     │ 3. SQL Query
     ▼
┌──────────────────┐
│   PostgreSQL     │
└────┬─────────────┘
     │ 4. Résultats
     ▼
┌──────────────────┐
│  Next.js Server  │
│  (génère HTML)   │
└────┬─────────────┘
     │ 5. HTML + Data
     ▼
┌──────────┐
│ Browser  │  ← Page affichée !
└──────────┘
```

---

## Premier Contact avec le Code

### Exercice 1 : Comprendre une Page Next.js

Ouvrir `app/page.tsx` :

```typescript
// C'est un Server Component (par défaut)
export default async function Page() {
  // On peut fetch des données directement
  const data = await fetch('...')
  
  // Et retourner du JSX (HTML dans JavaScript)
  return (
    <div>
      <h1>Mon Dashboard</h1>
    </div>
  )
}
```

**Questions :**
1. Où se trouve ce code ? (serveur ou client)
2. Quand est-il exécuté ? (build time ou request time)

<details>
<summary>Réponses</summary>

1. Sur le **serveur** (c'est un Server Component)
2. À chaque **requête** (dynamic rendering)
</details>

### Exercice 2 : Modifier une Page

1. Ouvrir `app/page.tsx`
2. Trouver le titre principal (h1)
3. Le modifier
4. Sauvegarder
5. Vérifier le changement dans le navigateur

### Exercice 3 : Explorer Prisma Studio

```bash
npx prisma studio
```

1. Explorer les tables
2. Voir les données
3. Ajouter une entrée manuellement

---

## Checklist du Module

- [ ] Node.js installé et vérifié
- [ ] Git installé et configuré
- [ ] VS Code installé avec extensions
- [ ] PostgreSQL configuré (local ou cloud)
- [ ] Projet cloné et dépendances installées
- [ ] .env configuré
- [ ] Base de données initialisée
- [ ] Application lancée avec succès
- [ ] J'ai compris le stack technologique
- [ ] J'ai compris l'architecture du projet
- [ ] J'ai fait les 3 exercices

---

## Quiz

### Question 1
Quelle est la différence entre Next.js et React ?

<details>
<summary>Réponse</summary>

**React** est une bibliothèque pour créer des interfaces utilisateur.
**Next.js** est un framework basé sur React qui ajoute :
- Routing automatique
- Server-Side Rendering
- API Routes (backend)
- Optimisations automatiques
</details>

### Question 2
Pourquoi utilise-t-on TypeScript plutôt que JavaScript ?

<details>
<summary>Réponse</summary>

TypeScript ajoute le **typage statique** qui permet de :
- Détecter les erreurs avant l'exécution
- Avoir une meilleure autocomplétion
- Documenter le code automatiquement
- Refactorer en toute sécurité
</details>

### Question 3
Qu'est-ce qu'un ORM et pourquoi utiliser Prisma ?

<details>
<summary>Réponse</summary>

Un **ORM** (Object-Relational Mapping) permet de parler à la base de données en utilisant le langage de programmation au lieu de SQL.

**Prisma** est choisi car :
- Type-safe (détecte les erreurs à la compilation)
- Moderne et performant
- Génère des migrations automatiquement
- Studio visuel pour explorer la DB
</details>

---

## Prochaine Étape

✅ Vous avez terminé le Module 1 !

👉 **Module 2 : [Next.js 14](../02-nextjs/README.md)**

Dans le prochain module, vous apprendrez :
- Comment Next.js fonctionne en profondeur
- App Router vs Pages Router
- Server Components vs Client Components
- Routing et Navigation
- API Routes

---

**Temps passé sur ce module** : ⏱️ ____ heures

**Difficultés rencontrées** : 
- [ ] Installation
- [ ] Configuration
- [ ] Compréhension des concepts
- [ ] Aucune

**Notes personnelles** :
_Espace pour vos notes..._
