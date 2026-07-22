'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface LanguageToggleProps {
  currentLocale: string;
}

// Must match i18n.ts defaultLocale
const DEFAULT_LOCALE = 'zh-TW';
const SUPPORTED = ['en', 'zh-TW'] as const;

export default function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Strip the current locale prefix to get the path-without-locale
  const getPathWithoutLocale = (): string => {
    if (!pathname) return '/';
    const segments = pathname.split('/').filter(Boolean);
    const firstIsLocale =
      segments[0] === 'en' || segments[0] === 'zh-TW';
    if (firstIsLocale) {
      segments.shift();
    }
    return '/' + segments.join('/');
  };

  // Build the destination URL for the target locale
  const getLocalizedPath = (newLocale: string): string => {
    const basePath = getPathWithoutLocale();
    // With localePrefix: 'as-needed', the default locale has no prefix
    if (newLocale === DEFAULT_LOCALE) {
      return basePath === '/' ? '/' : basePath;
    }
    return basePath === '/' ? '/en' : `/en${basePath}`;
  };

  // Each label is its own clickable target that navigates to THAT locale
  const goTo = (newLocale: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newLocale === currentLocale) return; // already on this locale
    const newPath = getLocalizedPath(newLocale);
    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  const isEnActive = currentLocale === 'en';
  const isZhActive = currentLocale === 'zh-TW';

  return (
    <div
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/10 hover:border-purple-500/50 hover:bg-dark-700/50 transition-all duration-200 select-none ${
        isPending ? 'opacity-60 cursor-wait' : ''
      }`}
      title="Switch language / 切換語言"
    >
      <Globe className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors pointer-events-none" />

      {/* EN button — clicks navigate to English */}
      <button
        type="button"
        onClick={goTo('en')}
        disabled={isPending}
        aria-label="Switch to English"
        aria-current={isEnActive ? 'true' : 'false'}
        className={`text-xs font-medium px-1.5 py-0.5 rounded transition-all ${
          isEnActive
            ? 'text-white bg-white/10'
            : 'text-slate-500 hover:text-white hover:bg-white/5 cursor-pointer'
        }`}
      >
        EN
      </button>

      <span className="text-slate-600 pointer-events-none">/</span>

      {/* 繁中 button — clicks navigate to Traditional Chinese */}
      <button
        type="button"
        onClick={goTo('zh-TW')}
        disabled={isPending}
        aria-label="切換到繁體中文"
        aria-current={isZhActive ? 'true' : 'false'}
        className={`text-xs font-medium px-1.5 py-0.5 rounded transition-all ${
          isZhActive
            ? 'text-white bg-white/10'
            : 'text-slate-500 hover:text-white hover:bg-white/5 cursor-pointer'
        }`}
      >
        繁中
      </button>
    </div>
  );
}