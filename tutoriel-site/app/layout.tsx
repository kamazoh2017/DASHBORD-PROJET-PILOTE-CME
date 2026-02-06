import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tutoriel Dashboard CME - Apprendre Next.js, TypeScript, Prisma et plus',
  description: 'Formation complète aux technologies modernes de développement web à travers le projet Dashboard CME',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
