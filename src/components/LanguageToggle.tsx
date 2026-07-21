'use client';

import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageToggleProps {
  currentLocale: string;
}

const localeNames: Record<string, string> = {
  'zh-TW': '繁體中文',
  'en': 'EN',
};

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  
  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    // Handle the locale segment (could be 'en', 'zh-TW', or root for zh-TW default)
    if (segments[1] === 'en' || segments[1] === 'zh-TW') {
      segments[1] = newLocale === 'zh-TW' ? '' : newLocale;
    } else {
      // If no locale in path, add one
      segments.splice(1, 0, newLocale === 'zh-TW' ? '' : newLocale);
    }
    return segments.join('/').replace(/\/+/g, '/');
  };

  const switchLocale = currentLocale === 'zh-TW' ? 'en' : 'zh-TW';

  return (
    <Link
      href={getLocalizedPath(switchLocale)}
      className="flex items-center gap-1.5 text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors duration-200"
      aria-label={`Switch to ${localeNames[switchLocale]}`}
    >
      <Globe className="w-4 h-4" />
      <span>{localeNames[switchLocale]}</span>
    </Link>
  );
}
