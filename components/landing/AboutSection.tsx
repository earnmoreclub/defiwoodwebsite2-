'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  locale: string;
}

export default function AboutSection({ locale: _locale }: AboutSectionProps) {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative py-24 bg-dark-950 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-emerald-400 mb-4 px-4 py-1.5 glass rounded-full">
            <Sparkles className="w-3 h-3" />
            {t('story')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-8 leading-tight text-balance">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              {t('headline')}
            </span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-12" />

          <div className="space-y-6 text-slate-300 leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
            <p>{t('p3')}</p>
          </div>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 relative glass-strong rounded-3xl p-8 md:p-12"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Quote className="w-5 h-5 text-white" />
            </div>
            <p className="text-lg md:text-xl text-white italic max-w-2xl mx-auto leading-relaxed">
              {t('quote')}
            </p>
            <p className="text-xs uppercase tracking-editorial text-cyan-400 mt-6">
              — The Awareness Be Team
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}