'use client';

import Link from 'next/link';
import { Heart, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  const basePath = locale === 'zh-TW' ? '' : '/en';

  return (
    <footer className="bg-forest-800 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl mb-4">Awareness Be</h2>
            <p className="text-cream-100/80 text-sm leading-relaxed max-w-md mb-6">
              {t('tagline')}
            </p>
            <div className="flex items-center space-x-2 text-cream-100/60 text-xs">
              <span>{t('madeWith')}</span>
              <Heart className="w-3 h-3 text-amber-300" />
              <span>{t('madeFor')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-cream-100/60">
              {t('explore')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`${basePath}/#philosophy`} className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  {t('companyLinks.philosophy')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/blog`} className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  {t('companyLinks.articles')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/#book`} className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  {t('companyLinks.consultations')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/#about`} className="text-sm text-cream-100/80 hover:text-cream-50 transition-colors">
                  {t('companyLinks.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-cream-100/60">
              {t('connect')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-cream-100/80">
                <Mail className="w-4 h-4 text-amber-300" />
                <a href="mailto:hello@awarenessbe.com" className="hover:text-cream-50 transition-colors">
                  hello@awarenessbe.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-cream-100/80">
                <Link href={`${basePath}/#book`} className="hover:text-cream-50 transition-colors">
                  {t('companyLinks.consultations')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream-100/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-cream-100/50">
              {t('copyright')}
            </p>
            <p className="text-xs text-cream-100/40 text-center md:text-right max-w-xl">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
