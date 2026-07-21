'use client';

import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageToggleProps {
  currentLocale: string;
}

const localeNames: Record<string, string> = {
  'zh-TW': '繁中',
  'en': 'EN',
};

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  
  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'zh-TW') {
      segments[1] = newLocale === 'zh-TW' ? '' : newLocale;
    } else {
      segments.splice(1, 0, newLocale === 'zh-TW' ? '' : newLocale);
    }
    return segments.join('/').replace(/\/+/g, '/');
  };

  const switchLocale = currentLocale === 'zh-TW' ? 'en' : 'zh-TW';

  return (
    <Link
      href={getLocalizedPath(switchLocale)}
      className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/10 hover:border-purple-500/50 hover:bg-dark-700/50 transition-all duration-200"
      aria-label={`Switch to ${localeNames[switchLocale]}`}
      title={`Switch language / 切換語言`}
    >
      <Globe className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
      <span className="flex items-center gap-1 text-xs font-medium">
        <span className={currentLocale === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
        <span className="text-slate-600">/</span>
        <span className={currentLocale === 'zh-TW' ? 'text-white' : 'text-slate-500'}>繁中</span>
      </span>
    </Link>
  );
}