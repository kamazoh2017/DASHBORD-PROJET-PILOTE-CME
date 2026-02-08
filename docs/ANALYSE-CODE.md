# 📊 Analyse du code source - Dashboard CME

## Vue d'ensemble

Ce projet est une application web de tableau de bord développée avec Next.js pour suivre en temps réel la phase pilote du projet de digitalisation du Carnet Mère-Enfant (CME) en Côte d'Ivoire.

## Architecture technique

### Frontend (Next.js 14 - App Router)

L'application utilise la nouvelle architecture App Router de Next.js 14, offrant :
- Server Components par défaut pour de meilleures performances
- Rendu côté serveur (SSR) pour le SEO et le chargement initial
- Routes API intégrées dans `/app/api`

### Structure des pages

```
app/
├── page.tsx                 # Page d'accueil (vue d'ensemble générale)
├── home-client.tsx         # Composant client pour l'interactivité
├── supervision/            # Section supervision des formations
│   ├── page.tsx           # Données de supervision
│   └── supervision-client.tsx
├── application/           # Section utilisation application mobile
│   ├── page.tsx
│   └── application-client.tsx
├── comparaison/          # Comparaison supervision vs application
│   ├── page.tsx
│   └── comparaison-client.tsx
└── api/                  # API routes pour les données
    ├── supervision/route.ts
    ├── application/route.ts
    ├── comparison/route.ts
    ├── home/route.ts
    └── refresh-data/route.ts
```

### Base de données (PostgreSQL + Prisma)

**Modèle de données** (prisma/schema.prisma) :

1. **SupervisionData** - Données collectées lors des supervisions sur le terrain
   - Date de collecte
   - Établissement concerné
   - Nombre de sages-femmes formées et présentes
   - Nombre de femmes enceintes : reçues, enregistrées, connectées
   - Contraintes : unicité par date/établissement

2. **ApplicationData** - Données d'utilisation de l'application mobile
   - Même structure que SupervisionData
   - Permet la comparaison entre supervision terrain et données app

3. **DataRefreshLog** - Journal des actualisations
   - Source des données
   - Date de rafraîchissement
   - Nombre d'enregistrements
   - Statut (succès/échec)

### Logique métier

**Constantes du projet** (lib/constants.ts) :

```typescript
// Période du projet : 3 semaines
PROJECT_START_DATE = 2026-02-03
PROJECT_END_DATE = 2026-02-27

// Objectifs
DAILY_OBJECTIVE = 22 femmes enceintes/jour
FINAL_TARGET = 400 femmes enceintes au total

// Établissements (5 sites pilotes)
- CHU COCODY (12 sages-femmes formées)
- CHR ABOBO (10 sages-femmes)
- HG YOPOUGON-ATTIE (8 sages-femmes)
- HG BINGERVILLE (8 sages-femmes)
- FSU WILLIAMSVILLE (6 sages-femmes)
```

**Fonctions clés** :

1. `countWorkingDays()` - Calcule les jours ouvrables (excluant weekends)
2. `getEffectiveDisplayDate()` - Détermine la date d'affichage :
   - Avant 16h : affiche J-1 (données pas encore complètes)
   - Après 16h : affiche J
   - Gère les weekends automatiquement
3. `isDayDataAvailable()` - Vérifie si les données du jour sont disponibles (après 14h)

### Calculs et indicateurs

**Page d'accueil** (app/page.tsx) :

Agrège les données pour calculer :
- Total femmes enceintes enregistrées (toutes sources)
- Total femmes enceintes connectées à l'app
- Total femmes enceintes reçues en consultation
- Objectif cumulé = jours ouvrables × objectif quotidien (22)
- Taux d'atteinte = (total enregistrées / objectif cumulé) × 100

**Données par établissement** :
- Totalise les données de chaque établissement
- Permet de voir la performance individuelle
- Compare entre sites

**Évolution temporelle** :
- Données quotidiennes pour graphiques
- Progression cumulée
- Tendances sur la période

### API Routes

**GET /api/supervision** - Données de supervision terrain
- Filtre par date et établissement
- Calcule les moyennes et totaux
- Retourne JSON pour les graphiques

**GET /api/application** - Données application mobile
- Même structure que supervision
- Permet comparaison terrain vs digital

**GET /api/comparison** - Comparaison des deux sources
- Analyse les écarts
- Identifie les incohérences
- Calcule les taux de concordance

**POST /api/refresh-data** - Actualisation des données
- Se connecte aux Google Sheets (IDs dans constants.ts)
- Importe les nouvelles données
- Met à jour la base de données
- Log l'opération dans DataRefreshLog

### Bibliothèques de visualisation

**Chart.js** (react-chartjs-2) :
- Graphiques en barres et lignes
- Évolution temporelle
- Comparaisons inter-établissements

**Recharts** :
- Graphiques composés
- Aires empilées
- Courbes de tendance

**Plotly.js** (react-plotly.js) :
- Graphiques interactifs
- Zoom et exploration des données
- Export des graphiques

### UI/UX

**Tailwind CSS** + **Radix UI** + **Shadcn/ui** :
- Design system cohérent
- Composants accessibles (ARIA)
- Thème adaptable (clair/sombre avec next-themes)
- Responsive design mobile-first

**Composants principaux** :
- Cards pour afficher les KPIs
- Tables de données
- Charts interactifs
- Filtres par date et établissement
- Bouton de rafraîchissement des données

### Gestion d'état

**Zustand** : State management léger
- Gestion des filtres
- État de chargement
- Préférences utilisateur

**SWR** / **TanStack Query** : Data fetching
- Cache intelligent
- Revalidation automatique
- États de chargement/erreur

### Optimisations

1. **Server Components** : Rendu initial côté serveur
2. **Force Dynamic** : `export const dynamic = 'force-dynamic'` pour données temps réel
3. **Images unoptimized** : Pour déploiement statique si nécessaire
4. **Indexes de base de données** : Sur date et établissement pour requêtes rapides
5. **Unique constraints** : Évite les doublons de données

### Sécurité

- Variables d'environnement pour secrets (DATABASE_URL, API keys)
- Validation des entrées (Yup, Zod)
- Protection CSRF via Next.js
- Connexion DB avec SSL (connect_timeout=15)

## Flux de données

```
Google Sheets (données terrain)
        ↓
API /refresh-data
        ↓
PostgreSQL (via Prisma)
        ↓
API routes (/supervision, /application, etc.)
        ↓
Server Components (fetch data)
        ↓
Client Components (interactivité)
        ↓
Charts et visualisations
```

## Points d'extension

1. **Authentification** : NextAuth.js configuré, adaptateur Prisma prêt
2. **Notifications** : react-hot-toast pour alertes
3. **Export** : Route /api/export-pdf pour rapports
4. **Temps réel** : Peut ajouter WebSockets pour updates live
5. **Mobile** : PWA-ready avec Next.js

## Environnement de production

**Variables requises** :
- `DATABASE_URL` : Connexion PostgreSQL
- `ABACUSAI_API_KEY` : Pour services IA (optionnel)
- `NEXTAUTH_*` : Pour authentification (optionnel)

**Build** :
```bash
yarn build  # Génère .next/ avec pages optimisées
yarn start  # Lance serveur production
```

**Déploiement recommandé** : Vercel
- Auto-scaling
- CDN global
- Edge functions
- Zero-config pour Next.js

## Métriques de performance

- **Lighthouse Score** : Viser 90+ sur tous les axes
- **Core Web Vitals** :
  - LCP < 2.5s (largest contentful paint)
  - FID < 100ms (first input delay)
  - CLS < 0.1 (cumulative layout shift)

## Conclusion

Application moderne, performante et maintenable utilisant les meilleures pratiques Next.js 14. Architecture scalable prête pour évolution vers un système plus large de suivi de santé maternelle.
