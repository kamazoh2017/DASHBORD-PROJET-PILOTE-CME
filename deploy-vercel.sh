#!/bin/bash

# Script de déploiement rapide sur Vercel
# Assurez-vous d'avoir installé Vercel CLI: npm install -g vercel

echo "🚀 Déploiement du Dashboard CME sur Vercel"
echo "==========================================="
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI n'est pas installé."
    echo "📦 Installation en cours..."
    npm install -g vercel
fi

echo "✅ Vercel CLI détecté"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création depuis .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Éditez le fichier .env avec vos vraies valeurs!"
    echo ""
    read -p "Appuyez sur Entrée quand vous avez configuré .env..."
fi

echo "🔐 Connexion à Vercel..."
vercel login

echo ""
echo "📦 Installation des dépendances..."
yarn install

echo ""
echo "🗄️  Génération du client Prisma..."
npx prisma generate

echo ""
echo "🚀 Déploiement sur Vercel..."
echo "ℹ️  Suivez les instructions pour configurer votre projet"
vercel

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Allez sur https://vercel.com/dashboard"
echo "2. Configurez les variables d'environnement:"
echo "   - DATABASE_URL"
echo "   - ABACUSAI_API_KEY"
echo "3. Redéployez avec: vercel --prod"
echo ""
echo "📚 Pour plus d'informations, consultez DEPLOIEMENT.md"
