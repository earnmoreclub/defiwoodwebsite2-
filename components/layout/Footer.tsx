'use client';

import Link from 'next/link';
import { Heart, Mail, Instagram, Sparkles, Phone, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const basePath = locale === 'zh-TW' ? '' : '/en';

  return (
    <footer className="relative bg-dark-900 border-t border-white/[0.08] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[480px] h-[480px] bg-purple-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-cyan-500/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-300" />
                <div className="absolute inset-0 w-6 h-6 bg-purple-400/30 blur-md" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl text-white tracking-tight">Awareness Be</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-7">
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
            <h3 className="text-[11px] uppercase tracking-editorial mb-6 text-cyan-300 font-semibold">
              {t('explore')}
            </h3>
            <ul className="space-y-3">
              {[
                { href: `${basePath}/#philosophy`, label: t('companyLinks.philosophy') },
                { href: `${basePath}/#book`, label: t('companyLinks.consultations') },
                { href: `${basePath}/#about`, label: t('companyLinks.about') },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-cyan-400 mr-0 group-hover:mr-2.5 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] uppercase tracking-editorial mb-6 text-emerald-300 font-semibold">
              {t('connect')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:services@awarenessbe.com" className="hover:text-white transition-colors">
                  services@awarenessbe.com
                </a>
              </li>
              <li className="flex items-center space-x-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/85252380490" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  (+852) 5238 0490
                </a>
              </li>
              <li className="flex items-center space-x-2.5 text-sm text-slate-400">
                <Instagram className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="#" className="hover:text-white transition-colors">
                  {t('contactLinks.instagram')}
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem / Shop */}
          <div>
            <h3 className="text-[11px] uppercase tracking-editorial mb-6 text-purple-300 font-semibold">
              {t('shop.footerTitle')}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {t('shop.footerSubtitle')}
            </p>
            <a
              href="https://awarenessbe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-purple-400/20 group-hover:border-purple-300/50 ring-1 ring-white/5 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <span className="w-6 h-6 rounded-full bg-purple-400/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-purple-300" />
              </span>
              <span className="text-[11px] uppercase tracking-editorial text-purple-200 font-semibold">
                {t('shop.footerCta')}
              </span>
              <ExternalLink className="w-3 h-3 text-purple-300 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-slate-500">
              {t('copyright')}
            </p>
            <p className="text-xs text-slate-600 text-center md:text-right max-w-xl leading-relaxed">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
