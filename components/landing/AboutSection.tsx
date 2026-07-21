'use client';

import { useTranslations } from 'next-intl';

interface AboutSectionProps {
  locale: string;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
          {t('story')}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-8 leading-tight">
          {t('headline')}
        </h2>
        <div className="space-y-6 text-stone-600 leading-relaxed max-w-2xl mx-auto">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
        </div>
        <div className="mt-12 pt-12 border-t border-stone-200">
          <p className="text-sm text-stone-500 italic max-w-xl mx-auto">
            {t('quote')}
          </p>
          <p className="text-xs uppercase tracking-editorial text-amber-500 mt-4">
            — The Awareness Be Team
          </p>
        </div>
      </div>
    </section>
  );
}
