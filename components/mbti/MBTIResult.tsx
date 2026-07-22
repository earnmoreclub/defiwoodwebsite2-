'use client';

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  HeartPulse,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  RotateCcw,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type AxisKey = 'e' | 's' | 't' | 'j';

type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

interface TypeProfile {
  cognitive: string;
  stress: string;
  strengths: string[];
  color: 'gold' | 'emerald' | 'purple' | 'cyan';
}

/** Per-type rich breakdown shown on the result page. */
const TYPE_PROFILES: Record<MBTIType, TypeProfile> = {
  INTJ: {
    cognitive: 'Systems-level strategist. You build mental models and execute long-range plans with surgical precision.',
    stress: 'You retreat inward to recalibrate. Solitude restores your analytical edge.',
    strengths: ['Strategic foresight', 'Independent thinking', 'Pattern recognition'],
    color: 'purple',
  },
  INTP: {
    cognitive: 'Conceptual explorer. You deconstruct ideas, chase first principles, and live inside abstract frameworks.',
    stress: 'You detach and over-analyze. Give yourself permission to ship before perfection.',
    strengths: ['Logical reasoning', 'Creative ideation', 'Conceptual depth'],
    color: 'cyan',
  },
  ENTJ: {
    cognitive: 'Decisive commander. You see inefficiency as a personal enemy and mobilize people toward bold goals.',
    stress: 'You push harder \u2014 often the wrong move. Schedule deliberate recovery.',
    strengths: ['Strategic leadership', 'Decisive execution', 'Systems thinking'],
    color: 'gold',
  },
  ENTP: {
    cognitive: 'Possibility generator. You reframe any debate into a new angle, then prototype the wildest idea.',
    stress: 'You scatter. Pick one thread and finish it before chasing the next spark.',
    strengths: ['Rapid ideation', 'Persuasive debate', 'Adaptive thinking'],
    color: 'emerald',
  },
  INFJ: {
    cognitive: 'Insight synthesizer. You read people, patterns, and purpose \u2014 then quietly orchestrate meaning.',
    stress: 'You absorb others\u2019 emotions. Enforce energetic boundaries ruthlessly.',
    strengths: ['Deep empathy', 'Visionary insight', 'Quiet conviction'],
    color: 'purple',
  },
  INFP: {
    cognitive: 'Value-driven dreamer. You translate inner ideals into authentic expression and gentle resistance.',
    stress: 'You idealize and withdraw. Ground yourself in embodied, present-moment practice.',
    strengths: ['Authentic creativity', 'Empathic resonance', 'Meaning-making'],
    color: 'emerald',
  },
  ENFJ: {
    cognitive: 'People catalyst. You tune into group dynamics and lift others into their highest potential.',
    stress: 'You over-give. Your nervous system needs as much care as the people you serve.',
    strengths: ['Inspirational leadership', 'Emotional intelligence', 'Coaching instinct'],
    color: 'gold',
  },
  ENFP: {
    cognitive: 'Possibility alchemist. You connect unrelated ideas and ignite enthusiasm in every room you enter.',
    stress: 'You over-commit to keep options open. Learn the grace of a clean no.',
    strengths: ['Creative vision', 'Relational warmth', 'Quick adaptation'],
    color: 'cyan',
  },
  ISTJ: {
    cognitive: 'Reliable executor. You honor commitments, build durable systems, and trust what has been proven.',
    stress: 'You rigidify. Loosen the grip \u2014 flexibility is also a discipline.',
    strengths: ['Operational excellence', 'Loyal follow-through', 'Detail mastery'],
    color: 'gold',
  },
  ISFJ: {
    cognitive: 'Quiet guardian. You notice what others miss and protect what matters through steady, devoted care.',
    stress: 'You self-sacrifice silently. Speak your needs before they become resentment.',
    strengths: ['Reliable compassion', 'Memory for detail', 'Service mindedness'],
    color: 'emerald',
  },
  ESTJ: {
    cognitive: 'Order builder. You organize people, projects, and principles into predictable, productive systems.',
    stress: 'You become controlling under pressure. Lead with curiosity before protocol.',
    strengths: ['Project orchestration', 'Decisive accountability', 'Operational clarity'],
    color: 'purple',
  },
  ESFJ: {
    cognitive: 'Harmony engineer. You cultivate belonging, anticipate needs, and weave community with care.',
    stress: 'You people-please to avoid friction. Truth-telling is also an act of love.',
    strengths: ['Relational intelligence', 'Community building', 'Warm pragmatism'],
    color: 'cyan',
  },
  ISTP: {
    cognitive: 'Hands-on analyst. You reverse-engineer problems, prototype fast, and stay cool under pressure.',
    stress: 'You withdraw into isolation. Your body needs movement, not just stillness.',
    strengths: ['Tactical problem-solving', 'Calm under pressure', 'Mechanical intuition'],
    color: 'emerald',
  },
  ISFP: {
    cognitive: 'Sensory artist. You live through aesthetics, embodiment, and quiet acts of beauty.',
    stress: 'You internalize conflict. Channel intensity into craft, not suppression.',
    strengths: ['Aesthetic sensitivity', 'Adaptive presence', 'Quiet courage'],
    color: 'gold',
  },
  ESTP: {
    cognitive: 'Action operator. You read the room in real time, take the smart risk, and move first.',
    stress: 'You thrill-seek. Substitute intensity with intention rather than impulse.',
    strengths: ['Real-time strategy', 'Persuasive presence', 'Decisive action'],
    color: 'purple',
  },
  ESFP: {
    cognitive: 'Energetic performer. You bring people into the present moment and turn ordinary days into memories.',
    stress: 'You avoid pain with distraction. Sit with discomfort long enough to learn from it.',
    strengths: ['Magnetic warmth', 'Spontaneous creativity', 'Social fluency'],
    color: 'cyan',
  },
};

interface PaletteSpec {
  gradient: string;
  ring: string;
  soft: string;
  text: string;
  border: string;
  hex: string[];
}

const COLOR_MAP: Record<TypeProfile['color'], PaletteSpec> = {
  gold: {
    gradient: 'from-amber-300 via-yellow-400 to-orange-300',
    ring: 'ring-amber-300/30',
    soft: 'bg-amber-400/10',
    text: 'text-amber-300',
    border: 'border-amber-300/30',
    hex: ['#fde68a', '#fcd34d', '#f59e0b'],
  },
  emerald: {
    gradient: 'from-emerald-300 via-teal-300 to-cyan-300',
    ring: 'ring-emerald-300/30',
    soft: 'bg-emerald-400/10',
    text: 'text-emerald-300',
    border: 'border-emerald-300/30',
    hex: ['#6ee7b7', '#34d399', '#10b981'],
  },
  purple: {
    gradient: 'from-purple-300 via-fuchsia-300 to-pink-300',
    ring: 'ring-purple-300/30',
    soft: 'bg-purple-400/10',
    text: 'text-purple-300',
    border: 'border-purple-300/30',
    hex: ['#d8b4fe', '#c084fc', '#a855f7'],
  },
  cyan: {
    gradient: 'from-cyan-300 via-sky-300 to-blue-300',
    ring: 'ring-cyan-300/30',
    soft: 'bg-cyan-400/10',
    text: 'text-cyan-300',
    border: 'border-cyan-300/30',
    hex: ['#67e8f9', '#22d3ee', '#06b6d4'],
  },
};

const AXIS_LETTERS: Record<AxisKey, { first: string; second: string }> = {
  e: { first: 'E', second: 'I' },
  s: { first: 'S', second: 'N' },
  t: { first: 'T', second: 'F' },
  j: { first: 'J', second: 'P' },
};

interface MBTIResultProps {
  /** Deep-link friendly: pass `?type=INTJ` to render without localStorage. */
  initialType?: MBTIType;
  initialAxisPercentages?: Record<AxisKey, { first: number; second: number }>;
}

/**
 * Result screen for the MBTI test.
 *
 * - Trait breakdown (Cognitive Style / Stress Response / Embodied Strengths)
 * - 9:16 vertical "Shareable Story Card" rendered to PNG via html2canvas
 * - Social share buttons: Copy Link, WhatsApp, Line, Facebook
 * - Dynamic QR code via the `qrcode` package
 */
export default function MBTIResult({
  initialType,
  initialAxisPercentages,
}: MBTIResultProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = useTranslations('mbti');
  const storyRef = useRef<HTMLDivElement | null>(null);

  const [resultType, setResultType] = useState<MBTIType | null>(initialType ?? null);
  const [axisPct, setAxisPct] =
    useState<Record<AxisKey, { first: number; second: number }> | null>(
      initialAxisPercentages ?? null
    );
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/${locale}/mbti/result?type=${resultType ?? ''}`;
  }, [locale, resultType]);

  // Hydrate from localStorage when no initial props are provided.
  useEffect(() => {
    if (initialType) return;
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('mbti:lastResult');
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        type: MBTIType;
        axisPercentages: Record<AxisKey, { first: number; second: number }>;
      };
      setResultType(parsed.type);
      setAxisPct(parsed.axisPercentages);
    } catch {
      /* noop */
    }
  }, [initialType]);

  // Generate the QR code (client-side) for the share URL.
  useEffect(() => {
    let cancelled = false;
    async function gen() {
      if (!shareUrl) return;
      try {
        const QR = (await import('qrcode')).default;
        const data: string = await QR.toDataURL(shareUrl, {
          margin: 0,
          width: 320,
          color: { dark: '#0f0d17', light: '#ffffff00' },
        });
        if (!cancelled) setQrDataUrl(data);
      } catch {
        if (!cancelled) setQrDataUrl('');
      }
    }
    gen();
    return () => {
      cancelled = true;
    };
  }, [shareUrl]);

  const profile = resultType ? TYPE_PROFILES[resultType] : null;
  const colorKey: TypeProfile['color'] = profile?.color ?? 'gold';
  const palette = COLOR_MAP[colorKey];

  /** Render the story card to a PNG and trigger a download (or native share). */
  const handleDownload = useCallback(async () => {
    if (!storyRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(storyRef.current, {
        backgroundColor: '#08070d',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b: Blob | null) => resolve(b), 'image/png', 1.0)
      );
      if (!blob) throw new Error('Failed to render image');
      const file = new File([blob], `awareness-be-${resultType ?? 'mbti'}.png`, {
        type: 'image/png',
      });
      // Prefer Web Share API on mobile (Instagram/Twitter share sheet).
      if (
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        navigator.canShare?.({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: t('title'),
            text: `${resultType} \u2014 ${t(`types.${resultType}.title`)}`,
          });
          return;
        } catch {
          /* user dismissed; fall back to download */
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `awareness-be-${resultType ?? 'mbti'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Share/Download failed', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading, resultType, t]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }, [shareUrl]);

  const shareLinks = useMemo(() => {
    if (!resultType) return null;
    const text = encodeURIComponent(
      `${resultType} \u2014 ${t(`types.${resultType}.title`)}\nTake the test at awarenessbe.com`
    );
    const url = encodeURIComponent(shareUrl);
    return {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      line: `https://line.me/R/msg/text/?${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    };
  }, [resultType, shareUrl, t]);

  if (!resultType || !profile || !shareLinks) {
    return (
      <div className="glass rounded-3xl p-10 md:p-14 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-6">
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          {t('result')}
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Take the test to unlock your personalized result and shareable story card.
        </p>
        <Link
          href={`/${locale}/mbti`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('startTest')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* LEFT \u2014 trait breakdown */}
      <section className="lg:col-span-3 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${palette.gradient}`}
          />
          <div className="relative">
            <div className="text-xs uppercase tracking-editorial text-slate-400 mb-3">
              {t('result')}
            </div>
            <div
              className={`inline-block text-6xl md:text-7xl font-display font-bold bg-gradient-to-br ${palette.gradient} bg-clip-text text-transparent mb-3 leading-none`}
            >
              {resultType}
            </div>
            <div className="text-xl md:text-2xl font-display text-white">
              {t(`types.${resultType}.title`)}
            </div>
            <p className="text-slate-300 mt-4 max-w-xl mx-auto leading-relaxed">
              {t(`types.${resultType}.desc`)}
            </p>
          </div>
        </motion.div>

        {/* Trait Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-3xl p-6 md:p-8"
        >
          <h3 className="text-xs uppercase tracking-editorial text-slate-400 mb-6">
            Trait Breakdown
          </h3>

          <TraitRow
            icon={<Brain className="w-5 h-5" />}
            title="Cognitive Style"
            body={profile.cognitive}
            accent={palette.text}
          />
          <div className="h-px bg-white/5 my-5" />
          <TraitRow
            icon={<HeartPulse className="w-5 h-5" />}
            title="Stress Response"
            body={profile.stress}
            accent={palette.text}
          />
          <div className="h-px bg-white/5 my-5" />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${palette.soft} ${palette.text} ring-1 ${palette.ring}`}
              >
                <Sparkles className="w-5 h-5" />
              </span>
              <h4 className="text-base font-display text-white">
                Embodied Strengths
              </h4>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.strengths.map((s) => (
                <li
                  key={s}
                  className={`px-4 py-3 rounded-xl ${palette.soft} ring-1 ${palette.ring} text-sm text-white/90 text-center`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Axis bars */}
        {axisPct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h3 className="text-xs uppercase tracking-editorial text-slate-400 mb-6">
              Axis Snapshot
            </h3>
            <div className="space-y-4">
              {(Object.keys(axisPct) as AxisKey[]).map((axis) => {
                const letters = AXIS_LETTERS[axis];
                const pct = axisPct[axis];
                const traitKey =
                  axis === 'e' ? 'ei' : axis === 's' ? 'sn' : axis === 't' ? 'tf' : 'jp';
                return (
                  <div key={axis}>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-editorial text-slate-400 mb-2">
                      <span>{t(`traits.${traitKey}.title`)}</span>
                      <span className="font-mono text-slate-500">
                        {letters.first} {pct.first}% \u00b7 {pct.second}% {letters.second}
                      </span>
                    </div>
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-dark-800">
                      <div
                        className={`bg-gradient-to-r ${palette.gradient}`}
                        style={{ width: `${pct.first}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </section>

      {/* RIGHT \u2014 story card + share */}
      <section className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-3xl p-6 md:p-8"
        >
          <h3 className="text-xs uppercase tracking-editorial text-slate-400 mb-2">
            Shareable Story Card
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            Optimized for Instagram, Threads, and Xiaohongshu (9:16).
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/60">
              <StoryCard
                ref={storyRef}
                type={resultType}
                title={t(`types.${resultType}.title`)}
                strengths={profile.strengths}
                hex={palette.hex}
                qrDataUrl={qrDataUrl}
              />
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${palette.gradient} text-dark-950 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering\u2026
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Image / Share to Instagram
              </>
            )}
          </button>

          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-editorial text-slate-400 mb-3">
              Share via
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ShareBtn
                onClick={handleCopy}
                icon={
                  copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )
                }
                label={copied ? 'Copied!' : 'Copy Link'}
              />
              <ShareBtn
                href={shareLinks.whatsapp}
                icon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
                label="WhatsApp"
              />
              <ShareBtn
                href={shareLinks.line}
                icon={<Share2 className="w-4 h-4 text-emerald-400" />}
                label="Line"
              />
              <ShareBtn
                href={shareLinks.facebook}
                icon={<Facebook className="w-4 h-4 text-blue-400" />}
                label="Facebook"
              />
            </div>
          </div>

          <Link
            href={`/${locale}/mbti`}
            className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('retake')}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function TraitRow({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="flex gap-4">
      <span
        className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 ring-1 ring-white/10 ${accent}`}
      >
        {icon}
      </span>
      <div>
        <h4 className="text-base font-display text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function ShareBtn({
  href,
  onClick,
  icon,
  label,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const cls =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-800/70 hover:bg-dark-700 border border-white/10 text-white text-sm rounded-xl transition-colors';
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {icon}
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon}
      {label}
    </button>
  );
}

/* ---------- 9:16 Story Card ---------- */

interface StoryCardProps {
  type: MBTIType;
  title: string;
  strengths: string[];
  hex: string[];
  qrDataUrl: string;
}

const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(function StoryCard(
  { type, title, strengths, hex, qrDataUrl },
  ref
) {
  // Inline styles for html2canvas reliability.
  const bgGradient = `radial-gradient(circle at 20% 10%, ${hex[0]}33 0%, transparent 45%), radial-gradient(circle at 80% 90%, ${hex[2]}40 0%, transparent 50%), linear-gradient(180deg, #08070d 0%, #0f0d17 60%, #151222 100%)`;
  const textGradient = `linear-gradient(135deg, ${hex[0]} 0%, ${hex[1]} 50%, ${hex[2]} 100%)`;

  return (
    <div
      ref={ref}
      style={{
        width: 720,
        height: 1280,
        background: bgGradient,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Decorative noise overlay (html2canvas-safe SVG turbulence) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      {/* Top: brand */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          right: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: textGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08070d',
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            AB
          </div>
          <div>
            <div style={{ fontSize: 16, letterSpacing: 4, color: '#cbd5e1' }}>
              AWARENESS BE
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', letterSpacing: 2 }}>
              SELF-AWARENESS \u00b7 EST. 2026
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            padding: '8px 14px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            color: '#e2e8f0',
          }}
        >
          MBTI RESULT
        </div>
      </div>

      {/* Center: type */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          top: 220,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 6,
            color: '#94a3b8',
            marginBottom: 24,
          }}
        >
          YOUR BRAIN TYPE
        </div>
        <div
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontWeight: 600,
            fontSize: 260,
            lineHeight: 1,
            letterSpacing: -6,
            background: textGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {type}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            color: '#ffffff',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 16,
            color: '#cbd5e1',
            letterSpacing: 1,
          }}
        >
          Awareness Be \u00b7 Brain Type Profile
        </div>
      </div>

      {/* Strengths chips */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          bottom: 280,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
        }}
      >
        {strengths.map((s) => (
          <div
            key={s}
            style={{
              padding: '12px 20px',
              borderRadius: 999,
              border: `1px solid ${hex[1]}66`,
              background: `${hex[1]}1a`,
              color: '#ffffff',
              fontSize: 18,
              letterSpacing: 0.5,
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Bottom CTA + QR */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          bottom: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              color: '#94a3b8',
              marginBottom: 8,
            }}
          >
            TEST YOUR BRAIN TYPE
          </div>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 40,
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          >
            awarenessbe.com
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: '#cbd5e1' }}>
            Scan to take the 2-minute test
          </div>
        </div>

        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 16,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          }}
        >
          {qrDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={qrDataUrl}
              alt="QR code"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <QRPlaceholder hex={hex} />
          )}
        </div>
      </div>
    </div>
  );
});

/* ---------- QR placeholder (deterministic 9\u00d79 grid) ---------- */

function QRPlaceholder({ hex }: { hex: string[] }) {
  const seed = hex.join('').length;
  const cells = Array.from({ length: 81 }, (_, i) => {
    const v = (i * 7 + seed) % 5;
    return v < 2;
  });
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: 2,
      }}
    >
      {cells.map((on, i) => (
        <div
          key={i}
          style={{
            background: on ? '#0f0d17' : 'transparent',
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}