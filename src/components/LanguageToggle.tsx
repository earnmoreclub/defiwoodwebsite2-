'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface LanguageToggleProps {
  currentLocale: string;
}

const localeNames: Record<string, string> = {
  'zh-TW': '繁中',
  'en': 'EN',
};

// Must match i18n.ts defaultLocale
const DEFAULT_LOCALE = 'zh-TW';

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = currentLocale === 'zh-TW' ? 'en' : 'zh-TW';

  // Strip the current locale prefix to get the path-without-locale
  const getPathWithoutLocale = (): string => {
    if (!pathname) return '/';
    const segments = pathname.split('/').filter(Boolean);
    const firstIsLocale = segments[0] === 'en' || segments[0] === 'zh-TW';
    if (firstIsLocale) {
      segments.shift();
    }
    return '/' + segments.join('/');
  };

  // Build the destination URL for the target locale
  const getLocalizedPath = (newLocale: string): string => {
    const basePath = getPathWithoutLocale();
    // With localePrefix: 'as-needed', default locale (zh-TW) has no prefix
    if (newLocale === DEFAULT_LOCALE) {
      return basePath === '/' ? '/' : basePath;
    }
    return basePath === '/' ? '/en' : `/en${basePath}`;
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newPath = getLocalizedPath(switchLocale);
    startTransition(() => {
      // Use router.push so the locale-aware server components re-render
      router.push(newPath);
      // Force refresh to ensure NextIntlClientProvider messages reload
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/10 hover:border-purple-500/50 hover:bg-dark-700/50 transition-all duration-200 select-none ${
        isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer'
      }`}
      aria-label={`Switch to ${localeNames[switchLocale]}`}
      title={`Switch language / 切換語言`}
    >
      <Globe className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
      <span className="flex items-center gap-1 text-xs font-medium">
        <span className={currentLocale === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
        <span className="text-slate-600">/</span>
        <span className={currentLocale === 'zh-TW' ? 'text-white' : 'text-slate-500'}>繁中</span>
      </span>
    </button>
  );
}