# 🔒 Guide de sécurité - Dashboard CME

## ⚠️ URGENT : Action immédiate requise

Votre fichier `.env` contenant des informations sensibles a été supprimé du repository pour des raisons de sécurité.

### 🚨 Credentials exposés

Les informations suivantes ont été publiquement exposées dans le repository :

1. **Base de données PostgreSQL** :
   - Host: db-2f0c98b1b.db003.hosteddb.reai.io
   - Port: 5432
   - Database: 2f0c98b1b
   - User: role_2f0c98b1b
   - Password: `Iy5R2jkJLBWQwqd0xxBYbxkBVpHj1p0s`

2. **API Key AbacusAI** :
   - Key: `9c02ad76f0504deebcb5334a0ce54cd2`

### ✅ Actions de sécurité à effectuer MAINTENANT

#### 1. Changer le mot de passe de la base de données

Connectez-vous à votre fournisseur de base de données (hosteddb.reai.io) et :
- Changez immédiatement le mot de passe
- Ou créez un nouvel utilisateur avec un nouveau mot de passe
- Révoquent l'accès de l'ancien utilisateur

#### 2. Régénérer l'API key AbacusAI

- Connectez-vous à votre compte AbacusAI
- Révoquez la clé actuelle : `9c02ad76f0504deebcb5334a0ce54cd2`
- Générez une nouvelle clé API

#### 3. Mettre à jour vos variables d'environnement

Créez un nouveau fichier `.env` (qui est maintenant dans .gitignore) :

```bash
# Nouveau mot de passe de base de données
DATABASE_URL="postgresql://role_2f0c98b1b:VOTRE_NOUVEAU_MOT_DE_PASSE@db-2f0c98b1b.db003.hosteddb.reai.io:5432/2f0c98b1b?connect_timeout=15"

# Nouvelle API key
ABACUSAI_API_KEY="votre_nouvelle_cle_api"
```

#### 4. Mettre à jour Vercel (si déjà déployé)

1. Allez dans Vercel Dashboard
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Mettez à jour `DATABASE_URL` et `ABACUSAI_API_KEY`
5. Redéployez : Settings → Deployments → Redeploy

## 📋 Checklist de sécurité

### Avant le déploiement

- [ ] Fichier `.env` est dans `.gitignore`
- [ ] Aucun secret dans le code source
- [ ] Variables d'environnement configurées sur la plateforme de déploiement
- [ ] Mots de passe forts (min 16 caractères)
- [ ] API keys régénérées après toute exposition

### Configuration de la base de données

- [ ] Connexion SSL activée
- [ ] Firewall configuré (whitelist IPs si possible)
- [ ] Sauvegardes automatiques activées
- [ ] Utilisateur avec privilèges minimaux nécessaires
- [ ] Timeout de connexion configuré (15 secondes)

### Vercel / Plateforme de déploiement

- [ ] Variables d'environnement en mode "Encrypted"
- [ ] Pas de variables sensibles dans les logs
- [ ] HTTPS forcé (automatique sur Vercel)
- [ ] Headers de sécurité configurés

### Application

- [ ] Validation des entrées utilisateur
- [ ] Protection CSRF (intégré Next.js)
- [ ] Rate limiting sur les API routes (à ajouter si besoin)
- [ ] Logs ne contiennent pas de données sensibles
- [ ] Gestion sécurisée des erreurs (pas d'info sensible exposée)

## 🛡️ Bonnes pratiques

### Gestion des secrets

1. **Jamais dans le code** :
   ```typescript
   // ❌ MAUVAIS
   const apiKey = "9c02ad76f0504deebcb5334a0ce54cd2";
   
   // ✅ BON
   const apiKey = process.env.ABACUSAI_API_KEY;
   ```

2. **Variables d'environnement par environnement** :
   - `.env.local` - Développement local
   - `.env.production` - Production (mais pas dans Git!)
   - Variables Vercel - Production (sécurisé)

3. **Rotation régulière** :
   - Changez les mots de passe tous les 3 mois
   - Régénérez les API keys périodiquement
   - Auditez les accès à la base de données

### Protection de la base de données

1. **Connexion sécurisée** :
   ```bash
   # Toujours avec SSL
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

2. **Prisma en production** :
   ```typescript
   // Limiter les connexions
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Backups** :
   - Sauvegardes quotidiennes automatiques
   - Tester la restauration régulièrement
   - Conserver 30 jours d'historique

### API Routes sécurisées

```typescript
// app/api/exemple/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Valider les entrées
    const body = await request.json();
    // Utiliser Zod ou Yup pour validation
    
    // 2. Vérifier l'authentification (si nécessaire)
    // const session = await getServerSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // 3. Rate limiting (optionnel mais recommandé)
    // Utiliser un middleware ou une librairie
    
    // 4. Traiter la requête
    // ...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    // 5. Gestion d'erreur sans exposer de détails
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Headers de sécurité

Ajoutez dans `next.config.js` :

```javascript
const nextConfig = {
  // ... config existante
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

## 🔍 Audit de sécurité

### Vérifications régulières

1. **Dépendances** :
   ```bash
   # Vérifier les vulnérabilités
   yarn audit
   
   # Ou avec npm
   npm audit
   
   # Corriger automatiquement
   yarn audit fix
   ```

2. **Secrets dans le code** :
   ```bash
   # Installer trufflehog ou gitleaks
   # Scanner le repository
   git log -p | grep -i "password\|api_key\|secret"
   ```

3. **Permissions** :
   - Vérifier qui a accès au repository GitHub
   - Vérifier qui a accès à Vercel
   - Vérifier qui a accès à la base de données

### Monitoring

1. **Logs d'erreur** :
   - Surveillez les erreurs 500
   - Regardez les tentatives d'accès non autorisées
   - Suivez les échecs de connexion DB

2. **Performances** :
   - Queries lentes peuvent indiquer une attaque
   - Traffic inhabituel
   - Pics de requêtes API

## 📞 En cas d'incident de sécurité

1. **Isolez immédiatement** :
   - Changez tous les mots de passe
   - Révoquez toutes les API keys
   - Suspendez l'application si nécessaire

2. **Évaluez l'impact** :
   - Quelles données ont été exposées ?
   - Combien de temps ?
   - Qui a eu accès ?

3. **Corrigez** :
   - Appliquez les patches
   - Renforcez la sécurité
   - Documentez l'incident

4. **Communiquez** :
   - Informez les utilisateurs si données personnelles exposées
   - Contactez l'équipe technique
   - Documentez les leçons apprises

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/going-to-production#security)
- [Vercel Security](https://vercel.com/docs/security/security-overview)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

⚠️ **N'oubliez pas** : La sécurité est un processus continu, pas une configuration unique !
