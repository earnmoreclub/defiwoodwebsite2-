'use client';

import { motion } from 'framer-motion';
import { useCopy, type CardItem } from './PhilosophyExperience';

export default function SituationalCards() {
  const copy = useCopy();
  const items: CardItem[] = copy.cards.items;

  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{copy.cards.title}</h2>
        <p className="mt-3 text-sm text-charcoal/60">{copy.cards.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.tag}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="group relative bg-cream-50 border border-charcoal/10 rounded-2xl p-7 cursor-default hover:border-charcoal/25 hover:shadow-sm transition-all duration-300"
          >
            {/* Tag */}
            <div className="text-[10px] uppercase tracking-editorial text-charcoal/30 font-medium mb-5">
              {item.tag}
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl text-charcoal leading-tight">{item.title}</h3>

            {/* Description */}
            <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">{item.description}</p>

            {/* Ritual badge */}
            <div className="mt-6 flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-sage-50 border border-sage-200/60 text-sage-700 text-xs">
                {item.ritual}
              </span>
              <div className="flex items-center gap-1 text-xs text-charcoal/30 group-hover:text-sage/60 transition-colors">
                <span className="text-[10px] uppercase tracking-editorial">Begin</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Subtle left accent line */}
            <div className="absolute left-0 top-6 bottom-6 w-px bg-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
