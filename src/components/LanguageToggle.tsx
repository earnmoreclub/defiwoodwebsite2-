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

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = currentLocale === 'zh-TW' ? 'en' : 'zh-TW';
  const isZhTw = currentLocale === 'zh-TW';

  const getLocalizedPath = (newLocale: string) => {
    if (!pathname) return '/';

    const segments = pathname.split('/').filter(Boolean);
    const firstIsLocale = segments[0] === 'en' || segments[0] === 'zh-TW';

    if (firstIsLocale) {
      segments.shift();
    }

    const path = '/' + segments.join('/');

    if (newLocale === 'zh-TW') {
      return path === '/' ? '/' : path;
    }
    return path === '/' ? '/en' : `/en${path}`;
  };

  const handleToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const newPath = getLocalizedPath(switchLocale);
    startTransition(() => {
      router.replace(newPath, { scroll: false });
    });
  };

  return (
    <a
      href={getLocalizedPath(switchLocale)}
      onClick={handleToggle}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/10 hover:border-purple-500/50 hover:bg-dark-700/50 transition-all duration-200 cursor-pointer select-none ${
        isPending ? 'opacity-60 pointer-events-none' : ''
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
    </a>
  );
}