'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import PexelsImage from "@/src/components/PexelsImage";

interface AboutSectionProps {
  locale: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function AboutSection({ locale: _locale }: AboutSectionProps) {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative py-28 sm:py-32 bg-dark-950 overflow-hidden">
      {/* Refined background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="text-center"
        >
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-emerald-300 mb-5 px-4 py-1.5 glass rounded-full font-medium"
          >
            <Sparkles className="w-3 h-3" />
            {t('story')}
          </motion.span>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-[1.05] tracking-tight text-balance"
          >
            <span className="bg-gradient-to-br from-emerald-200 via-cyan-100 to-purple-200 bg-clip-text text-transparent">
              {t('headline')}
            </span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent mx-auto mb-14 origin-center"
          />

          {/* Body copy */}
          <div className="space-y-5 text-slate-300 leading-relaxed max-w-2xl mx-auto text-left sm:text-center mb-20">
            {[t('p1'), t('p2'), t('p3')].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: EASE_OUT_EXPO }}
                className="text-base sm:text-[17px]"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {[
              { category: 'nature', delay: 0 },
              { category: 'meditation', delay: 0.1 },
              { category: 'wellness', delay: 0.2 },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: img.delay, ease: EASE_OUT_QUART }}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/25 transition-all duration-500 hover:-translate-y-1"
              >
                <PexelsImage
                  category={img.category}
                  width={1024}
                  height={768}
                  rounded="2xl"
                  className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="relative glass-strong rounded-3xl p-8 md:p-14 ring-1 ring-white/10"
          >
            {/* Glow accents */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 ring-4 ring-dark-950">
                <Quote className="w-6 h-6 text-white" />
              </div>

              <p className="text-lg md:text-xl text-white italic max-w-2xl mx-auto leading-relaxed pt-4">
                {t('quote')}
              </p>
              <p className="text-[11px] uppercase tracking-editorial text-cyan-300 mt-6 font-semibold">
                — The Awareness Be Team
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
