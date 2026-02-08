export default function Module03() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Module 3 : TypeScript
      </h1>
      <p className="text-gray-600 mb-8">Durée : 8 heures | Niveau : Intermédiaire</p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-yellow-900">
          🚧 Module en cours de développement
        </h2>
        <p className="text-gray-700">
          Ce module sera bientôt disponible. Il couvrira :
        </p>
        <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
          <li>Types de base (string, number, boolean, etc.)</li>
          <li>Interfaces et Types</li>
          <li>Génériques</li>
          <li>Type Guards et Type Narrowing</li>
          <li>Utility Types</li>
          <li>TypeScript avec React</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mt-8">
        <a 
          href="/modules/02-nextjs"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Module 2
        </a>
        <a 
          href="/modules/04-prisma"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Module 4 →
        </a>
      </div>
    </div>
  )
}
