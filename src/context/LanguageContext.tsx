'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Base translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'language.switchTo': '繁體中文',
    'language.current': 'English',
    'userProgress.level': 'Level',
    'userProgress.xp': 'XP',
    'logo.selfDiscovery': 'Self-Discovery',
    'logo.innerExploration': '內在探索',
  },
  'zh-TW': {
    'language.switchTo': 'English',
    'language.current': '繁體中文',
    'userProgress.level': '等級',
    'userProgress.xp': '經驗值',
    'logo.selfDiscovery': 'Self-Discovery',
    'logo.innerExploration': '內在探索',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'zh-TW' : 'en'));
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language };
