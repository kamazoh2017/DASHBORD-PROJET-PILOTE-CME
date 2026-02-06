'use client';

import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getCurrentLanguage = () => {
    // Get current locale from cookie
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ja';
    return languages.find(lang => lang.code === locale) || languages[0];
  };

  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const switchLanguage = (langCode: string) => {
    startTransition(() => {
      // Set cookie
      document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000`;
      
      // Update state
      const newLang = languages.find(lang => lang.code === langCode);
      if (newLang) {
        setCurrentLang(newLang);
      }
      
      setIsOpen(false);
      
      // Refresh the page to apply new language
      router.refresh();
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-lg"
        disabled={isPending}
      >
        <Globe size={16} />
        <span className="text-sm flex-1 text-left">
          {currentLang.flag} {currentLang.name}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${
                  currentLang.code === lang.code
                    ? 'bg-orange-50 text-orange-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {currentLang.code === lang.code && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
