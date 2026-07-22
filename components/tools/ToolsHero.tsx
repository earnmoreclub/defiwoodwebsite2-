'use client';

import { motion } from 'framer-motion';
import { ArrowDown, BookOpen } from 'lucide-react';

export default function ToolsHero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Editorial photographic panel */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#F7F3EB] to-[#FDFBF7]" />
        <div
          className="absolute right-[-10%] top-[10%] w-[55%] h-[80%] rounded-[3rem] opacity-90"
          style={{
            background:
              'linear-gradient(135deg, #E7E1D8 0%, #D6CFC2 40%, #C9C0AE 100%)',
            filter: 'blur(0.5px)',
          }}
        />
        <div
          className="absolute right-[10%] top-[28%] w-[36%] h-[44%] rounded-[2rem]"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(255,255,255,0.6), transparent 60%), radial-gradient(ellipse at bottom right, rgba(120,134,107,0.18), transparent 65%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="text-[11px] tracking-[0.28em] uppercase text-stone-500 mb-6">
            The Quiet Toolkit · Est. 2026
          </p>

          <h1 className="font-serif text-[44px] sm:text-[58px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-stone-900">
            A quieter
            <br />
            <span className="italic font-normal text-[#78866B]">next step.</span>
          </h1>

          <p className="mt-8 text-[17px] leading-[1.7] text-stone-600 max-w-[52ch]">
            Tell us what feels present, where you are, and how much time you have.
            Receive one considered ritual — without adding more noise.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#check-in"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-stone-900 text-[#FDFBF7] text-[14px] font-medium hover:bg-stone-800 transition-colors"
            >
              Find my ritual
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="/journal"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-transparent text-stone-900 text-[14px] font-medium border border-stone-300 hover:border-stone-500 transition-colors"
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
              Explore the journal
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6 text-[12px] text-stone-400 tracking-[0.16em] uppercase">
            <span>Private by design</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>No login</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>Browser only</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block absolute right-12 top-32 max-w-[300px] text-right"
        >
          <div className="border-r border-stone-300 pr-6 py-4">
            <p className="font-serif text-[15px] italic text-stone-700 leading-relaxed">
              “You do not need another app. You need one small, true thing.”
            </p>
            <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-stone-400">
              — House Note, Vol. 01
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}