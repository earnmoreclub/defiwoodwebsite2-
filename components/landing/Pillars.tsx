'use client';

import { motion } from 'framer-motion';
import { Activity, Moon, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PillarsProps {
  locale: string;
}

const pillarConfig = [
  { key: 'metabolic', icon: Activity, color: 'forest' },
  { key: 'stress', icon: Moon, color: 'amber' },
  { key: 'consultations', icon: Users, color: 'forest' },
] as const;

export default function Pillars({ locale: _locale }: PillarsProps) {
  const t = useTranslations('pillars');

  return (
    <section id="philosophy" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            {t('subtitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-12 h-px bg-amber-400 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillarConfig.map((pillar, index) => {
            const Icon = pillar.icon;
            const isForest = pillar.color === 'forest';
            return (
              <motion.div
                key={pillar.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`relative p-8 rounded-2xl border border-stone-200 bg-white transition-all duration-300 group-hover:shadow-lg ${
                  isForest ? 'group-hover:border-forest-300' : 'group-hover:border-amber-300'
                }`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    isForest ? 'bg-forest-100' : 'bg-amber-100'
                  }`}>
                    <Icon className={`w-7 h-7 ${isForest ? 'text-forest-700' : 'text-amber-600'}`} />
                  </div>

                  <h3 className="font-serif text-xl text-stone-900 mb-4 leading-snug">
                    {t(`items.${pillar.key}.title`)}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {t(`items.${pillar.key}.description`)}
                  </p>

                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                    isForest ? 'bg-forest-400' : 'bg-amber-400'
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
