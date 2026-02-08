'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const modules = [
  { id: '01-introduction', name: 'Module 1 : Introduction', duration: '2h', complete: true },
  { id: '02-nextjs', name: 'Module 2 : Next.js 14', duration: '12h', complete: false },
  { id: '03-typescript', name: 'Module 3 : TypeScript', duration: '8h', complete: false },
  { id: '04-prisma', name: 'Module 4 : Prisma + PostgreSQL', duration: '10h', complete: false },
  { id: '05-tailwind', name: 'Module 5 : Tailwind CSS', duration: '6h', complete: false },
  { id: '06-i18n', name: 'Module 6 : Internationalisation', duration: '4h', complete: false },
  { id: '07-deployment', name: 'Module 7 : Déploiement & CI/CD', duration: '6h', complete: false },
  { id: '08-projet-final', name: 'Module 8 : Projet Final', duration: '12h', complete: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saved = localStorage.getItem('tutoriel-progress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  const totalModules = modules.length
  const completedModules = Object.values(progress).filter(Boolean).length
  const progressPercent = Math.round((completedModules / totalModules) * 100)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Tutoriel CME</h1>
        <p className="text-gray-400 text-sm">Formation complète</p>
      </div>

      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progression</span>
          <span className="text-sm text-gray-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {completedModules} / {totalModules} modules
        </p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            pathname === '/' 
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-800 text-gray-300'
          }`}
        >
          🏠 Accueil
        </Link>

        {modules.map((module) => {
          const isActive = pathname?.includes(module.id)
          const isCompleted = progress[module.id] || module.complete
          
          return (
            <Link
              key={module.id}
              href={`/modules/${module.id}`}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {isCompleted ? '✅ ' : '📝 '}
                  {module.name}
                </span>
                <span className="text-xs text-gray-400">{module.duration}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Total : 40-60 heures
        </p>
      </div>
    </aside>
  )
}
