'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCopy } from './PhilosophyExperience';

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

const PHASES: Phase[] = ['inhale', 'hold', 'exhale', 'pause'];
const PHASE_DURATION = 4; // seconds
const CYCLE_DURATION = PHASE_DURATION * 4; // 16 seconds

const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'inhale',
  hold: 'hold',
  exhale: 'exhale',
  pause: 'pause',
};

export default function BreathingTool() {
  const copy = useCopy();
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phase = PHASES[phaseIndex];

  const labelKey = phase === 'inhale' ? 'inhale' : phase === 'hold' ? 'hold' : phase === 'exhale' ? 'exhale' : 'pauseWord';
  const phaseLabel = copy.breathing[labelKey] as string;

  // Map phase to Tailwind scale for the breathing circle
  const scaleMap: Record<Phase, string> = {
    inhale: 'scale-100',
    hold: 'scale-100',
    exhale: 'scale-60',
    pause: 'scale-60',
  };

  const start = useCallback(() => {
    setIsRunning(true);
    setPhaseIndex(0);
    setSecondsLeft(PHASE_DURATION);
    setCycles(0);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(PHASE_DURATION);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // advance phase
          setPhaseIndex((pi) => {
            const next = (pi + 1) % PHASES.length;
            if (next === 0) setCycles((c) => c + 1);
            return next;
          });
          return PHASE_DURATION;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-4">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{copy.breathing.title}</h2>
        <p className="mt-3 text-sm text-charcoal/60">{copy.breathing.subtitle}</p>
      </div>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-52 h-52 rounded-full border border-charcoal/10" />
          <div className="absolute w-44 h-44 rounded-full border border-charcoal/8" />
          <div className="absolute w-36 h-36 rounded-full border border-charcoal/6" />
        </div>

        <motion.div
          animate={
            isRunning
              ? {
                  scale: phase === 'inhale' || phase === 'hold' ? [0.6, 1] : [1, 0.6],
                  opacity: phase === 'inhale' ? [0.55, 1] : phase === 'hold' ? 1 : phase === 'exhale' ? [1, 0.55] : 0.55,
                }
              : { scale: 0.6, opacity: 0.55 }
          }
          transition={
            phase === 'inhale'
              ? { duration: PHASE_DURATION, ease: 'easeInOut' }
              : phase === 'exhale'
              ? { duration: PHASE_DURATION, ease: 'easeInOut' }
              : { duration: 0 }
          }
          className="relative w-36 h-36 rounded-full bg-gradient-to-br from-sage/20 to-sage-100 border border-sage-200 flex flex-col items-center justify-center z-10"
        >
          <span className="font-serif text-3xl text-charcoal/70">{secondsLeft}</span>
          <span className="text-[10px] uppercase tracking-editorial text-charcoal/40 mt-1">
            {isRunning ? phaseLabel : 'ready'}
          </span>
        </motion.div>
      </div>

      {/* Phase bar */}
      <div className="flex items-center justify-center gap-1.5 mb-10">
        {PHASES.map((p, i) => {
          const isActive = isRunning && i === phaseIndex;
          const isPast = isRunning && i < phaseIndex;
          return (
            <div
              key={p}
              className={`h-1 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-6 bg-sage'
                  : isPast || (!isRunning && i === 0)
                  ? 'w-6 bg-charcoal/20'
                  : 'w-4 bg-charcoal/10'
              }`}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-8 py-3 rounded-full bg-charcoal text-cream-50 text-xs uppercase tracking-editorial hover:bg-sage-700 transition-colors"
          >
            {copy.breathing.start}
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-8 py-3 rounded-full border border-charcoal/20 text-charcoal text-xs uppercase tracking-editorial hover:bg-cream-100 transition-colors"
          >
            {copy.breathing.pause}
          </button>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full border border-charcoal/15 text-charcoal/60 text-xs uppercase tracking-editorial hover:text-charcoal hover:border-charcoal/30 transition-colors"
        >
          {copy.breathing.reset}
        </button>
      </div>

      {/* Cycle counter */}
      {cycles > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-xs text-charcoal/40 uppercase tracking-editorial"
        >
          {cycles} {copy.breathing.cycles}
        </motion.p>
      )}
    </div>
  );
}
