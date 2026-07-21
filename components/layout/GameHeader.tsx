'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/src/components/LanguageToggle';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface GameHeaderProps {
  title: string;
}

export default function GameHeader({ title }: GameHeaderProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const sessionId = params.sessionId as string | undefined;
  const t = useTranslations('common.game');

  // Preserve current path (e.g., for johari session share links)
  const gameBasePath = sessionId ? `/johari/${sessionId}` : '/johari';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-xl border-b border-white/5" />
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={locale === 'zh-TW' ? '/' : '/en'} className="flex-shrink-0 group">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="absolute inset-0 w-6 h-6 bg-purple-400/30 blur-md" />
              </div>
              <h1 className="font-display text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                <span className="hidden sm:inline">
                  {t('siteTitle')}
                </span>
                <span className="sm:hidden">{t('siteTitleShort')}</span>
              </h1>
            </div>
          </Link>

          {/* Game Title (center) */}
          <div className="hidden md:block text-sm uppercase tracking-editorial text-slate-400">
            {title}
          </div>

          {/* Right: Back + Language */}
          <div className="flex items-center gap-4">
            <Link
              href={locale === 'zh-TW' ? `${gameBasePath}` : `/en${gameBasePath}`}
              className="flex items-center gap-1.5 text-xs uppercase tracking-editorial text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('restart')}</span>
            </Link>
            <LanguageToggle currentLocale={locale} />
          </div>
        </div>
      </nav>
    </header>
  );
}
