'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NavbarProps {
  locale: string;
}

const localeNames: Record<string, string> = {
  'zh-TW': '繁中',
  'en': 'EN',
};

export default function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale === 'zh-TW' ? '' : newLocale;
    return segments.join('/').replace(/\/+/g, '/');
  };

  const switchLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-stone-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={locale === 'zh-TW' ? '/' : '/en'} className="flex-shrink-0">
            <h1 className="font-serif text-2xl tracking-tight text-forest-800">
              Awareness Be
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={locale === 'zh-TW' ? '/#philosophy' : '/en#philosophy'}
              className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
            >
              {t('philosophy')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/blog' : '/en/blog'}
              className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
            >
              {t('articles')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/#book' : '/en#book'}
              className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
            >
              {t('consultations')}
            </Link>
            <Link
              href={locale === 'zh-TW' ? '/#about' : '/en#about'}
              className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
            >
              {t('about')}
            </Link>
            
            {/* Language Switcher */}
            <Link
              href={getLocalizedPath(switchLocale)}
              className="flex items-center gap-1 text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
            >
              <Globe className="w-4 h-4" />
              {localeNames[switchLocale]}
            </Link>

            <Link
              href={locale === 'zh-TW' ? '/#book' : '/en#book'}
              className="inline-flex items-center px-6 py-2.5 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial font-medium hover:bg-forest-700 transition-colors duration-300"
            >
              {t('bookSession')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-forest-800 transition-colors"
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
              className="md:hidden py-4 border-t border-stone-200"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href={locale === 'zh-TW' ? '/#philosophy' : '/en#philosophy'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                >
                  {t('philosophy')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/blog' : '/en/blog'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                >
                  {t('articles')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#book' : '/en#book'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                >
                  {t('consultations')}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#about' : '/en#about'}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                >
                  {t('about')}
                </Link>
                <Link
                  href={getLocalizedPath(switchLocale)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'zh-TW' ? 'English' : '繁體中文'}
                </Link>
                <Link
                  href={locale === 'zh-TW' ? '/#book' : '/en#book'}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial font-medium"
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
