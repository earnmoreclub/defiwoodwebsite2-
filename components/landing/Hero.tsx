'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, Eye, Brain, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PexelsImage from "@/src/components/PexelsImage";

interface HeroProps {
  locale: string;
}

// Refined easing curves for premium feel
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

const dimensionIcons = [
  {
    Icon: Brain,
    label: { 'zh-TW': '心智清晰', 'en': 'Mental Clarity' },
    gradient: 'from-purple-500/20 to-purple-700/10',
    borderColor: 'border-purple-400/25',
    iconColor: 'text-purple-300',
    glow: 'shadow-purple-500/30',
  },
  {
    Icon: Eye,
    label: { 'zh-TW': '自我覺察', 'en': 'Inner Vision' },
    gradient: 'from-cyan-500/20 to-cyan-700/10',
    borderColor: 'border-cyan-400/25',
    iconColor: 'text-cyan-300',
    glow: 'shadow-cyan-500/30',
  },
  {
    Icon: Heart,
    label: { 'zh-TW': '情緒韌性', 'en': 'Emotional Resilience' },
    gradient: 'from-emerald-500/20 to-emerald-700/10',
    borderColor: 'border-emerald-400/25',
    iconColor: 'text-emerald-300',
    glow: 'shadow-emerald-500/30',
  },
  {
    Icon: Sparkles,
    label: { 'zh-TW': '蛻變升級', 'en': 'Transcendence' },
    gradient: 'from-purple-500/15 via-cyan-500/15 to-emerald-500/15',
    borderColor: 'border-purple-400/25',
    iconColor: 'text-purple-300',
    glow: 'shadow-purple-500/30',
  },
];

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('hero');
  const basePath = locale === 'zh-TW' ? '' : '/en';
  const labelLocale = locale === 'zh-TW' ? 'zh-TW' : 'en';

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden pt-24 pb-20">
      {/* Refined animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Floating ambient orbs with refined motion */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-purple-500/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[480px] h-[480px] bg-cyan-500/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/8 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            className="text-center lg:text-left"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_QUART }}
              className="inline-flex items-center gap-2.5 px-4 py-2 glass rounded-full mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] uppercase tracking-editorial text-slate-200 font-medium">
                {t('badge')}
              </span>
            </motion.div>

            {/* Headline with refined gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
              className="font-serif text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] mb-6 tracking-tight text-balance"
            >
              <span className="bg-gradient-to-br from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                {t('headline')}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              {t('subheadline')}
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href={`${basePath}/#book`}
                className="group relative inline-flex items-center justify-center px-7 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center">
                  <Calendar className="w-4 h-4 mr-2.5" />
                  {t('primaryCta')}
                  <ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 flex items-center space-x-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/40 to-cyan-500/40 border-2 border-dark-900 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 hover:z-10"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">{t('socialProof')}</p>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="relative hidden lg:block"
          >
            {/* Main hero card with refined glass */}
            <div className="relative group rounded-3xl aspect-[4/5] flex flex-col justify-center overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-purple-500/10">
              {/* Background image */}
              <div className="absolute inset-0 opacity-60 mix-blend-luminosity">
                <PexelsImage
                  category="hero"
                  width={1024}
                  height={1024}
                  rounded="3xl"
                  className="w-full h-full"
                  priority
                />
              </div>

              {/* Refined gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-dark-950/85 via-dark-900/75 to-dark-950/85" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-dark-950/40" />

              {/* Glow accents */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

              {/* Icons grid */}
              <div className="grid grid-cols-2 gap-5 relative z-10 px-10">
                {dimensionIcons.map((item, i) => {
                  const Icon = item.Icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.6 + i * 0.12, ease: EASE_OUT_QUART }}
                      className={`group/item relative p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.borderColor} backdrop-blur-md transition-all duration-500 hover:scale-[1.06] hover:-translate-y-1 hover:shadow-2xl ${item.glow}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-3 rounded-xl bg-white/[0.08] flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-3 group-hover/item:bg-white/[0.12]">
                          <Icon className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                        <p className={`text-[10px] uppercase tracking-editorial ${item.iconColor} font-semibold`}>
                          {item.label[labelLocale]}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Orbital decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none opacity-40"
                aria-hidden="true"
              >
                <div className="absolute inset-0 rounded-full border border-purple-500/20" />
                <div className="absolute inset-6 rounded-full border border-cyan-500/15" />
                <div className="absolute inset-12 rounded-full border border-emerald-500/10" />
              </motion.div>
            </div>

            {/* Floating XP card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 flex items-center gap-3 z-20 ring-1 ring-white/15 shadow-xl"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-slate-400 font-medium">Level Up</p>
                <p className="text-sm font-semibold text-white">+847 XP</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border border-purple-400/40 rounded-full flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2.5 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full shadow-lg shadow-purple-400/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
