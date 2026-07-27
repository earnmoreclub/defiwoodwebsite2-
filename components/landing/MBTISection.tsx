'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AIImage from '@/src/components/AIImage';

interface MBTISectionProps {
  locale: string;
}

export default function MBTISection({ locale }: MBTISectionProps) {
  const t = useTranslations('mbti');
  const basePath = locale === 'zh-TW' ? '' : '/en';

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-8 md:p-12 text-center overflow-hidden"
        >
          {/* AI-generated background */}
          <div className="absolute inset-0 opacity-40">
            <AIImage
              category="mbti"
              width={1024}
              height={768}
              rounded="3xl"
              className="w-full h-full"
            />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-950/90 via-dark-900/85 to-dark-950/90" />

          {/* Glass border */}
          <div className="absolute inset-0 rounded-3xl border border-white/10" />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-6">
            <Brain className="w-7 h-7 text-purple-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('title')}
          </h2>

          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            {t('subtitle')}
          </p>

          <Link
            href={`${basePath}/mbti`}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span className="relative z-10">{t('startTest')}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}