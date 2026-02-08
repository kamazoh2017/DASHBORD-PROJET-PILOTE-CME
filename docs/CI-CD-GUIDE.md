# 🚀 Guide CI/CD et Déploiement Multi-Environnements

## Vue d'ensemble

Ce guide explique comment configurer et utiliser le pipeline CI/CD pour déployer l'application Dashboard CME sur plusieurs environnements Vercel.

## Architecture des Environnements

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                                                              │
│  Feature Branch ──► PR ──► Preprod (Preview)                │
│                                                              │
│  Main Branch ────► Push ──► Production                       │
└─────────────────────────────────────────────────────────────┘
```

### Environnements

1. **Local Development** (`http://localhost:3000`)
   - Pour le développement et les tests locaux
   - Base de données locale ou cloud de dev

2. **Preprod/Staging** (`https://dashbord-cme-preprod.vercel.app`)
   - Déployé automatiquement pour chaque Pull Request
   - Base de données dédiée preprod
   - Tests automatiques avant merge

3. **Production** (`https://dashbord-cme.vercel.app`)
   - Déployé automatiquement sur merge vers `main`
   - Base de données production
   - URL stable pour les utilisateurs finaux

## Configuration Initiale

### 1. Configuration Vercel

#### Créer un compte et un projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. **Import** le repository `DASHBORD-PROJET-PILOTE-CME`
4. Configurer le projet :
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next`

#### Obtenir les tokens et IDs

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Obtenir les informations du projet
vercel project ls
```

Vous aurez besoin de :
- `VERCEL_TOKEN` : Token personnel (Settings → Tokens)
- `VERCEL_ORG_ID` : ID de l'organisation
- `VERCEL_PROJECT_ID` : ID du projet

### 2. Configuration GitHub Secrets

Aller dans votre repository GitHub → **Settings** → **Secrets and variables** → **Actions**

Ajouter les secrets suivants :

#### Secrets Vercel
```
VERCEL_TOKEN=<votre-token-vercel>
VERCEL_ORG_ID=<votre-org-id>
VERCEL_PROJECT_ID=<votre-project-id>
```

#### Secrets Base de Données
```
# Preprod
DATABASE_URL_PREPROD=postgresql://user:pass@host:5432/db_preprod

# Production
DATABASE_URL_PROD=postgresql://user:pass@host:5432/db_prod
```

#### Autres secrets
```
ABACUSAI_API_KEY=<votre-api-key>
NEXTAUTH_SECRET=<generate-with-openssl>
```

#### Secrets optionnels
```
SLACK_WEBHOOK=<webhook-url>     # Pour notifications Slack
SNYK_TOKEN=<snyk-token>          # Pour scan de sécurité
```

### 3. Configuration des Bases de Données

#### Option 1 : Supabase (Recommandé pour Preprod/Prod)

```bash
# Preprod
1. Créer un projet Supabase "dashboard-cme-preprod"
2. Copier la connexion string
3. L'ajouter comme SECRET GitHub : DATABASE_URL_PREPROD

# Production
1. Créer un projet Supabase "dashboard-cme-prod"
2. Copier la connexion string
3. L'ajouter comme SECRET GitHub : DATABASE_URL_PROD
```

#### Option 2 : Neon.tech

1. Créer deux projets : preprod et prod
2. Copier les connexion strings
3. Les ajouter comme secrets GitHub

#### Initialiser les bases de données

```bash
# Se connecter à chaque base et exécuter :
npx prisma db push --schema=./prisma/schema.prisma
```

## Utilisation du Pipeline CI/CD

### Workflow Automatique

Le pipeline s'exécute automatiquement sur :

1. **Push** sur n'importe quelle branche
   - Lint & Type Check
   - Unit Tests
   - Build Test

2. **Pull Request** vers `main` ou `develop`
   - Tous les tests ci-dessus
   - E2E Tests
   - Security Scan
   - **Déploiement automatique vers Preprod**

3. **Merge** vers `main`
   - Tous les tests
   - **Déploiement automatique vers Production**

### Étapes du Pipeline

```yaml
┌──────────────────┐
│  Lint & TypeCheck│  ◄── Vérification du code
└────────┬─────────┘
         │
┌────────▼─────────┐
│   Unit Tests     │  ◄── Tests unitaires avec coverage
└────────┬─────────┘
         │
┌────────▼─────────┐
│      Build       │  ◄── Compilation Next.js
└────────┬─────────┘
         │
┌────────▼─────────┐
│   E2E Tests      │  ◄── Tests end-to-end (Playwright)
└────────┬─────────┘
         │
┌────────▼─────────┐
│ Security Scan    │  ◄── npm audit + Snyk
└────────┬─────────┘
         │
         ├─── PR ──► Deploy Preprod
         │
         └─── Main ──► Deploy Production
```

## Workflow de Développement

### Scénario 1 : Nouvelle Fonctionnalité

```bash
# 1. Créer une branche depuis main
git checkout main
git pull origin main
git checkout -b feature/ma-fonctionnalite

# 2. Développer et tester localement
npm run dev
# ... développement ...
npm run test
npm run lint

# 3. Committer et pousser
git add .
git commit -m "feat: ma nouvelle fonctionnalité"
git push origin feature/ma-fonctionnalite

# 4. Créer une Pull Request sur GitHub
# → Le pipeline CI/CD démarre automatiquement
# → Deploy vers Preprod si les tests passent

# 5. Review de code et tests sur Preprod
# URL de preview sera commentée automatiquement dans la PR

# 6. Merger la PR
# → Deploy automatique vers Production
```

### Scénario 2 : Hotfix en Production

```bash
# 1. Créer une branche hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/bug-critique

# 2. Fixer le bug
# ... corrections ...

# 3. Tester localement
npm run test
npm run build

# 4. Push et PR vers main
git push origin hotfix/bug-critique
# Créer PR → Tests → Preprod → Review → Merge → Production
```

## Commandes Manuelles

### Déployer manuellement vers Preprod

```bash
# Avec Vercel CLI
vercel --env DATABASE_URL="$DATABASE_URL_PREPROD"

# Ou via GitHub Actions (dispatch manuel)
# Aller dans Actions → CI/CD Pipeline → Run workflow
```

### Déployer manuellement vers Production

```bash
# Avec Vercel CLI
vercel --prod --env DATABASE_URL="$DATABASE_URL_PROD"
```

### Rollback en cas de problème

```bash
# Via Vercel Dashboard
1. Aller sur vercel.com/dashboard
2. Sélectionner le projet
3. Onglet "Deployments"
4. Trouver le dernier déploiement stable
5. Cliquer "..." → "Promote to Production"

# Via Vercel CLI
vercel rollback
```

## Monitoring et Logs

### Logs de Déploiement

```bash
# Via Vercel CLI
vercel logs [deployment-url]

# Via GitHub Actions
# Repository → Actions → Sélectionner un workflow → Voir les logs
```

### Vercel Dashboard

1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionner le projet
3. Voir :
   - **Deployments** : Historique des déploiements
   - **Analytics** : Trafic et performance
   - **Logs** : Logs en temps réel

### Surveillance de la Production

**Health Check** :
```bash
# Vérifier que le site répond
curl https://dashbord-cme.vercel.app/api/health

# Ou configurer un monitoring (UptimeRobot, etc.)
```

## Tests

### Lancer les tests localement

```bash
# Unit tests
npm test

# Unit tests avec coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests en mode UI
npm run test:e2e:ui

# Type checking
npm run type-check

# Lint
npm run lint
```

### Tests dans le Pipeline

Tous les tests sont exécutés automatiquement dans le pipeline CI/CD :

- ✅ ESLint
- ✅ TypeScript type check
- ✅ Jest (unit tests)
- ✅ Playwright (E2E tests)
- ✅ npm audit (security)
- ✅ Build test

## Variables d'Environnement par Environnement

### Local (.env.local)
```env
DATABASE_URL=postgresql://localhost:5432/dev
NEXTAUTH_URL=http://localhost:3000
```

### Preprod (Vercel Environment Variables)
```env
DATABASE_URL=<supabase-preprod-url>
NEXTAUTH_URL=https://dashbord-cme-preprod.vercel.app
NODE_ENV=production
```

### Production (Vercel Environment Variables)
```env
DATABASE_URL=<supabase-prod-url>
NEXTAUTH_URL=https://dashbord-cme.vercel.app
NODE_ENV=production
```

## Troubleshooting

### Build échoue dans CI/CD

1. **Vérifier les logs** dans GitHub Actions
2. **Reproduire localement** :
   ```bash
   npm run build
   ```
3. **Vérifier les variables d'environnement**
4. **Vérifier le schéma Prisma**

### Tests E2E échouent

1. **Lancer localement** :
   ```bash
   npm run test:e2e
   ```
2. **Voir le rapport** :
   ```bash
   npx playwright show-report
   ```
3. **Debug mode** :
   ```bash
   npx playwright test --debug
   ```

### Déploiement Vercel échoue

1. **Vérifier les secrets GitHub**
2. **Vérifier le token Vercel**
3. **Vérifier la configuration dans vercel.json**
4. **Logs dans Vercel Dashboard**

### Database connection failed

1. **Vérifier DATABASE_URL**
2. **Tester la connexion** :
   ```bash
   npx prisma db pull
   ```
3. **Vérifier les règles de firewall**
4. **Vérifier que la base existe**

## Bonnes Pratiques

### 1. Toujours tester localement avant de push

```bash
npm run lint
npm run type-check
npm test
npm run build
```

### 2. Créer des Pull Requests descriptives

- Titre clair
- Description de la fonctionnalité
- Screenshots si UI changes
- Checklist des tests

### 3. Reviewer les déploiements Preprod

- Tester toutes les fonctionnalités modifiées
- Vérifier les données
- Tester l'i18n (3 langues)
- Vérifier la responsive

### 4. Monitoring post-déploiement

- Vérifier les logs Vercel
- Vérifier le site en production
- Vérifier les analytics

### 5. Sauvegardes régulières

```bash
# Backup de la base de données
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

## Sécurité

### Secrets

- ❌ Ne JAMAIS committer de secrets dans le code
- ✅ Utiliser GitHub Secrets
- ✅ Utiliser Vercel Environment Variables
- ✅ Rotation régulière des tokens

### Audits

Le pipeline exécute automatiquement :
- `npm audit` (vulnérabilités npm)
- Snyk scan (si configuré)

### HTTPS

- ✅ Automatique sur Vercel
- ✅ Certificats SSL gérés par Vercel

## Coûts

### Vercel (Hobby Plan - Gratuit)

- ✅ Déploiements illimités
- ✅ 100 GB de bande passante/mois
- ✅ SSL automatique
- ✅ Edge network global

### GitHub Actions

- ✅ 2000 minutes/mois (gratuit)
- Suffit largement pour ce projet

### Bases de Données

- **Supabase Free** : 500 MB
- **Neon Free** : 0.5 GB
- Suffisant pour preprod et prod

## Support

### Ressources

- **Vercel Docs** : https://vercel.com/docs
- **GitHub Actions** : https://docs.github.com/actions
- **Playwright** : https://playwright.dev
- **Jest** : https://jestjs.io

### Aide

- Ouvrir une issue sur GitHub
- Consulter les logs dans Actions/Vercel
- Communauté Next.js Discord

---

**Prochaines étapes** : Voir [TUTORIEL-COMPLET.md](./tutoriel/README.md) pour apprendre en profondeur toutes les technologies utilisées.
