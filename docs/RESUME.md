# 🎯 Dashboard CME - Résumé Exécutif

## Qu'est-ce que c'est ?

Un **tableau de bord web** pour suivre en temps réel le projet pilote de digitalisation du Carnet Mère-Enfant dans 5 hôpitaux de Côte d'Ivoire.

## 📊 Que fait l'application ?

### Suivi des indicateurs clés :
- 👩‍⚕️ **Sages-femmes** : nombre formées et présentes
- 🤰 **Femmes enceintes** : reçues, enregistrées, connectées à l'app mobile
- 📈 **Progression** : par rapport à l'objectif de 400 femmes sur 3 semaines
- 🏥 **Comparaison** : performance entre les 5 établissements

### Visualisations disponibles :
- Graphiques de progression quotidienne
- Taux d'atteinte des objectifs
- Comparaison supervision terrain vs données application mobile
- Évolution temporelle sur la période du projet

## 🚀 Comment le déployer ? (Gratuit - 5 minutes)

### Méthode la plus simple :

1. **Créez un compte Vercel** (gratuit)
   → [vercel.com/signup](https://vercel.com/signup)

2. **Importez ce projet**
   → Cliquez "Add New" → "Project" → Sélectionnez ce repository

3. **Configurez 2 variables d'environnement** :
   - `DATABASE_URL` : Connexion à votre base PostgreSQL
   - `ABACUSAI_API_KEY` : Votre clé API (si utilisée)

4. **Déployez**
   → Un clic, 2-3 minutes d'attente
   → Votre site est en ligne : `https://votre-projet.vercel.app`

5. **Initialisez la base de données** (première fois seulement)
   ```bash
   npx prisma db push
   ```

✅ **C'est tout !** Votre dashboard est opérationnel.

## 💰 Coûts

**0€** - Entièrement gratuit sur Vercel pour ce type de projet.
- Déploiements illimités
- 100 GB bande passante/mois (largement suffisant)
- SSL/HTTPS automatique
- Pas de limite de temps

## 📚 Documentation disponible

| Fichier | Contenu |
|---------|---------|
| **[DEMARRAGE-RAPIDE.md](DEMARRAGE-RAPIDE.md)** | Guide pas-à-pas pour déployer en 5 min |
| **[DEPLOIEMENT.md](DEPLOIEMENT.md)** | Guide complet de déploiement (Vercel, Netlify, Railway, etc.) |
| **[ANALYSE-CODE.md](ANALYSE-CODE.md)** | Explication technique détaillée du code |
| **[SECURITE.md](SECURITE.md)** | ⚠️ **À LIRE** : Sécuriser votre déploiement |
| **[FAQ.md](FAQ.md)** | Réponses aux questions fréquentes |
| **[README.md](README.md)** | Vue d'ensemble du projet |

## ⚠️ Important - Sécurité

Le fichier `.env` contenant vos identifiants de base de données a été **supprimé du repository pour votre sécurité**.

**Action requise** :
1. Lisez [SECURITE.md](SECURITE.md)
2. Changez vos mots de passe de base de données (ils étaient publics)
3. Régénérez vos API keys

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React moderne
- **TypeScript** - Sécurité du typage
- **PostgreSQL** - Base de données
- **Prisma** - ORM pour la base de données
- **Tailwind CSS** - Design moderne et responsive
- **Chart.js / Recharts** - Graphiques interactifs

## 📅 Période du projet

**Du 03/02/2026 au 27/02/2026** (3 semaines)
- Objectif : **400 femmes enceintes enregistrées**
- Objectif quotidien : **22 femmes/jour** (jours ouvrables)

## 🏥 Établissements suivis

1. CHU COCODY (12 sages-femmes formées)
2. CHR ABOBO (10 sages-femmes)
3. HG YOPOUGON-ATTIE (8 sages-femmes)
4. HG BINGERVILLE (8 sages-femmes)
5. FSU WILLIAMSVILLE (6 sages-femmes)

## 📞 Support

- 📖 **Documentation** : Lisez les fichiers .md de ce repository
- 🐛 **Problème technique** : Ouvrez une issue GitHub
- 💬 **Question** : Consultez [FAQ.md](FAQ.md)
- 🆘 **Urgence** : Voir [SECURITE.md](SECURITE.md)

## ✅ Prochaines étapes recommandées

1. **Lisez ce fichier** ✅ (vous y êtes !)
2. **Suivez [DEMARRAGE-RAPIDE.md](DEMARRAGE-RAPIDE.md)** pour déployer
3. **Lisez [SECURITE.md](SECURITE.md)** pour sécuriser
4. **Consultez [FAQ.md](FAQ.md)** si questions

## 🎉 Bon déploiement !

Ce dashboard est prêt à l'emploi. En moins de 10 minutes, vous pouvez l'avoir en ligne et fonctionnel.

---

**Développé pour le Ministère de la Santé de Côte d'Ivoire**
*Projet de digitalisation du Carnet Mère-Enfant - Phase Pilote*
