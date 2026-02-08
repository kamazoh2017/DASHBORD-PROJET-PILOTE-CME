export default function Module02() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Module 2 : Next.js 14
      </h1>
      <p className="text-gray-600 mb-8">Durée : 12 heures | Niveau : Intermédiaire</p>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-yellow-900">
          🚧 Module en cours de développement
        </h2>
        <p className="text-gray-700">
          Ce module sera bientôt disponible. Il couvrira :
        </p>
        <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
          <li>App Router vs Pages Router</li>
          <li>Server Components vs Client Components</li>
          <li>Routing et Navigation</li>
          <li>Data Fetching (fetch, cache)</li>
          <li>API Routes</li>
          <li>Middleware</li>
          <li>Optimisations (Image, Font, Script)</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mt-8">
        <a 
          href="/modules/01-introduction"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Module 1
        </a>
        <a 
          href="/modules/03-typescript"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Module 3 →
        </a>
      </div>
    </div>
  )
}
