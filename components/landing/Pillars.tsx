'use client';

import { motion } from 'framer-motion';
import { Brain, Moon, Users, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';
import PexelsImage from "@/src/components/PexelsImage";

interface PillarsProps {
  locale: string;
}

interface PillarConfig {
  key: 'metabolic' | 'stress' | 'consultations';
  Icon: ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  borderHover: string;
  iconBg: string;
  iconColor: string;
  glow: string;
  ringColor: string;
  imageCategory: 'hero' | 'meditation' | 'booking';
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

const pillarConfig: readonly PillarConfig[] = [
  {
    key: 'metabolic',
    Icon: Brain,
    gradient: 'from-purple-500/20 to-purple-700/5',
    borderColor: 'border-purple-400/25',
    borderHover: 'group-hover:border-purple-400/50',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-300',
    glow: 'group-hover:shadow-purple-500/30',
    ringColor: 'via-purple-400',
    imageCategory: 'hero',
  },
  {
    key: 'stress',
    Icon: Moon,
    gradient: 'from-cyan-500/20 to-cyan-700/5',
    borderColor: 'border-cyan-400/25',
    borderHover: 'group-hover:border-cyan-400/50',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-300',
    glow: 'group-hover:shadow-cyan-500/30',
    ringColor: 'via-cyan-400',
    imageCategory: 'meditation',
  },
  {
    key: 'consultations',
    Icon: Users,
    gradient: 'from-emerald-500/20 to-emerald-700/5',
    borderColor: 'border-emerald-400/25',
    borderHover: 'group-hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-300',
    glow: 'group-hover:shadow-emerald-500/30',
    ringColor: 'via-emerald-400',
    imageCategory: 'booking',
  },
];

export default function Pillars({ locale: _locale }: PillarsProps) {
  const t = useTranslations('pillars');

  return (
    <section id="philosophy" className="relative py-28 sm:py-32 bg-dark-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-cyan-300 mb-5 px-4 py-1.5 glass rounded-full font-medium"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            {t('subtitle')}
          </motion.span>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-5 tracking-tight text-balance">
            <span className="bg-gradient-to-br from-white via-purple-100 to-white bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent mx-auto origin-center"
          />
        </motion.div>

        {/* Pillar cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
          {pillarConfig.map((pillar, index) => {
            const { Icon } = pillar;
            return (
              <motion.div
                key={pillar.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: EASE_OUT_EXPO }}
                className="group relative"
              >
                <div
                  className={`relative p-8 rounded-3xl glass border-white/10 transition-all duration-700 group-hover:scale-[1.03] group-hover:-translate-y-1 ${pillar.borderHover} group-hover:shadow-2xl ${pillar.glow} overflow-hidden min-h-[320px] ring-1 ring-white/5`}
                >
                  {/* Background image */}
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                    <PexelsImage
                      category={pillar.imageCategory}
                      width={1024}
                      height={768}
                      rounded="3xl"
                      className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-950/85 via-dark-900/75 to-dark-950/85" />

                  {/* Color hover wash */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    aria-hidden="true"
                  />

                  {/* Animated top border accent */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${pillar.ringColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl ${pillar.iconBg} border ${pillar.borderColor} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                    >
                      <Icon className={`w-8 h-8 ${pillar.iconColor}`} />
                    </div>

                    <h3 className="font-serif text-2xl lg:text-[1.7rem] text-white mb-4 leading-snug tracking-tight">
                      {t(`items.${pillar.key}.title`)}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300 transition-colors duration-500">
                      {t(`items.${pillar.key}.description`)}
                    </p>

                    <div
                      className={`inline-flex items-center text-[11px] uppercase tracking-editorial ${pillar.iconColor} opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1`}
                    >
                      Explore
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
