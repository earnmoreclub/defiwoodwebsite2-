'use client';

import { motion } from 'framer-motion';
import { Activity, Moon, Users } from 'lucide-react';

const pillars = [
  {
    icon: Activity,
    title: 'Metabolic & Gut Vitality',
    description: 'Rebalance your core biometrics through tailored nutrition protocols, biome optimization, and metabolic tracking.',
    color: 'forest',
  },
  {
    icon: Moon,
    title: 'Stress Resilience & Sleep',
    description: 'Master your nervous system with clinical breathwork frameworks and circadian rhythm alignment.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Personalized Wellness Consultations',
    description: 'Direct access to expert guidance, actionable biometrics analysis, and custom supplement blueprints.',
    color: 'forest',
  },
];

export default function Pillars() {
  return (
    <section id="philosophy" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            Our Approach
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
            Our Focus Areas
          </h2>
          <div className="w-12 h-px bg-amber-400 mx-auto" />
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`relative p-8 rounded-2xl border border-stone-200 bg-white transition-all duration-300 group-hover:border-${pillar.color === 'forest' ? 'forest-300' : 'amber-300'} group-hover:shadow-lg`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  pillar.color === 'forest' ? 'bg-forest-100' : 'bg-amber-100'
                }`}>
                  <pillar.icon className={`w-7 h-7 ${
                    pillar.color === 'forest' ? 'text-forest-700' : 'text-amber-600'
                  }`} />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl text-stone-900 mb-4 leading-snug">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-stone-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>

                {/* Hover Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  pillar.color === 'forest' ? 'bg-forest-400' : 'bg-amber-400'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}