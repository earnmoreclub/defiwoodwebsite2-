'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCopy } from './PhilosophyExperience';
import PexelsImage from "@/src/components/PexelsImage";

type Props = { scrollTo: string };

export default function PhilosophyHero({ scrollTo }: Props) {
  const copy = useCopy();

  const onScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(scrollTo);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #1C1917 1px, transparent 1.5px), radial-gradient(circle at 80% 60%, #78866B 1px, transparent 1.5px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Soft sage glow */}
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-sage/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-clay/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[10px] uppercase tracking-editorial text-sage-600 mb-8"
          >
            {copy.brand} — {copy.est}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-charcoal text-balance"
          >
            {copy.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 max-w-xl text-lg md:text-xl text-charcoal/70 leading-relaxed font-light"
          >
            {copy.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href={scrollTo}
              onClick={onScrollClick}
              className="inline-flex items-center px-7 py-3.5 rounded-full bg-charcoal text-cream-50 text-sm font-medium hover:bg-sage-700 transition-colors"
            >
              {copy.cta.findRitual}
            </a>
            <Link
              href="/journal"
              className="inline-flex items-center px-7 py-3.5 rounded-full border border-charcoal/20 text-charcoal text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {copy.cta.exploreJournal}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-charcoal/10 shadow-[0_30px_60px_-30px_rgba(28,25,23,0.3)]">
            {/* AI-generated background image */}
            <div className="absolute inset-0">
              <PexelsImage
                category="philosophy"
                width={800}
                height={1000}
                rounded="2xl"
                className="w-full h-full"
              />
            </div>
            {/* Warm overlay for editorial feel */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-sage-100/40 via-cream-100/60 to-clay/30"
            />
            {/* Editorial overlay content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-charcoal">
              <div className="text-[10px] uppercase tracking-editorial opacity-60">
                A field guide
              </div>
              <div className="font-serif text-2xl mt-2 leading-tight">
                Quiet rituals, in three breaths.
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs opacity-70">
                <span className="w-8 h-px bg-charcoal/40" />
                <span>Read in 4 minutes</span>
              </div>
            </div>
            {/* Visual mark */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-charcoal/30 flex items-center justify-center font-serif text-charcoal">
              ab
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
