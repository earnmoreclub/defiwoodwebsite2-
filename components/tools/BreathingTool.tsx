'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

const PHASES: Array<{ key: Phase; label: string; seconds: number }> = [
  { key: 'inhale', label: 'Inhale', seconds: 4 },
  { key: 'hold', label: 'Hold', seconds: 4 },
  { key: 'exhale', label: 'Exhale', seconds: 4 },
  { key: 'pause', label: 'Pause', seconds: 4 },
];

const RING_SCALE: Record<Phase, number> = {
  inhale: 1,
  hold: 1,
  exhale: 0.45,
  pause: 0.45,
};

export default function BreathingTool() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIdx];

  const reset = useCallback(() => {
    setRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].seconds);
  }, []);

  // Auto-advance phase
  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // advance phase
        setPhaseIdx((p) => {
          const next = (p + 1) % PHASES.length;
          if (next === 0) setCycles((c) => c + 1);
          return next;
        });
        return PHASES[(phaseIdx + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, phaseIdx]);

  // Keep timer in sync when phase changes
  useEffect(() => {
    setSecondsLeft(PHASES[phaseIdx].seconds);
  }, [phaseIdx]);

  // Audio cue (Web Audio API, no asset required)
  const toneRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);
  const lastBeepedRef = useRef<number>(-1);
  const beep = useCallback((freq: number) => {
    try {
      if (!toneRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.value = 0;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        toneRef.current = { ctx, osc, gain };
      }
      const { gain, ctx } = toneRef.current;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
    } catch {
      /* noop — audio is optional */
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const sigil = phaseIdx * 10 + (4 - secondsLeft);
    if (lastBeepedRef.current === sigil) return;
    lastBeepedRef.current = sigil;
    if (phase.key === 'inhale') beep(220);
    if (phase.key === 'exhale') beep(174);
    if (phase.key === 'hold' && secondsLeft === phase.seconds) beep(330);
    if (phase.key === 'pause' && secondsLeft === phase.seconds) beep(110);
  }, [phase, secondsLeft, phaseIdx, running, beep]);

  useEffect(() => {
    return () => {
      try {
        toneRef.current?.osc.stop();
        toneRef.current?.ctx.close();
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <section id="breath" className="relative py-24 lg:py-32 bg-[#F7F3EB]">
      <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-stone-500 mb-4">
            Free Awareness Tool · 01
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-[-0.02em] leading-[1.05]">
            The 60-second
            <br />
            <span className="italic font-normal text-[#78866B]">breathing reset.</span>
          </h2>
          <p className="mt-6 text-stone-600 leading-[1.7] max-w-[44ch]">
            Box breath, set to a soft tone. Four seconds in, four held, four out, four
            empty. The aim is not perfection — only that you arrive.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-900 text-[#FDFBF7] text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              {running ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Begin
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-stone-700 hover:bg-stone-100 text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <div className="text-[12px] text-stone-500 tabular-nums">
              {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
            </div>
          </div>
        </div>

        {/* Animated breath circle */}
        <div className="relative aspect-square w-full max-w-[420px] mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E7E1D8] to-[#D6CFC2]" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at center, rgba(120,134,107,0.45) 0%, rgba(120,134,107,0.18) 60%, transparent 80%)',
              filter: 'blur(20px)',
            }}
            animate={{ scale: RING_SCALE[phase.key] }}
            transition={{
              duration: phase.seconds,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-[12%] rounded-full border border-stone-300/60 bg-[#FDFBF7]/90 backdrop-blur"
            animate={{ scale: RING_SCALE[phase.key] }}
            transition={{
              duration: phase.seconds,
              ease: 'easeInOut',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-2">
              {running ? 'Now' : 'Ready'}
            </span>
            <motion.span
              key={phase.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-[40px] sm:text-[48px] text-stone-900 leading-none"
            >
              {running ? phase.label : 'Begin'}
            </motion.span>
            <span className="mt-3 text-stone-500 text-sm tabular-nums">
              {running ? `${secondsLeft}s` : '4 · 4 · 4 · 4'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}