# 🚀 Guide de Développement Local

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js 18+** ([télécharger](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** ([télécharger](https://git-scm.com/))
- **PostgreSQL** ([télécharger](https://www.postgresql.org/download/)) OU accès à une base PostgreSQL cloud

## Installation Rapide (5 minutes)

### 1. Cloner le Repository

```bash
git clone https://github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME.git
cd DASHBORD-PROJET-PILOTE-CME
```

### 2. Installer les Dépendances

```bash
# Avec npm
npm install

# OU avec yarn
yarn install
```

### 3. Configurer les Variables d'Environnement

```bash
# Copier le template
cp .env.example .env

# Éditer .env avec vos vraies valeurs
```

**Contenu de `.env` :**
```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# API Key (optionnel)
ABACUSAI_API_KEY="your-api-key"

# NextAuth (optionnel pour l'authentification)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### 4. Initialiser la Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push

# (Optionnel) Remplir avec des données de test
npx prisma db seed
```

### 5. Lancer le Serveur de Développement

```bash
npm run dev
# OU
yarn dev
```

🎉 **Votre application est maintenant accessible sur http://localhost:3000**

## Scripts Disponibles

```bash
# Développement
npm run dev              # Lance le serveur de développement (port 3000)

# Build
npm run build            # Compile l'application pour production
npm run start            # Lance l'application en mode production

# Base de données
npx prisma studio        # Interface visuelle pour la base de données
npx prisma generate      # Régénérer le client Prisma
npx prisma db push       # Synchroniser le schéma avec la DB
npx prisma db seed       # Remplir la DB avec des données de test

# Qualité du code
npm run lint             # Vérifier le code avec ESLint
npm run type-check       # Vérifier les types TypeScript (à ajouter)
npm test                 # Lancer les tests (à ajouter)
```

## Structure du Projet

```
DASHBORD-PROJET-PILOTE-CME/
├── app/                      # Pages et routes (Next.js App Router)
│   ├── api/                  # API Routes
│   ├── supervision/          # Page Supervision
│   ├── application/          # Page Application
│   ├── comparaison/          # Page Comparaison
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil
├── components/               # Composants React réutilisables
│   ├── ui/                   # Composants UI (shadcn)
│   ├── sidebar.tsx           # Barre latérale
│   └── language-switcher.tsx # Sélecteur de langue
├── lib/                      # Utilitaires et configurations
│   ├── db.ts                 # Client Prisma
│   ├── constants.ts          # Constantes du projet
│   └── utils.ts              # Fonctions utilitaires
├── messages/                 # Fichiers de traduction i18n
│   ├── ja.json              # Japonais (défaut)
│   ├── en.json              # Anglais
│   └── fr.json              # Français
├── prisma/                   # Configuration Prisma
│   └── schema.prisma         # Schéma de base de données
├── public/                   # Fichiers statiques
├── .env                      # Variables d'environnement (ne pas committer!)
├── .env.example              # Template des variables
├── next.config.js            # Configuration Next.js
├── package.json              # Dépendances npm
└── tailwind.config.ts        # Configuration Tailwind CSS
```

## Développement

### Ajouter une Nouvelle Page

```bash
# Créer le dossier et le fichier
mkdir app/ma-page
touch app/ma-page/page.tsx
```

```tsx
// app/ma-page/page.tsx
export default function MaPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Ma Nouvelle Page</h1>
    </div>
  );
}
```

→ Accessible sur http://localhost:3000/ma-page

### Ajouter une API Route

```tsx
// app/api/mon-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello API!' });
}
```

→ Accessible sur http://localhost:3000/api/mon-endpoint

### Modifier le Schéma de Base de Données

```prisma
// prisma/schema.prisma
model NouveauModele {
  id        String   @id @default(cuid())
  nom       String
  createdAt DateTime @default(now())
}
```

```bash
# Appliquer les changements
npx prisma db push

# Régénérer le client
npx prisma generate
```

### Utiliser la Base de Données

```tsx
import { prisma } from '@/lib/db';

// Dans un Server Component ou API Route
const data = await prisma.supervisionData.findMany();
```

## Debugging

### Logs de Développement

Les logs apparaissent dans le terminal où vous avez lancé `npm run dev`.

### Prisma Studio

Interface visuelle pour explorer et modifier la base de données :

```bash
npx prisma studio
```

→ Ouvre http://localhost:5555

### Next.js DevTools

Le serveur de développement inclut :
- **Hot Reload** : Les changements sont appliqués instantanément
- **Error Overlay** : Les erreurs s'affichent dans le navigateur
- **Fast Refresh** : Préserve l'état des composants React

### Inspecteur de Base de Données

```bash
# Se connecter à PostgreSQL
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Lister les tables
\dt

# Voir le contenu d'une table
SELECT * FROM "SupervisionData" LIMIT 10;
```

## Tester les Fonctionnalités

### 1. Tester l'Internationalisation

- Ouvrir http://localhost:3000
- Cliquer sur le sélecteur de langue dans la sidebar
- Changer entre Japonais (🇯🇵), Anglais (🇬🇧), Français (🇫🇷)
- Vérifier que tous les textes changent

### 2. Tester les Graphiques

- Naviguer vers chaque page (Accueil, Supervision, Application, Comparaison)
- Vérifier que les graphiques s'affichent correctement
- Tester les interactions (hover, click)

### 3. Tester les Filtres de Date

- Utiliser les filtres de période
- Vérifier que les données se mettent à jour

### 4. Tester l'Actualisation des Données

- Cliquer sur "Actualiser les données" dans la sidebar
- Vérifier que les nouvelles données sont chargées

## Problèmes Courants

### Erreur : "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Erreur : "Database connection failed"

Vérifiez votre `DATABASE_URL` dans `.env` :
- Format correct : `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- Base de données accessible
- Credentials corrects

### Erreur : "Port 3000 already in use"

```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

OU tuer le processus sur le port 3000 :

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Hot Reload ne fonctionne pas

1. Redémarrer le serveur de développement
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier que les fichiers ne sont pas dans `.gitignore`

### Erreur TypeScript

```bash
# Vérifier les types
npx tsc --noEmit

# Installer les types manquants
npm install --save-dev @types/nom-du-package
```

## Base de Données de Test

### Option 1 : PostgreSQL Local

```bash
# Installer PostgreSQL
# Créer une base de données
createdb dashboard_cme_dev

# Dans .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dashboard_cme_dev"
```

### Option 2 : PostgreSQL Cloud Gratuit

**Supabase** (500 MB gratuit) :
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier la connexion string dans `.env`

**Neon** (0.5 GB gratuit) :
1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer une base de données
3. Copier la connexion string dans `.env`

### Données de Test

Créer un fichier `scripts/seed.ts` pour générer des données :

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer des données de test
  await prisma.supervisionData.create({
    data: {
      date: new Date('2026-02-03'),
      etablissement: 'CHU COCODY',
      sageFemmesFormees: 12,
      sageFemmesPresentes: 10,
      femmesEnceintesRecues: 25,
      femmesEnceintesEnregistrees: 20,
      femmesEnceintesConnectees: 18,
    },
  });
  
  console.log('Données de test créées !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
npx tsx scripts/seed.ts
```

## Performance en Développement

### Temps de Build

- **Premier build** : ~30-60 secondes
- **Builds suivants** : ~5-15 secondes (avec cache)
- **Hot reload** : < 1 seconde

### Optimiser la Vitesse

1. **Utiliser le cache Next.js** :
   ```bash
   # Ne pas supprimer .next/ entre les builds
   ```

2. **SWC plutôt que Babel** (déjà configuré)

3. **Désactiver la télémétrie** :
   ```bash
   npx next telemetry disable
   ```

## Workflow de Développement Recommandé

1. **Créer une branche** :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développer et tester** :
   - Faire des commits réguliers
   - Tester localement

3. **Lint et type-check** :
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

4. **Pousser et créer une PR** :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

## Ressources Utiles

### Documentation Officielle

- **Next.js** : https://nextjs.org/docs
- **React** : https://react.dev
- **Prisma** : https://www.prisma.io/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **TypeScript** : https://www.typescriptlang.org/docs
- **next-intl** : https://next-intl-docs.vercel.app

### Outils de Développement

- **VS Code** avec extensions :
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma
- **Chrome DevTools** : Inspecteur React
- **Postman** : Tester les API routes

### Communauté

- **Next.js Discord** : https://nextjs.org/discord
- **Stack Overflow** : Tag `next.js`
- **GitHub Issues** : Pour reporter des bugs

## Prochaines Étapes

Une fois l'application fonctionnelle localement :

1. ✅ Tests en local
2. 📦 Build pour production : `npm run build`
3. 🚀 Déploiement sur Vercel (voir DEPLOIEMENT.md)
4. 🧪 Mettre en place les tests automatisés
5. 🔄 Configurer le CI/CD

Voir les autres guides :
- [DEPLOIEMENT.md](DEPLOIEMENT.md) - Déploiement production
- [I18N-GUIDE.md](I18N-GUIDE.md) - Internationalisation
- [SECURITE.md](SECURITE.md) - Bonnes pratiques sécurité

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub !
