'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sparkles, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/src/components/LanguageToggle';

interface NavbarProps {
  locale: string;
  userLevel?: number;
  userXp?: number;
}

const localeNames: Record<string, string> = {
  'zh-TW': '繁中',
  'en': 'EN',
};

export default function Navbar({ locale, userLevel = 1, userXp = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');
  const tp = useTranslations('userProgress');
  const pathname = usePathname();

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale === 'zh-TW' ? '' : newLocale;
    return segments.join('/').replace(/\/+/g, '/');
  };

  const switchLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
  const isZhTw = locale === 'zh-TW';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass navbar background */}
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-xl border-b border-white/5" />
      
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Self-Discovery / 內在探索 */}
          <Link href={locale === 'zh-TW' ? '/' : '/en'} className="flex-shrink-0 group">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="absolute inset-0 w-6 h-6 bg-purple-400/30 blur-md group-hover:bg-purple-300/40 transition-all" />
              </div>
              <h1 className="font-display text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                <span className="hidden sm:inline">
                  {isZhTw ? '內在探索' : 'Self-Discovery'}
                </span>
                <span className="sm:hidden">S-D</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={locale === 'zh-TW' ? '/#philosophy' : '/en#philosophy'}
              className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors duration-200"
            >
              {t('philosophy')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/#book' : '/en#book'}
              className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors duration-200"
            >
              {t('consultations')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/#about' : '/en#about'}
              className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors duration-200"
            >
              {t('about')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/tests' : '/en/tests'}
              className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors duration-200"
            >
              {t('tests')}
            </Link>
            
            {/* Language Switcher */}
            <LanguageToggle currentLocale={locale} />

            {/* User Progress Indicator - Level & XP */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-dark-800/50 border border-white/10">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-white">
                  {tp('level')} {userLevel}
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-amber-400">{userXp}</span>
                <span className="text-xs text-slate-500">{tp('xp')}</span>
              </div>
            </div>

            <Link
              href={locale === 'zh-TW' ? '/#book' : '/en#book'}
              className="group relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs uppercase tracking-editorial font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <span className="relative z-10">{t('bookSession')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass rounded-2xl mt-2 overflow-hidden"
            >
              <div className="p-6 flex flex-col space-y-4">
                <Link
                  href={locale === 'zh-TW' ? '/#philosophy' : '/en#philosophy'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors py-2"
                >
                  {t('philosophy')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#book' : '/en#book'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors py-2"
                >
                  {t('consultations')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#about' : '/en#about'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors py-2"
                >
                  {t('about')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/tests' : '/en/tests'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors py-2"
                >
                  {t('tests')}
                </Link>
                <Link
                  href={getLocalizedPath(switchLocale)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-editorial text-slate-400 hover:text-white transition-colors py-2"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'zh-TW' ? 'English' : '繁體中文'}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#book' : '/en#book'}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs uppercase tracking-editorial font-medium rounded-lg"
                >
                  {t('bookSession')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
