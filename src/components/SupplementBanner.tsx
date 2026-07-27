'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Leaf } from 'lucide-react';

export interface SupplementBannerProps {
  /** Eyebrow / source label (e.g. "Awareness Be Shop") */
  badge: string;
  /** Headline */
  title: string;
  /** Body copy */
  body: string;
  /** CTA label */
  ctaLabel: string;
  /** Target URL */
  href?: string;
  /** Optional variant: 'inline' (compact horizontal), 'card' (full) */
  variant?: 'inline' | 'card';
  /** Tint color theme: 'purple' | 'cyan' | 'emerald' */
  tint?: 'purple' | 'cyan' | 'emerald';
  /** Animate on scroll */
  animateOnView?: boolean;
}

const TINT_MAP = {
  purple: {
    glow: 'from-purple-500/15 via-purple-500/5 to-transparent',
    border: 'border-purple-400/20',
    borderHover: 'group-hover:border-purple-300/50',
    accent: 'bg-purple-400/20',
    text: 'text-purple-200',
    cta: 'text-purple-300 group-hover:text-purple-200',
    iconColor: 'text-purple-300',
  },
  cyan: {
    glow: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
    border: 'border-cyan-400/20',
    borderHover: 'group-hover:border-cyan-300/50',
    accent: 'bg-cyan-400/20',
    text: 'text-cyan-200',
    cta: 'text-cyan-300 group-hover:text-cyan-200',
    iconColor: 'text-cyan-300',
  },
  emerald: {
    glow: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    border: 'border-emerald-400/20',
    borderHover: 'group-hover:border-emerald-300/50',
    accent: 'bg-emerald-400/20',
    text: 'text-emerald-200',
    cta: 'text-emerald-300 group-hover:text-emerald-200',
    iconColor: 'text-emerald-300',
  },
} as const;

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SupplementBanner({
  badge,
  title,
  body,
  ctaLabel,
  href = 'https://awarenessbe.com/',
  variant = 'card',
  tint = 'emerald',
  animateOnView = true,
}: SupplementBannerProps) {
  const colors = TINT_MAP[tint];
  const shopUrl = href;

  const Wrapper = animateOnView ? motion.a : 'a' as const;
  const wrapperProps = animateOnView
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.7, ease: EASE_OUT_EXPO },
        whileHover: { y: -3 },
      }
    : { whileHover: { y: -3 } };

  if (variant === 'inline') {
    return (
      <Wrapper
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ctaLabel} (opens in new tab)`}
        className={`group inline-flex items-center gap-3 px-4 py-2.5 rounded-full glass ${colors.border} ${colors.borderHover} ring-1 ring-white/5 transition-all duration-500 hover:shadow-lg`}
        {...wrapperProps}
      >
        <span className={`w-7 h-7 rounded-full ${colors.accent} flex items-center justify-center flex-shrink-0`}>
          <Leaf className={`w-3.5 h-3.5 ${colors.iconColor}`} />
        </span>
        <span className={`text-[11px] uppercase tracking-editorial ${colors.text} font-semibold`}>
          {badge}
        </span>
        <span className="hidden sm:inline text-xs text-slate-300">
          {title}
        </span>
        <span className={`inline-flex items-center text-[11px] uppercase tracking-editorial ${colors.cta} font-semibold transition-colors`}>
          {ctaLabel}
          <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </span>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      href={shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${ctaLabel} (opens in new tab)`}
      className={`group relative block overflow-hidden rounded-2xl p-6 md:p-7 glass-strong ${colors.border} ${colors.borderHover} ring-1 ring-white/5 transition-all duration-500 hover:shadow-2xl`}
      {...wrapperProps}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${colors.glow} rounded-full blur-3xl pointer-events-none`}
        aria-hidden="true"
      />

      {/* Animated gradient border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          padding: '1px',
          background: tint === 'purple'
            ? 'linear-gradient(135deg, rgba(168,85,247,0.5), rgba(6,182,212,0.4), rgba(16,185,129,0.4))'
            : tint === 'cyan'
            ? 'linear-gradient(135deg, rgba(6,182,212,0.5), rgba(168,85,247,0.4), rgba(16,185,129,0.4))'
            : 'linear-gradient(135deg, rgba(16,185,129,0.5), rgba(6,182,212,0.4), rgba(168,85,247,0.4))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4 md:gap-5">
        {/* Icon medallion */}
        <div
          className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl ${colors.accent} border ${colors.border} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Leaf className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <span className={`inline-block text-[10px] uppercase tracking-editorial ${colors.text} font-semibold mb-2`}>
            {badge}
          </span>

          {/* Title */}
          <h4 className="font-serif text-lg md:text-xl text-white mb-1.5 leading-snug tracking-tight">
            {title}
          </h4>

          {/* Body */}
          <p className="text-sm text-slate-400 leading-relaxed mb-3 group-hover:text-slate-300 transition-colors duration-500">
            {body}
          </p>

          {/* CTA */}
          <span
            className={`inline-flex items-center text-[11px] uppercase tracking-editorial ${colors.cta} font-semibold transition-colors`}
          >
            {ctaLabel}
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Wrapper>
  );
}
