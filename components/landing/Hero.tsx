'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen, Sparkles, Eye, Brain, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AIImage from '@/src/components/AIImage';

interface HeroProps {
  locale: string;
}

const dimensionIcons = [
  { 
    Icon: Brain,
    label: { 'zh-TW': '心智清晰', 'en': 'Mental Clarity' }, 
    gradient: 'from-purple-500/20 to-purple-700/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-300',
    glow: 'shadow-purple-500/20',
  },
  { 
    Icon: Eye,
    label: { 'zh-TW': '自我覺察', 'en': 'Inner Vision' }, 
    gradient: 'from-cyan-500/20 to-cyan-700/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-300',
    glow: 'shadow-cyan-500/20',
  },
  { 
    Icon: Heart,
    label: { 'zh-TW': '情緒韌性', 'en': 'Emotional Resilience' }, 
    gradient: 'from-emerald-500/20 to-emerald-700/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-300',
    glow: 'shadow-emerald-500/20',
  },
  { 
    Icon: Sparkles,
    label: { 'zh-TW': '蛻變升級', 'en': 'Transcendence' }, 
    gradient: 'from-purple-500/20 via-cyan-500/20 to-emerald-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-300',
    glow: 'shadow-purple-500/20',
  },
];

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('hero');
  const basePath = locale === 'zh-TW' ? '' : '/en';
  const labelLocale = locale === 'zh-TW' ? 'zh-TW' : 'en';

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden pt-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* Floating glow orbs */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
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
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-xs uppercase tracking-editorial text-slate-300">
                {t('badge')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 text-balance"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {t('headline')}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl"
            >
              {t('subheadline')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={`${basePath}/#book`}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('primaryCta')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border-2 border-dark-900 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                {t('socialProof')}
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
            {/* Main glass card */}
            <div className="relative glass-strong rounded-3xl aspect-[4/5] flex flex-col justify-center overflow-hidden">
              {/* AI-generated background image */}
              <div className="absolute inset-0 opacity-50 mix-blend-luminosity">
                <AIImage
                  category="hero"
                  width={1024}
                  height={1024}
                  rounded="3xl"
                  className="w-full h-full"
                  priority
                />
              </div>

              {/* Dark overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-dark-950/80 via-dark-900/70 to-dark-950/80" />

              {/* Animated glow rings */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Floating icons grid */}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {dimensionIcons.map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                      className={`group relative p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.borderColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${item.glow}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-3 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                        <p className={`text-xs uppercase tracking-editorial ${item.iconColor} font-medium`}>
                          {item.label[labelLocale]}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Center orbital decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none"
              >
                <div className="absolute inset-0 rounded-full border border-purple-500/20" />
                <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
              </motion.div>
            </div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Level Up</p>
                <p className="text-sm font-medium text-white">+847 XP</p>
              </div>
            </motion.div>
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
        <div className="w-6 h-10 border-2 border-purple-400/30 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full shadow-lg shadow-purple-400/50"
          />
        </div>
      </motion.div>
    </section>
  );
}