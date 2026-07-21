'use client';

import { motion } from 'framer-motion';
import { Brain, Moon, Users, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';

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
}

const pillarConfig: readonly PillarConfig[] = [
  { 
    key: 'metabolic', 
    Icon: Brain, 
    gradient: 'from-purple-500/20 to-purple-700/10',
    borderColor: 'border-purple-500/30',
    borderHover: 'group-hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/30',
    ringColor: 'via-purple-400',
  },
  { 
    key: 'stress', 
    Icon: Moon, 
    gradient: 'from-cyan-500/20 to-cyan-700/10',
    borderColor: 'border-cyan-500/30',
    borderHover: 'group-hover:border-cyan-500/40',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/30',
    ringColor: 'via-cyan-400',
  },
  { 
    key: 'consultations', 
    Icon: Users, 
    gradient: 'from-emerald-500/20 to-emerald-700/10',
    borderColor: 'border-emerald-500/30',
    borderHover: 'group-hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/30',
    ringColor: 'via-emerald-400',
  },
];

export default function Pillars({ locale: _locale }: PillarsProps) {
  const t = useTranslations('pillars');

  return (
    <section id="philosophy" className="relative py-24 bg-dark-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-cyan-400 mb-4 px-4 py-1.5 glass rounded-full">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            {t('subtitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillarConfig.map((pillar, index) => {
            const { Icon } = pillar;
            return (
              <motion.div
                key={pillar.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className={`relative p-8 rounded-3xl glass border-white/10 transition-all duration-500 group-hover:scale-[1.03] ${pillar.borderHover} group-hover:shadow-2xl ${pillar.glow} overflow-hidden`}>
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Animated border accent */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${pillar.ringColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl ${pillar.iconBg} border ${pillar.borderColor} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className={`w-8 h-8 ${pillar.iconColor}`} />
                    </div>

                    <h3 className="font-serif text-2xl text-white mb-4 leading-snug">
                      {t(`items.${pillar.key}.title`)}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {t(`items.${pillar.key}.description`)}
                    </p>

                    <div className={`inline-flex items-center text-xs uppercase tracking-editorial ${pillar.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      Explore <ArrowUpRight className="w-3 h-3 ml-1" />
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