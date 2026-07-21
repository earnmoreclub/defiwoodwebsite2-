'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-cream-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1C2B26 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-forest-800/5 rounded-full mb-8"
            >
              <span className="text-xs uppercase tracking-editorial text-forest-800">
                Est. 2026 • Holistic Health & Metabolic Wellness
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.1] mb-6"
            >
              Cultivate Clarity.{' '}
              <span className="text-forest-800">Restore Balance.</span>
              <br />
              Science-Backed Wellness for Modern Living.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-stone-600 leading-relaxed mb-10 max-w-xl"
            >
              Awareness Be bridges evidence-based metabolic health, gut resilience, 
              and conscious living to help you thrive from the inside out.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/#book"
                className="inline-flex items-center justify-center px-8 py-4 bg-forest-800 text-cream-50 text-sm uppercase tracking-editorial font-medium hover:bg-forest-700 transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Schedule 1-on-1 Consultation
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-8 py-4 border border-stone-300 text-stone-800 text-sm uppercase tracking-editorial font-medium hover:border-forest-800 hover:text-forest-800 transition-all duration-300 group"
              >
                <BookOpen className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Explore Insights
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex items-center space-x-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-forest-100 border-2 border-cream-50 flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 text-forest-600" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone-600">
                Trusted by <span className="font-medium text-forest-800">5,000+</span> individuals 
                seeking evidence-based vitality
              </p>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-forest-100/50 to-amber-100/30 rounded-3xl transform rotate-3" />
            <div className="relative bg-gradient-to-br from-forest-50 to-amber-50/50 rounded-3xl p-12 aspect-[4/5] flex flex-col justify-center">
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-24 h-24 border border-forest-200 rounded-full" />
              <div className="absolute bottom-12 left-8 w-32 h-32 border border-amber-200 rounded-full" />
              
              {/* Icon Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-forest-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-editorial text-forest-700">Metabolic Health</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-editorial text-amber-700">Gut Resilience</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-editorial text-amber-700">Sleep Optimization</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-forest-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-editorial text-forest-700">Longevity</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-forest-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}