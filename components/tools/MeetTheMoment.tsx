'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MEET_MOMENT_CARDS } from '@/lib/tools-data';

export default function MeetTheMoment() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <header className="max-w-2xl mb-14">
          <p className="text-[11px] tracking-[0.28em] uppercase text-stone-500 mb-4">
            Meet the Moment
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-[-0.02em] leading-[1.05]">
            A few small shortcuts
            <br />
            <span className="italic font-normal text-[#78866B]">for ordinary hours.</span>
          </h2>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEET_MOMENT_CARDS.map((c, i) => (
            <motion.a
              key={c.index}
              href="#breath"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative block p-6 lg:p-7 rounded-3xl bg-white border border-stone-200/80 hover:border-stone-400 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-serif text-[15px] tracking-[0.2em] text-stone-400">
                  {c.index}
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 group-hover:rotate-45 transition-all duration-300" />
              </div>
              <h3 className="font-serif text-[20px] text-stone-900 leading-tight mb-3 tracking-[-0.01em]">
                {c.title}
              </h3>
              <p className="text-[13px] text-stone-500 leading-[1.7]">{c.note}</p>

              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-stone-400">
                <span>Open ritual</span>
                <span className="w-6 h-px bg-stone-300 group-hover:bg-stone-700 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}