'use client';

import { useEffect, useState, useCallback, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Download, Check, Loader2, Wind, Brain } from 'lucide-react';

type ModalState = 'idle' | 'submitting' | 'success';

const STORAGE_KEY = 'awareness-be:lead-magnet-dismissed';
const DISMISS_DAYS = 14;
const SCROLL_THRESHOLD = 0.5; // 50%
const TIMER_SECONDS = 30;

export default function LeadMagnetModal() {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<ModalState>('idle');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scrolledPastThreshold = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFired = useRef(false);
  const timerFired = useRef(false);

  /** Should we even consider showing the modal for this visitor? */
  const shouldShowForUser = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return true;
      const { expiresAt } = JSON.parse(raw) as { expiresAt: number };
      return Date.now() > expiresAt;
    } catch {
      return true;
    }
  }, []);

  /** Persist dismiss for 14 days. */
  const markDismissed = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        dismissedAt: Date.now(),
        expiresAt: Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* noop */
    }
  }, []);

  const trigger = useCallback(() => {
    setVisible((v) => {
      if (v) return v;
      if (!shouldShowForUser()) return v;
      return true;
    });
  }, [shouldShowForUser]);

  /** EXIT-INTENT: detect mouse leaving through the top of the viewport. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMouseLeave = (e: MouseEvent) => {
      // Only fire when leaving toward the top of the page
      if (e.clientY <= 0) {
        trigger();
      }
    };
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () =>
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
  }, [trigger]);

  /** SCROLL TRIGGER: 50% depth starts a 30s countdown. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = window.scrollY / docHeight;
      if (progress >= SCROLL_THRESHOLD) {
        scrolledPastThreshold.current = true;
        if (!timerFired.current) {
          timerFired.current = true;
          timerRef.current = setTimeout(trigger, TIMER_SECONDS * 1000);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setState('idle');
    setEmail('');
    setError(null);
    markDismissed();
  }, [markDismissed]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      // Validate email
      const trimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError('請輸入有效的 email 地址');
        return;
      }

      setState('submitting');
      try {
        // Persist email and dismiss for 14 days so user never sees this again
        const res = await fetch('/api/lead-magnet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });

        if (!res.ok) throw new Error('Subscription failed');

        setState('success');
        markDismissed();
      } catch (err) {
        console.error('Lead magnet submit error', err);
        setError('提交失敗，請稍後再試');
        setState('idle');
      }
    },
    [email, markDismissed]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lead-magnet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-dark-950/80 backdrop-blur-md"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            key="lead-magnet-card"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl md:rounded-3xl bg-dark-900 ring-1 ring-white/10 shadow-2xl shadow-purple-500/20"
          >
            {/* Decorative gradient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-500"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="關閉"
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative grid md:grid-cols-5 gap-0">
              {/* LEFT — Visual / brand panel */}
              <div className="md:col-span-2 hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-emerald-500/10 border-r border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 mb-6">
                    <Wind className="w-3.5 h-3.5 text-cyan-300" />
                    <span className="text-[10px] uppercase tracking-editorial text-slate-300">
                      免費下載
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <Brain className="w-10 h-10 text-purple-300" />
                    <Wind className="w-10 h-10 text-cyan-300" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    結合神經科學與東方呼吸智慧，
                    透過 7 天有意識的練習，重啟你的副交感神經。
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-slate-300 mt-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    7 個 10 分鐘科學驗證音檔
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    具身呼吸練習 PDF
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    迷走神經調節週計畫
                  </li>
                </ul>
              </div>

              {/* RIGHT — Form / Success */}
              <div className="md:col-span-3 p-8 md:p-10">
                {state === 'success' ? (
                  <SuccessState email={email} onClose={handleClose} />
                ) : (
                  <FormState
                    state={state}
                    email={email}
                    error={error}
                    onEmailChange={setEmail}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Sub-views ---------- */

function FormState({
  state,
  email,
  error,
  onEmailChange,
  onSubmit,
}: {
  state: ModalState;
  email: string;
  error: string | null;
  onEmailChange: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 ring-1 ring-purple-400/30">
        <span className="text-[10px] uppercase tracking-editorial text-purple-300 font-medium">
          限定 Lead Magnet
        </span>
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-white mb-3 leading-tight">
        7 天具身呼吸與心智清晰指南
      </h2>

      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        免費下載 10 分鐘科學驗證音檔與 PDFs，
        調節迷走神經，重拾內在平靜。
      </p>

      {/* Email input */}
      <label
        htmlFor="lead-magnet-email"
        className="block text-xs uppercase tracking-editorial text-slate-400 mb-2"
      >
        你的 email
      </label>
      <div className="relative mb-3">
        <Mail
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          aria-hidden
        />
        <input
          id="lead-magnet-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={state === 'submitting'}
          className="w-full pl-11 pr-4 py-3.5 bg-dark-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all disabled:opacity-60"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 mb-3"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            提交中…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            免費獲取指南
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
        提交即同意接收 Awareness Be 的科學洞察與產品更新。
        你可以隨時取消訂閱。我們尊重你的隱私。
      </p>
    </form>
  );
}

function SuccessState({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 mb-5"
      >
        <Check className="w-8 h-8 text-dark-950" strokeWidth={3} />
      </motion.div>

      <h3 className="font-serif text-2xl text-white mb-2">
        歡迎加入 Awareness Be
      </h3>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        你的 <span className="text-purple-300">{email}</span> 已成功訂閱，
        指南下載連結已發送至你的信箱。
      </p>

      <a
        href="/downloads/awareness-be-7day-guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
      >
        <Download className="w-4 h-4" />
        立即下載 PDF 指南
      </a>

      <button
        type="button"
        onClick={onClose}
        className="block mx-auto mt-5 text-xs text-slate-500 hover:text-white transition-colors"
      >
        關閉視窗
      </button>
    </motion.div>
  );
}