'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PexelsImage from "@/src/components/PexelsImage";

interface MBTISectionProps {
  locale: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function MBTISection({ locale }: MBTISectionProps) {
  const t = useTranslations('mbti');
  const basePath = locale === 'zh-TW' ? '' : '/en';

  return (
    <section className="relative py-28 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/[0.08] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-purple-500/10"
        >
          {/* Background image */}
          <div className="absolute inset-0 opacity-50">
            <PexelsImage
              category="mbti"
              width={1024}
              height={768}
              rounded="3xl"
              className="w-full h-full"
            />
          </div>

          {/* Layered overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-950/92 via-dark-900/85 to-dark-950/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-dark-950/40" />

          {/* Glow accents */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" aria-hidden="true" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-7 ring-1 ring-white/10"
            >
              <Brain className="w-8 h-8 text-purple-300" />
            </motion.div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-5 tracking-tight text-balance">
              <span className="bg-gradient-to-br from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              {t('subtitle')}
            </p>

            <Link
              href={`${basePath}/mbti`}
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.03] active:scale-[0.98] ring-1 ring-white/15"
            >
              <span className="relative z-10">{t('startTest')}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
