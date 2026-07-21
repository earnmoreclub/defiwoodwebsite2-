'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Philosophy', href: '/#philosophy' },
  { name: 'Articles', href: '/blog' },
  { name: 'Consultations', href: '/#book' },
  { name: 'About', href: '/#about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-stone-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl tracking-tight text-forest-800">
              Awareness Be
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#book"
              className="inline-flex items-center px-6 py-2.5 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial font-medium hover:bg-forest-700 transition-colors duration-300"
            >
              Book Session
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-forest-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-stone-200"
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm uppercase tracking-editorial text-stone-600 hover:text-forest-800 transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/#book"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial font-medium"
                >
                  Book Session
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}