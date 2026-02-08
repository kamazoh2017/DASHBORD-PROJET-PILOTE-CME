# Tutoriel Dashboard CME - Site Web Interactif 🎓

Site web de formation interactif pour apprendre les technologies du Dashboard CME (Carnet Mère-Enfant).

## 🚀 Lancement Rapide

### Prérequis
- Node.js 18+ installé
- npm ou yarn

### Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le site en développement
npm run dev
```

Ouvrez votre navigateur sur **http://localhost:3001**

## 📚 Contenu du Tutoriel

### 8 Modules - 40 à 60 heures de formation

1. **Module 1 : Introduction** (2h) - ✅ **COMPLET**
   - Vue d'ensemble du stack technologique
   - Histoire et importance de chaque outil
   - Installation de l'environnement
   - Architecture du projet
   - Exercices pratiques
   - Quiz de validation

2. **Module 2 : Next.js 14** (12h) - 🚧 À venir
   - App Router vs Pages Router
   - Server Components vs Client Components
   - Routing et Navigation
   - Data Fetching
   - API Routes

3. **Module 3 : TypeScript** (8h) - 🚧 À venir
   - Types de base
   - Interfaces et Types
   - Génériques
   - Type Guards
   - TypeScript avec React

4. **Module 4 : Prisma + PostgreSQL** (10h) - 🚧 À venir
   - Schéma Prisma
   - Migrations
   - Queries CRUD
   - Relations
   - Prisma Studio

5. **Module 5 : Tailwind CSS** (6h) - 🚧 À venir
   - Utility-first CSS
   - Responsive Design
   - Composants Shadcn/ui
   - Dark mode

6. **Module 6 : Internationalisation** (4h) - 🚧 À venir
   - next-intl setup
   - Messages organization
   - Server vs Client
   - Formatage

7. **Module 7 : Déploiement & CI/CD** (6h) - 🚧 À venir
   - Vercel deployment
   - Multi-environnements
   - GitHub Actions
   - Tests automatisés

8. **Module 8 : Projet Final** (12h) - 🚧 À venir
   - Reproduire le Dashboard CME
   - Étape par étape
   - De zéro à la production

## 🎯 Objectifs Pédagogiques

### À la fin de ce tutoriel, vous serez capable de :

- ✅ Créer une application Next.js 14 complète
- ✅ Utiliser TypeScript pour du code type-safe
- ✅ Gérer une base de données avec Prisma et PostgreSQL
- ✅ Styler avec Tailwind CSS
- ✅ Créer des applications multilingues avec next-intl
- ✅ Déployer en production sur Vercel
- ✅ Mettre en place CI/CD avec GitHub Actions
- ✅ **Reproduire le Dashboard CME de A à Z**

## 💡 Pédagogie

### Règle 80/20
Focus sur les **20% de connaissances essentielles** pour faire **80% des jobs**. Approche pratique et orientée métier.

### Approche Fil Rouge
Le **Dashboard CME** sert de projet fil rouge. Chaque concept est :
1. Expliqué théoriquement
2. Illustré avec des exemples du Dashboard CME
3. Pratiqué avec des exercices
4. Validé par des quiz

### Contenu de chaque module
- 📖 Vue d'ensemble et objectifs
- 📚 Histoire de la technologie
- 🎯 Concepts fondamentaux (règle 80/20)
- 💻 Exercices pratiques
- 🔗 Application au Dashboard CME
- ✅ Quiz de validation
- 📑 Ressources complémentaires

## 🛠️ Technologies Utilisées dans le Tutoriel

### Pour le Site Tutoriel
- **Next.js 14** - Framework React
- **TypeScript** - JavaScript typé
- **Tailwind CSS** - Framework CSS
- **React Syntax Highlighter** - Coloration syntaxique
- **localStorage** - Sauvegarde progression

### Technologies Enseignées
- Next.js 14 (App Router, Server Components)
- TypeScript
- React 18
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- next-intl (i18n)
- Vercel (déploiement)
- GitHub Actions (CI/CD)

## 📁 Structure du Projet

```
tutoriel-site/
├── app/
│   ├── layout.tsx              # Layout global
│   ├── page.tsx                # Page d'accueil
│   ├── globals.css             # Styles globaux
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation + progression
│   │   ├── CodeBlock.tsx       # Blocs de code avec copie
│   │   └── Quiz.tsx            # Quiz interactifs
│   └── modules/
│       ├── 01-introduction/    # Module 1 (complet)
│       ├── 02-nextjs/          # Module 2
│       ├── 03-typescript/      # Module 3
│       ├── 04-prisma/          # Module 4
│       ├── 05-tailwind/        # Module 5
│       ├── 06-i18n/            # Module 6
│       ├── 07-deployment/      # Module 7
│       └── 08-projet-final/    # Module 8
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## ✨ Fonctionnalités

### Navigation Interactive
- Sidebar fixe avec tous les modules
- Indicateur de progression visuel
- Navigation entre modules fluide

### Code Snippets
- Coloration syntaxique
- Bouton "Copier" pour chaque bloc
- Support multi-langages (TypeScript, JavaScript, bash, etc.)

### Quiz Interactifs
- Validation des connaissances
- Explications des réponses
- Sauvegarde automatique de la progression

### Progression Sauvegardée
- LocalStorage pour sauvegarder votre avancement
- Modules complétés marqués avec ✅
- Pourcentage de progression global

## 🎨 Design

- Interface moderne et épurée
- Responsive (mobile, tablette, desktop)
- Couleurs cohérentes avec le Dashboard CME
- Typographie claire (Inter font)
- Sidebar fixe pour navigation facile

## 🚀 Déploiement

### Option 1 : Local (Développement)
```bash
npm run dev
# → http://localhost:3001
```

### Option 2 : Production
```bash
npm run build
npm start
# → http://localhost:3001
```

### Option 3 : Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

## 📦 Scripts Disponibles

- `npm run dev` - Lancer en développement (port 3001)
- `npm run build` - Build pour production
- `npm start` - Lancer en production (port 3001)
- `npm run lint` - Vérifier le code

## 💾 Installation dans un Dossier Spécifique

### Windows
```bash
# Copier le dossier tutoriel-site
xcopy /E /I tutoriel-site "D:\Perso\INFORMATIQUE\DEV\SITES WEB\TUTORIELS\dashboard-cme-tutoriel"

# Aller dans le dossier
cd "D:\Perso\INFORMATIQUE\DEV\SITES WEB\TUTORIELS\dashboard-cme-tutoriel"

# Installer et lancer
npm install
npm run dev
```

### macOS/Linux
```bash
# Copier le dossier tutoriel-site
cp -r tutoriel-site ~/Documents/TUTORIELS/dashboard-cme-tutoriel

# Aller dans le dossier
cd ~/Documents/TUTORIELS/dashboard-cme-tutoriel

# Installer et lancer
npm install
npm run dev
```

## 🎓 Comment Utiliser ce Tutoriel

1. **Démarrez par l'accueil** - Lisez la vue d'ensemble
2. **Suivez l'ordre des modules** - Chaque module s'appuie sur le précédent
3. **Faites les exercices** - La pratique est essentielle
4. **Validez avec les quiz** - Assurez-vous de comprendre avant de continuer
5. **Prenez des notes** - Utilisez un cahier ou éditeur de texte
6. **Pratiquez régulièrement** - 1-2h par jour est idéal
7. **Reproduisez le projet** - Module 8 = créer le Dashboard vous-même

## 📊 Progression Recommandée

### Débutant (aucune expérience)
- 3 mois à raison de 5h/semaine
- Focus sur les fondamentaux
- Ne pas hésiter à revoir les modules

### Intermédiaire (connaissance HTML/CSS/JS)
- 1-2 mois à raison de 10h/semaine
- Peut aller plus vite sur les bases
- Focus sur Next.js et TypeScript

### Avancé (connaissance React)
- 2-4 semaines à raison de 15h/semaine
- Peut survol Module 1-2
- Focus sur Prisma, i18n, déploiement

## 🤝 Contribution

Ce tutoriel est en développement actif. Seul le Module 1 est complet pour l'instant.

**Modules à compléter (par priorité) :**
1. Module 2 : Next.js 14
2. Module 3 : TypeScript
3. Module 4 : Prisma + PostgreSQL
4. Module 5 : Tailwind CSS
5. Module 6 : Internationalisation
6. Module 7 : Déploiement & CI/CD
7. Module 8 : Projet Final

## 📧 Support

Pour toute question :
- Consulter la documentation officielle de chaque technologie
- Ouvrir une issue sur GitHub
- Consulter les guides dans le dossier `/documentation` du projet principal

## 🌟 Projet Fil Rouge

Le **Dashboard CME** (Carnet Mère-Enfant) est un projet réel de digitalisation de la santé maternelle en Côte d'Ivoire. C'est un excellent exemple de projet moderne car il utilise :

- ✅ Stack technologique actuel (2026)
- ✅ Cas d'usage réel et concret
- ✅ Complexité adaptée à l'apprentissage
- ✅ Toutes les fonctionnalités courantes (CRUD, graphiques, i18n, auth potentielle)
- ✅ Déployable en production

## 📖 Ressources Complémentaires

### Documentation Officielle
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### Guides du Projet
- `DEV-LOCAL-GUIDE.md` - Guide développement local
- `CI-CD-GUIDE.md` - Guide CI/CD
- `I18N-GUIDE.md` - Guide internationalisation
- `DEPLOIEMENT.md` - Guide déploiement

## 📝 Licence

Ce tutoriel est fourni à des fins éducatives dans le cadre du projet Dashboard CME.

---

**Bon apprentissage ! 🚀**

Commencez dès maintenant par le Module 1 et devenez autonome dans le développement web moderne.
