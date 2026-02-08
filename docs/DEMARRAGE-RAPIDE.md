# 🚀 Guide de démarrage rapide

## Option 1 : Déploiement sur Vercel (Recommandé - Gratuit)

### En 5 minutes chrono :

1. **Créez un compte Vercel gratuit**
   - Allez sur https://vercel.com/signup
   - Connectez-vous avec votre compte GitHub

2. **Importez ce projet**
   - Dans Vercel, cliquez sur "Add New..." → "Project"
   - Sélectionnez ce repository : `kamazoh2017/DASHBORD-PROJET-PILOTE-CME`
   - Cliquez sur "Import"

3. **Ajoutez les variables d'environnement**
   
   Dans la section "Environment Variables" de Vercel, ajoutez :
   
   ```
   Nom: DATABASE_URL
   Valeur: postgresql://role_2f0c98b1b:Iy5R2jkJLBWQwqd0xxBYbxkBVpHj1p0s@db-2f0c98b1b.db003.hosteddb.reai.io:5432/2f0c98b1b?connect_timeout=15
   
   Nom: ABACUSAI_API_KEY
   Valeur: 9c02ad76f0504deebcb5334a0ce54cd2
   ```

4. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - Votre site sera disponible à : `https://votre-projet.vercel.app`

5. **Initialisez la base de données** (première fois uniquement)
   
   Dans votre terminal local :
   ```bash
   # Télécharger les variables d'environnement
   npx vercel env pull .env.local
   
   # Pousser le schéma vers la base de données
   npx prisma db push
   ```

✅ **C'est fait !** Votre dashboard est en ligne et accessible publiquement.

---

## Option 2 : Déploiement avec le script automatique

```bash
# Rendre le script exécutable (si nécessaire)
chmod +x deploy-vercel.sh

# Lancer le déploiement
./deploy-vercel.sh
```

Le script vous guidera étape par étape.

---

## Option 3 : Développement local

```bash
# 1. Installer les dépendances
yarn install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Éditer .env avec vos valeurs
nano .env  # ou utilisez votre éditeur préféré

# 4. Générer le client Prisma
npx prisma generate

# 5. Initialiser la base de données
npx prisma db push

# 6. (Optionnel) Remplir avec des données de test
npx prisma db seed

# 7. Lancer le serveur de développement
yarn dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

---

## 📝 Autres plateformes gratuites

### Netlify
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod
```

### Railway
1. Créez un compte sur https://railway.app
2. Cliquez sur "New Project" → "Deploy from GitHub repo"
3. Sélectionnez ce repository
4. Ajoutez les variables d'environnement
5. Railway déploiera automatiquement

### Render
1. Créez un compte sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub
4. Configurez :
   - Build Command: `yarn install && npx prisma generate && yarn build`
   - Start Command: `yarn start`
5. Ajoutez les variables d'environnement
6. Cliquez sur "Create Web Service"

---

## ⚠️ Important : Sécurité

Le fichier `.env` contient des informations sensibles. Il a été ajouté au `.gitignore` pour ne pas être partagé publiquement.

**NE JAMAIS** committer ou partager vos vraies clés API et mots de passe !

---

## 🆘 Besoin d'aide ?

- 📖 Documentation complète : [DEPLOIEMENT.md](./DEPLOIEMENT.md)
- 💬 Questions : Ouvrez une issue GitHub
- 🐛 Bug : Créez un rapport de bug

---

## ✅ Checklist de vérification

Après le déploiement, vérifiez que :

- [ ] L'URL du site fonctionne
- [ ] La page d'accueil s'affiche correctement
- [ ] Les graphiques sont visibles
- [ ] La navigation entre les pages fonctionne
- [ ] Les données s'affichent (si la base est remplie)
- [ ] Pas d'erreurs dans la console du navigateur (F12)

Si tout est ✅, félicitations ! Votre dashboard est opérationnel ! 🎉
