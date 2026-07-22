'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from './CartProvider';
import CartSlideOver from './CartSlideOver';

const navLinks = [
  { label: 'Rituals', href: '#check-in' },
  { label: 'The Journal', href: '/journal' },
  { label: 'Our Standard', href: '/sourcing' },
];

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'backdrop-blur-xl bg-[#FDFBF7]/80 border-b border-stone-200/60'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <span className="font-serif text-[15px] tracking-[0.18em] text-stone-900">
              AWARENESS&nbsp;BE
            </span>
            <span className="hidden sm:inline-block text-[11px] tracking-[0.2em] text-stone-400">
              · 2026
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[14px] text-stone-600 hover:text-stone-900 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#check-in"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-stone-900 text-[#FDFBF7] text-[13px] font-medium hover:bg-stone-800 transition-colors"
            >
              Begin
            </a>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} items`}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-stone-300/80 hover:border-stone-400 text-stone-700 transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#78866B] text-white text-[10px] font-semibold flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-stone-300/80 text-stone-700"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-stone-200/60 bg-[#FDFBF7]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-stone-700 text-[15px]"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#check-in"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-full bg-stone-900 text-[#FDFBF7] text-[14px]"
                >
                  Begin
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartSlideOver open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}