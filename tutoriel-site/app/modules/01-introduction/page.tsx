import CodeBlock from '@/app/components/CodeBlock'
import Quiz from '@/app/components/Quiz'

export default function Module01() {
  const quizQuestions = [
    {
      question: "Quel est le rôle principal de Next.js dans ce projet ?",
      options: [
        "Gérer la base de données",
        "Framework full-stack React avec Server Components",
        "Gérer le styling CSS",
        "Compiler TypeScript"
      ],
      correctIndex: 1,
      explanation: "Next.js est un framework React full-stack qui permet de créer à la fois le frontend et le backend de l'application, avec support des Server Components."
    },
    {
      question: "Pourquoi utilise-t-on TypeScript plutôt que JavaScript ?",
      options: [
        "C'est plus rapide à l'exécution",
        "C'est obligatoire pour Next.js",
        "Pour avoir le typage statique et réduire les bugs",
        "C'est plus facile à apprendre"
      ],
      correctIndex: 2,
      explanation: "TypeScript ajoute un système de types statiques à JavaScript, permettant de détecter les erreurs avant l'exécution et d'améliorer la maintenabilité du code."
    },
    {
      question: "Quel est le rôle de Prisma dans l'application ?",
      options: [
        "Gérer le routing",
        "ORM pour interagir avec la base de données PostgreSQL",
        "Compiler le code TypeScript",
        "Gérer l'authentification"
      ],
      correctIndex: 1,
      explanation: "Prisma est un ORM (Object-Relational Mapping) qui simplifie les interactions avec la base de données PostgreSQL via des requêtes type-safe."
    }
  ]

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Module 1 : Introduction au Développement Web Moderne
      </h1>
      <p className="text-gray-600 mb-8">Durée : 2 heures | Niveau : Débutant</p>

      {/* Section 1 : Vue d'ensemble */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          1. Vue d'ensemble du Stack Technologique
        </h2>
        
        <p className="text-gray-700 mb-4">
          Le Dashboard CME utilise un stack moderne appelé <strong>"T3 Stack"</strong> (TypeScript, tRPC, Tailwind), 
          adapté pour des applications professionnelles. Voici les technologies principales :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Next.js 14</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> Framework React full-stack
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Server Components, App Router, SEO optimisé
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> Remix, SvelteKit, Astro
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 Part de marché : #1 framework React (2026)
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">TypeScript</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> JavaScript avec typage statique
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Moins de bugs, meilleur IDE, code plus sûr
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> JavaScript vanilla, Flow
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 Utilisé par : Microsoft, Google, Airbnb
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Prisma ORM</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> ORM type-safe pour bases de données
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Migrations auto, queries type-safe, Prisma Studio
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> Drizzle, TypeORM, Sequelize
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 +10M téléchargements/mois npm
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">PostgreSQL</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> Base de données relationnelle open-source
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Fiable, scalable, features avancées
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> MySQL, SQLite, MongoDB
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 Base de données de l'année 2023-2024
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Tailwind CSS</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> Framework CSS utility-first
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Rapide, consistant, pas de CSS à écrire
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> Bootstrap, Material-UI, Chakra UI
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 Framework CSS le plus populaire 2024
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Vercel</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>C'est quoi ?</strong> Plateforme de déploiement cloud
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Pourquoi ?</strong> Zero-config, CI/CD auto, gratuit
            </p>
            <p className="text-sm text-gray-600">
              <strong>Alternative :</strong> Netlify, Railway, Render
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📊 Créateur de Next.js
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-gray-800">
            <strong>💡 Règle 80/20 :</strong> Ces 6 technologies représentent 20% des connaissances 
            pour faire 80% des applications web modernes. Maîtrisez-les et vous serez opérationnel !
          </p>
        </div>
      </section>

      {/* Section 2 : Installation */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          2. Installation de l'Environnement
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Étape 1 : Installer Node.js 18+
            </h3>
            <p className="text-gray-700 mb-3">
              Téléchargez depuis <a href="https://nodejs.org" className="text-blue-600 underline" target="_blank">nodejs.org</a>
            </p>
            <CodeBlock 
              code="# Vérifier l'installation\nnode --version  # Doit afficher v18.x ou v20.x\nnpm --version   # Doit afficher 9.x ou 10.x"
              language="bash"
              title="Terminal"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Étape 2 : Installer Git
            </h3>
            <p className="text-gray-700 mb-3">
              Téléchargez depuis <a href="https://git-scm.com" className="text-blue-600 underline" target="_blank">git-scm.com</a>
            </p>
            <CodeBlock 
              code="# Vérifier l'installation\ngit --version  # Doit afficher git version 2.x"
              language="bash"
              title="Terminal"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Étape 3 : Installer VS Code
            </h3>
            <p className="text-gray-700 mb-3">
              Téléchargez depuis <a href="https://code.visualstudio.com" className="text-blue-600 underline" target="_blank">code.visualstudio.com</a>
            </p>
            <p className="text-gray-700 mb-2"><strong>Extensions recommandées :</strong></p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>ES7+ React/Redux/React-Native snippets</li>
              <li>Prisma</li>
              <li>Tailwind CSS IntelliSense</li>
              <li>ESLint</li>
              <li>Prettier - Code formatter</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Étape 4 : Cloner le projet
            </h3>
            <CodeBlock 
              code={`# Cloner le repository
git clone https://github.com/kamazoh2017/DASHBORD-PROJET-PILOTE-CME.git
cd DASHBORD-PROJET-PILOTE-CME

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Lancer en développement
npm run dev`}
              language="bash"
              title="Installation complète"
            />
          </div>
        </div>
      </section>

      {/* Section 3 : Architecture */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          3. Architecture du Projet
        </h2>

        <p className="text-gray-700 mb-4">
          Le projet utilise l'<strong>App Router de Next.js 14</strong>, la nouvelle architecture recommandée.
        </p>

        <CodeBlock 
          code={`DASHBORD-PROJET-PILOTE-CME/
├── app/                    # Pages et layouts (App Router)
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Page d'accueil
│   ├── home-client.tsx     # Client Component page accueil
│   ├── supervision/        # Route /supervision
│   ├── application/        # Route /application
│   └── comparaison/        # Route /comparaison
├── components/             # Composants réutilisables
│   ├── sidebar.tsx         # Sidebar de navigation
│   └── language-switcher.tsx
├── lib/                    # Utilitaires et configurations
│   └── prisma.ts           # Client Prisma singleton
├── prisma/                 # Schéma base de données
│   └── schema.prisma       # Modèles de données
├── messages/               # Traductions i18n
│   ├── ja.json             # Japonais (défaut)
│   ├── en.json             # Anglais
│   └── fr.json             # Français
├── public/                 # Assets statiques
├── .env                    # Variables d'environnement
├── package.json            # Dépendances
└── next.config.js          # Configuration Next.js`}
          language="plaintext"
          title="Structure du projet"
        />

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            📁 Différence App Router vs Pages Router
          </p>
          <p className="text-sm text-gray-700">
            <strong>App Router (nouveau) :</strong> app/page.tsx → route "/"<br />
            <strong>Pages Router (ancien) :</strong> pages/index.tsx → route "/"<br /><br />
            Ce projet utilise App Router (Next.js 13+) pour les Server Components.
          </p>
        </div>
      </section>

      {/* Section 4 : Premier contact */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          4. Premier Contact avec le Code
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Exercice 1 : Comprendre une Page Next.js
            </h3>
            <p className="text-gray-700 mb-3">
              Ouvrez le fichier <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code> dans VS Code :
            </p>
            <CodeBlock 
              code={`export default function Home() {
  return (
    <div>
      <h1>Tableau de Bord CME</h1>
      <p>Bienvenue sur le dashboard</p>
    </div>
  )
}`}
              language="typescript"
              title="app/page.tsx (simplifié)"
            />
            <p className="text-gray-700 mt-3">
              ✅ C'est un <strong>Server Component</strong> par défaut dans Next.js 14<br />
              ✅ Il retourne du JSX (HTML dans JavaScript)<br />
              ✅ Il est exporté avec <code>export default</code>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Exercice 2 : Modifier une Page
            </h3>
            <p className="text-gray-700 mb-3">
              Ouvrez <code className="bg-gray-100 px-2 py-1 rounded">app/page.tsx</code> et changez le titre :
            </p>
            <CodeBlock 
              code={`// Avant
<h1>Tableau de Bord CME</h1>

// Après
<h1>Mon Premier Dashboard</h1>`}
              language="typescript"
            />
            <p className="text-gray-700 mt-3">
              💾 Sauvegardez et regardez le navigateur → Le changement s'applique automatiquement ! (Hot Reload)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Exercice 3 : Explorer Prisma Studio
            </h3>
            <p className="text-gray-700 mb-3">
              Lancez l'interface graphique pour voir la base de données :
            </p>
            <CodeBlock 
              code="npx prisma studio"
              language="bash"
            />
            <p className="text-gray-700 mt-3">
              Une interface web s'ouvre sur <code>http://localhost:5555</code> où vous pouvez voir et éditer les données.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 : Checklist */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          5. Checklist de Validation
        </h2>

        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai installé Node.js 18+</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai installé Git</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai installé VS Code avec les extensions</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai cloné le projet</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">npm install a fonctionné</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">npm run dev lance le serveur</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">Je vois l'application sur localhost:3000</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">Je comprends la structure du projet</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai réussi les 3 exercices</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">Je connais le rôle de chaque technologie</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="w-5 h-5" />
            <span className="text-gray-700">J'ai réussi le quiz ci-dessous</span>
          </label>
        </div>
      </section>

      {/* Quiz */}
      <Quiz questions={quizQuestions} moduleId="01-introduction" />

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <a 
          href="/"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Retour à l'accueil
        </a>
        <a 
          href="/modules/02-nextjs"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Module 2 : Next.js 14 →
        </a>
      </div>
    </div>
  )
}
