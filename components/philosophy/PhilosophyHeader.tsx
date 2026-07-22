'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopy } from './PhilosophyExperience';

type Props = { ctaSlot?: React.ReactNode };

export default function PhilosophyHeader({ ctaSlot }: Props) {
  const copy = useCopy();
  const [open, setOpen] = useState(false);

  const linkClass =
    'text-[11px] uppercase tracking-editorial text-charcoal/70 hover:text-charcoal transition-colors';

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="absolute inset-0 bg-cream-50/70 backdrop-blur-md border-b border-charcoal/5" />
      <nav className="relative max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="#" className="flex items-baseline gap-3">
            <span className="font-serif text-lg tracking-wide text-charcoal">{copy.brand}</span>
            <span className="text-[10px] uppercase tracking-editorial text-charcoal/40">{copy.est}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#check-in" className={linkClass}>{copy.nav.rituals}</a>
            <Link
              href={
                typeof window !== 'undefined'
                  ? window.location.pathname.startsWith('/en')
                    ? '/en/journal'
                    : '/journal'
                  : '/journal'
              }
              className={linkClass}
            >
              {copy.nav.journal}
            </Link>
            <Link
              href={
                typeof window !== 'undefined'
                  ? window.location.pathname.startsWith('/en')
                    ? '/en/sourcing'
                    : '/sourcing'
                  : '/sourcing'
              }
              className={linkClass}
            >
              {copy.nav.standard}
            </Link>
            <Link
              href="#check-in"
              className="inline-flex items-center px-5 py-2 rounded-full bg-charcoal text-cream-50 text-[11px] uppercase tracking-editorial hover:bg-sage-700 transition-colors"
            >
              {copy.cta.begin}
            </Link>
            {ctaSlot}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-charcoal"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-charcoal/5 bg-cream-50"
            >
              <div className="py-6 flex flex-col gap-4">
                <a href="#check-in" onClick={() => setOpen(false)} className={linkClass}>
                  {copy.nav.rituals}
                </a>
                <Link
                  href="/journal"
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {copy.nav.journal}
                </Link>
                <Link
                  href="/sourcing"
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {copy.nav.standard}
                </Link>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="#check-in"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center px-5 py-2 rounded-full bg-charcoal text-cream-50 text-[11px] uppercase tracking-editorial"
                  >
                    {copy.cta.begin}
                  </Link>
                  {ctaSlot}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
