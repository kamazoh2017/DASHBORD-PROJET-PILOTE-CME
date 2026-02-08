# ❓ FAQ - Questions Fréquentes

## Déploiement

### Q: Combien coûte l'hébergement sur Vercel ?
**R:** Vercel est **GRATUIT** pour ce projet pendant les 3 semaines (et même au-delà). Le plan gratuit Hobby offre :
- Déploiements illimités
- 100 GB de bande passante/mois
- SSL automatique
- CDN global
- Largement suffisant pour un dashboard interne

### Q: Que se passe-t-il après 3 semaines ?
**R:** Rien ! Votre application continuera à fonctionner gratuitement tant que vous restez dans les limites du plan gratuit. Vercel ne supprime pas les projets automatiquement.

### Q: Puis-je utiliser mon propre nom de domaine ?
**R:** Oui ! Même avec le plan gratuit. Dans Vercel :
1. Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions
Exemple : `dashboard-cme.votredomaine.com`

### Q: Quelle est la différence entre Vercel, Netlify, et Railway ?
**R:**
- **Vercel** : Meilleur pour Next.js (créé par les mêmes équipes), le plus simple
- **Netlify** : Similaire à Vercel, bon pour tous types de sites
- **Railway** : Inclut PostgreSQL gratuit, bon si vous n'avez pas de DB
- **Render** : Alternative avec DB intégrée, plus lent que Vercel

Notre recommandation : **Vercel** pour ce projet car optimisé pour Next.js.

## Base de données

### Q: Ai-je besoin de créer une nouvelle base de données ?
**R:** Non, vous avez déjà une base PostgreSQL configurée dans votre fichier .env. Cependant, pour des raisons de sécurité, vous devriez :
1. Changer le mot de passe (car il était public)
2. Ou créer une nouvelle base de données

### Q: Où puis-je obtenir une base PostgreSQL gratuite ?
**R:** Plusieurs options :
- **Neon** (neon.tech) : PostgreSQL gratuit, 0.5 GB
- **Supabase** (supabase.com) : 500 MB gratuit + interface admin
- **Railway** (railway.app) : PostgreSQL inclus dans le plan gratuit
- **ElephantSQL** (elephantsql.com) : 20 MB gratuit (suffisant pour ce projet)

### Q: Comment migrer vers une nouvelle base de données ?
**R:**
```bash
# 1. Mettez à jour DATABASE_URL dans .env avec la nouvelle connexion
# 2. Créez les tables
npx prisma db push

# 3. (Optionnel) Exportez les données de l'ancienne DB
# Avec psql :
pg_dump "ancienne_database_url" > backup.sql

# 4. (Optionnel) Importez dans la nouvelle DB
psql "nouvelle_database_url" < backup.sql
```

### Q: Mes données sont-elles sauvegardées ?
**R:** Cela dépend de votre fournisseur de base de données. Vérifiez dans les paramètres de votre service. Pour être sûr :
```bash
# Faire un backup manuel régulièrement
npx prisma db pull
```

## Développement

### Q: Comment ajouter un nouvel établissement ?
**R:** Éditez `/lib/constants.ts` :
```typescript
export const ETABLISSEMENTS = [
  'CHU COCODY',
  'CHR ABOBO',
  'HG YOPOUGON-ATTIE',
  'HG BINGERVILLE',
  'FSU WILLIAMSVILLE',
  'VOTRE NOUVEL ETABLISSEMENT'  // Ajoutez ici
];

// Ajoutez aussi le nombre de sages-femmes
export const SAGE_FEMMES_FORMEES: Record<string, number> = {
  // ... existants
  'VOTRE NOUVEL ETABLISSEMENT': 10
};
```

### Q: Comment changer les objectifs (400 femmes, 22/jour) ?
**R:** Dans `/lib/constants.ts` :
```typescript
export const DAILY_OBJECTIVE = 22;     // Changez ici
export const FINAL_TARGET = 400;       // Changez ici
```

### Q: Comment changer les dates du projet ?
**R:** Dans `/lib/constants.ts` :
```typescript
export const PROJECT_START_DATE = new Date('2026-02-03');  // Date début
export const PROJECT_END_DATE = new Date('2026-02-27');    // Date fin
```

### Q: Comment ajouter une nouvelle page ?
**R:**
```bash
# 1. Créer le dossier et fichier
mkdir app/nouvelle-page
touch app/nouvelle-page/page.tsx

# 2. Ajouter le contenu
# app/nouvelle-page/page.tsx
export default function NouvellePage() {
  return <div>Contenu de ma nouvelle page</div>;
}

# 3. Accessible à : /nouvelle-page
```

### Q: Comment personnaliser les couleurs ?
**R:** Éditez `/tailwind.config.ts` :
```typescript
theme: {
  extend: {
    colors: {
      primary: '#votre-couleur',
      secondary: '#votre-couleur',
      // ...
    }
  }
}
```

## Données

### Q: Comment importer des données depuis Excel/CSV ?
**R:**
```bash
# 1. Convertir Excel en CSV
# 2. Créer un script d'import
# scripts/import-csv.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function importCSV() {
  const csvContent = fs.readFileSync('data.csv', 'utf-8');
  const records = parse(csvContent, { columns: true });
  
  for (const record of records) {
    await prisma.supervisionData.create({
      data: {
        date: new Date(record.date),
        etablissement: record.etablissement,
        // ... autres champs
      }
    });
  }
}

importCSV();
```

### Q: Comment actualiser les données automatiquement ?
**R:** L'API route `/api/refresh-data` existe déjà. Pour l'automatiser :

**Option 1 - Cron job Vercel** (plan Pro) :
```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/refresh-data",
    "schedule": "0 14 * * *"  // Tous les jours à 14h
  }]
}
```

**Option 2 - Service externe gratuit** :
Utilisez [cron-job.org](https://cron-job.org) pour appeler votre API toutes les heures.

**Option 3 - GitHub Actions** :
```yaml
# .github/workflows/refresh-data.yml
name: Refresh Data
on:
  schedule:
    - cron: '0 14 * * *'  # 14h tous les jours
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: curl -X POST https://votre-app.vercel.app/api/refresh-data
```

### Q: Comment exporter les données en Excel ?
**R:** L'application peut générer des PDFs (route `/api/export-pdf`). Pour Excel :
```typescript
// Ajoutez une nouvelle route API
// app/api/export-excel/route.ts
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  const data = await prisma.supervisionData.findMany();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
  const buffer = XLSX.write(workbook, { type: 'buffer' });
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="export.xlsx"'
    }
  });
}
```

## Problèmes courants

### Q: Erreur "Database connection failed" lors du déploiement
**R:** Vérifiez que :
1. `DATABASE_URL` est correctement configurée dans les variables d'environnement Vercel
2. La base de données accepte les connexions depuis l'extérieur (pas que localhost)
3. Le format de l'URL est correct : `postgresql://user:pass@host:port/db`
4. Le firewall de la DB autorise les IPs de Vercel

### Q: Erreur "Prisma Client not generated"
**R:**
```bash
# Localement
npx prisma generate

# Sur Vercel, ajoutez dans package.json :
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Q: Les graphiques ne s'affichent pas
**R:** Vérifiez :
1. Que vous avez des données dans la base
2. La console du navigateur (F12) pour voir les erreurs
3. Que les dates sont dans la période du projet

### Q: "Error: Cannot find module '@prisma/client'"
**R:**
```bash
# Réinstaller les dépendances
rm -rf node_modules .next
yarn install
npx prisma generate
yarn dev
```

### Q: Le site est lent
**R:**
1. Vérifiez les requêtes de base de données (ajoutez des index si nécessaire)
2. Activez le cache pour les données statiques
3. Optimisez les images
4. Utilisez le CDN de Vercel (automatique)

## Sécurité

### Q: Est-ce que mes données sont sécurisées ?
**R:** Oui, si vous suivez les bonnes pratiques :
- ✅ HTTPS automatique (Vercel)
- ✅ Variables d'environnement chiffrées (Vercel)
- ✅ Base de données avec SSL
- ⚠️ Changez les mots de passe exposés (voir SECURITE.md)

### Q: Faut-il ajouter un login/mot de passe ?
**R:** Pour un usage interne limité, ce n'est pas obligatoire. Si vous voulez ajouter l'authentification :
```bash
# NextAuth est déjà installé
# Consultez : https://next-auth.js.org/getting-started/example
```

### Q: Comment savoir si quelqu'un accède à mon site ?
**R:** Vercel Analytics (gratuit) vous montre :
- Nombre de visiteurs
- Pages consultées
- Performance
Activez-le dans Vercel Dashboard → Analytics

## Support

### Q: J'ai une erreur que je ne comprends pas
**R:** 
1. Lisez le message d'erreur complet
2. Cherchez l'erreur sur Google/Stack Overflow
3. Vérifiez les logs : `vercel logs` ou dans Vercel Dashboard
4. Ouvrez une issue GitHub avec les détails

### Q: Comment obtenir de l'aide ?
**R:**
- 📖 Lisez d'abord la documentation (DEPLOIEMENT.md, ANALYSE-CODE.md)
- 💬 Ouvrez une issue GitHub : [github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME/issues](https://github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME/issues)
- 📚 Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- 💬 Discord Vercel : [vercel.com/discord](https://vercel.com/discord)

### Q: Puis-je contribuer au projet ?
**R:** Oui ! 
1. Fork le repository
2. Créez une branche : `git checkout -b ma-feature`
3. Faites vos changements
4. Créez une Pull Request

### Q: Le projet est-il open source ?
**R:** C'est un projet pour le Ministère de la Santé de Côte d'Ivoire. Vérifiez avec votre organisation pour la politique de partage.

## Personnalisation

### Q: Comment changer le logo ?
**R:**
```bash
# 1. Placez votre logo dans /public
# public/logo.png

# 2. Utilisez-le dans vos composants
<Image src="/logo.png" alt="Logo" width={100} height={50} />
```

### Q: Comment ajouter Google Analytics ?
**R:**
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Q: Comment traduire l'interface en anglais ?
**R:** Utilisez `next-intl` ou créez un fichier de traduction :
```typescript
// lib/i18n.ts
export const translations = {
  fr: {
    title: 'Tableau de bord CME',
    // ...
  },
  en: {
    title: 'CME Dashboard',
    // ...
  }
};
```

---

**Vous ne trouvez pas votre question ?**
Ouvrez une issue GitHub ou consultez la documentation complète !
