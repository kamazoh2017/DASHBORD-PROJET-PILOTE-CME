export default function Home() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Bienvenue au Tutoriel Dashboard CME 🎓
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Apprenez le développement web moderne
        </h2>
        <p className="text-gray-700 mb-4">
          Ce tutoriel vous guide pas à pas pour maîtriser les technologies utilisées 
          dans le Dashboard CME et devenir autonome dans le développement d'applications web modernes.
        </p>
        <p className="text-gray-700">
          Le projet <strong>Dashboard CME</strong> (Carnet Mère-Enfant) sert de fil rouge 
          pour illustrer chaque concept de manière concrète.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3 text-blue-900">
          📚 8 Modules - 40 à 60 heures de formation
        </h3>
        <ul className="space-y-2 text-gray-800">
          <li>✅ <strong>Module 1 :</strong> Introduction (2h) - Complet</li>
          <li>📝 <strong>Module 2 :</strong> Next.js 14 (12h) - À venir</li>
          <li>📝 <strong>Module 3 :</strong> TypeScript (8h) - À venir</li>
          <li>📝 <strong>Module 4 :</strong> Prisma + PostgreSQL (10h) - À venir</li>
          <li>📝 <strong>Module 5 :</strong> Tailwind CSS (6h) - À venir</li>
          <li>📝 <strong>Module 6 :</strong> Internationalisation (4h) - À venir</li>
          <li>📝 <strong>Module 7 :</strong> Déploiement & CI/CD (6h) - À venir</li>
          <li>📝 <strong>Module 8 :</strong> Projet Final (12h) - À venir</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">🎯 Objectif</h3>
          <p className="text-gray-700">
            À la fin de ce tutoriel, vous serez capable de reproduire le Dashboard CME 
            de A à Z et de créer vos propres applications web modernes.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">⚡ Règle 80/20</h3>
          <p className="text-gray-700">
            Focus sur les 20% de connaissances essentielles pour réaliser 80% des tâches. 
            Approche pratique et orientée métier.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-3 text-green-900">
          🚀 Commencer maintenant
        </h3>
        <p className="text-gray-800 mb-4">
          Cliquez sur <strong>Module 1 : Introduction</strong> dans la sidebar pour commencer votre apprentissage.
        </p>
        <p className="text-gray-700 text-sm">
          💡 Astuce : Votre progression est automatiquement sauvegardée dans votre navigateur.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          📖 Ce que vous allez apprendre
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <ul className="space-y-2">
            <li>✓ Next.js 14 (App Router)</li>
            <li>✓ TypeScript</li>
            <li>✓ React Server Components</li>
            <li>✓ Prisma ORM</li>
          </ul>
          <ul className="space-y-2">
            <li>✓ PostgreSQL</li>
            <li>✓ Tailwind CSS</li>
            <li>✓ Internationalisation (i18n)</li>
            <li>✓ Déploiement Vercel + CI/CD</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
