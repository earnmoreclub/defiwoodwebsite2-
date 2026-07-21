'use client';

import Link from 'next/link';
import { Heart, Mail, Instagram, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  const basePath = locale === 'zh-TW' ? '' : '/en';

  return (
    <footer className="relative bg-dark-900 border-t border-white/5 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div className="absolute inset-0 w-6 h-6 bg-purple-400/30 blur-md" />
              </div>
              <h2 className="font-display text-2xl text-white">Awareness Be</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              {t('tagline')}
            </p>
            <div className="flex items-center space-x-2 text-slate-500 text-xs">
              <span>{t('madeWith')}</span>
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              <span>{t('madeFor')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-cyan-400 font-medium">
              {t('explore')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`${basePath}/#philosophy`} className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                  {t('companyLinks.philosophy')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/blog`} className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                  {t('companyLinks.articles')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/#book`} className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                  {t('companyLinks.consultations')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/#about`} className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-px bg-purple-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                  {t('companyLinks.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-editorial mb-6 text-emerald-400 font-medium">
              {t('connect')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-slate-400">
                <Instagram className="w-4 h-4 text-emerald-400" />
                <a href="#" className="hover:text-white transition-colors">
                  {t('contactLinks.instagram')}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a href="mailto:hello@awarenessbe.com" className="hover:text-white transition-colors">
                  {t('contactLinks.email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-slate-500">
              {t('copyright')}
            </p>
            <p className="text-xs text-slate-600 text-center md:text-right max-w-xl">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}