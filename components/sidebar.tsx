'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Database, GitCompare, Home, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './language-switcher';

export default function Sidebar() {
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);
  const t = useTranslations('sidebar');

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/supervision', label: t('nav.supervision'), icon: ClipboardList },
    { href: '/application', label: t('nav.application'), icon: Database },
    { href: '/comparaison', label: t('nav.comparison'), icon: GitCompare },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/refresh-data', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white shadow-xl z-50 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-1">{t('title')}</h1>
        <p className="text-orange-200 text-sm">{t('subtitle')}</p>
      </div>
      
      <nav className="mt-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-white/20 border-r-4 border-white'
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-orange-500 space-y-3">
        <LanguageSwitcher />
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="text-sm">{refreshing ? t('refreshing') : t('refreshButton')}</span>
        </button>
        <p className="text-orange-200 text-xs text-center">
          {t('footer')}
        </p>
      </div>
    </aside>
  );
}
