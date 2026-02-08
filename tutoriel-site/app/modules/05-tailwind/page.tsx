export default function Module05() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Module 5 : Tailwind CSS</h1>
      <p className="text-gray-600 mb-8">Durée : 6 heures | Niveau : Débutant</p>
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-yellow-900">🚧 Module en cours de développement</h2>
        <p className="text-gray-700">Ce module couvrira Tailwind CSS.</p>
      </div>
      <div className="flex justify-between items-center mt-8">
        <a href="/modules/04-prisma" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">← Module 4</a>
        <a href="/modules/06-i18n" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Module 6 →</a>
      </div>
    </div>
  )
}
