'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, RotateCcw, Plus, ShoppingBag } from 'lucide-react';
import {
  PRESENT_OPTIONS,
  WHERE_OPTIONS,
  TIME_OPTIONS,
  SUPPORT_OPTIONS,
  buildRitual,
  formatDuration,
} from '@/lib/tools-data';
import type {
  PresentOption,
  WhereOption,
  TimeOption,
  SupportOption,
} from '@/types/tools';
import { useCart } from './CartProvider';

type StepKey = 'present' | 'where' | 'time' | 'support';
type Answers = Partial<Record<StepKey, string>>;

const STEPS: Array<{ key: StepKey; title: string; helper: string; index: number }> = [
  { key: 'present', title: 'What feels most present?', helper: 'Choose what is closest to the truth right now.', index: 1 },
  { key: 'where', title: 'Where are you right now?', helper: 'Location changes the shape of the practice.', index: 2 },
  { key: 'time', title: 'How much time do you have?', helper: 'Even one minute, taken fully, is enough.', index: 3 },
  { key: 'support', title: 'What kind of support do you need?', helper: 'A small direction is more useful than a long list.', index: 4 },
];

const PRODUCT_PRICE: Record<string, number> = {
  'Pocket Breath — Travel Cedar Inhaler': 28,
  'Warming Muscle Salve': 36,
  'Quiet Linen Notebook': 24,
  'House Blend Tea — Morning Quiet': 22,
};

export default function CheckInWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const step = STEPS[stepIdx];
  const last = stepIdx === STEPS.length - 1;

  const pick = useCallback(
    (key: StepKey, value: string) => {
      setAnswers((a) => ({ ...a, [key]: value }));
    },
    []
  );

  const canAdvance = Boolean(answers[step.key]);

  const advance = useCallback(() => {
    if (last) {
      setDone(true);
    } else {
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
    }
  }, [last]);

  const back = useCallback(() => {
    if (done) {
      setDone(false);
      return;
    }
    setStepIdx((i) => Math.max(i - 1, 0));
  }, [done]);

  const restart = useCallback(() => {
    setStepIdx(0);
    setAnswers({});
    setDone(false);
  }, []);

  const ritual = useMemo(() => {
    if (!done) return null;
    return buildRitual({
      present: answers.present as PresentOption | undefined,
      where: answers.where as WhereOption | undefined,
      time: answers.time as TimeOption | undefined,
      support: answers.support as SupportOption | undefined,
    });
  }, [done, answers]);

  return (
    <section id="check-in" className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <header className="text-center mb-12">
          <p className="text-[11px] tracking-[0.28em] uppercase text-stone-500 mb-4">
            The Ritual Engine
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-[-0.02em]">
            A four-step check-in.
          </h2>
          <p className="mt-4 text-stone-500 max-w-[44ch] mx-auto leading-relaxed">
            One answer at a time. Stored only in your browser — nothing sent, nothing saved.
          </p>
        </header>

        {/* Progress */}
        {!done && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={[
                  'h-1 rounded-full transition-all duration-500',
                  i === stepIdx
                    ? 'w-10 bg-stone-900'
                    : i < stepIdx
                    ? 'w-6 bg-[#78866B]'
                    : 'w-6 bg-stone-200',
                ].join(' ')}
              />
            ))}
          </div>
        )}

        <div className="rounded-[2rem] bg-white border border-stone-200/70 shadow-[0_30px_80px_-50px_rgba(28,25,23,0.25)] overflow-hidden">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="p-8 sm:p-12"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-serif text-[13px] tracking-[0.2em] uppercase text-stone-400">
                    Step {step.index} of {STEPS.length}
                  </span>
                  {stepIdx > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex items-center gap-1 text-[12px] text-stone-500 hover:text-stone-900"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                  )}
                </div>

                <h3 className="font-serif text-[28px] sm:text-[34px] text-stone-900 leading-tight mb-2 tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-stone-500 mb-8">{step.helper}</p>

                <OptionGrid
                  step={step.key}
                  selected={answers[step.key]}
                  onSelect={(v) => pick(step.key, v)}
                />

                <div className="mt-10 flex justify-end">
                  <button
                    type="button"
                    onClick={advance}
                    disabled={!canAdvance}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-900 text-[#FDFBF7] text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {last ? 'Receive ritual' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : ritual ? (
              <RitualResult
                key="result"
                ritual={ritual}
                answers={answers}
                onRestart={restart}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Option Grids --------------------------- */

function OptionGrid({
  step,
  selected,
  onSelect,
}: {
  step: StepKey;
  selected?: string;
  onSelect: (v: string) => void;
}) {
  let options: Array<{ id: string; label: string; description?: string }> = [];
  if (step === 'present') options = PRESENT_OPTIONS;
  else if (step === 'where') options = WHERE_OPTIONS;
  else if (step === 'time') options = TIME_OPTIONS;
  else if (step === 'support') options = SUPPORT_OPTIONS;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map((o) => {
        const active = selected === o.id;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={[
              'group text-left p-5 rounded-2xl border transition-all duration-300',
              active
                ? 'border-stone-900 bg-[#FDFBF7] ring-1 ring-stone-900'
                : 'border-stone-200 hover:border-stone-400 bg-[#FDFBF7]',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-[17px] text-stone-900 leading-tight">
                  {o.label}
                </div>
                {o.description && (
                  <div className="text-[12px] text-stone-500 mt-1.5 leading-relaxed">
                    {o.description}
                  </div>
                )}
              </div>
              <span
                className={[
                  'shrink-0 mt-1 w-5 h-5 rounded-full border transition-all',
                  active ? 'bg-stone-900 border-stone-900' : 'border-stone-300',
                ].join(' ')}
              >
                {active && (
                  <Check className="w-full h-full p-0.5 text-[#FDFBF7]" strokeWidth={3} />
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Result --------------------------- */

function RitualResult({
  ritual,
  answers,
  onRestart,
}: {
  ritual: ReturnType<typeof buildRitual>;
  answers: Answers;
  onRestart: () => void;
}) {
  const { add } = useCart();
  const price = PRODUCT_PRICE[ritual.productName] ?? 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 sm:p-12"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78866B]/10 text-[#78866B] text-[11px] tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78866B]" />
          Your ritual
        </span>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1 text-[12px] text-stone-500 hover:text-stone-900"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Start over
        </button>
      </div>

      <h3 className="font-serif text-[32px] sm:text-[42px] leading-[1.1] text-stone-900 tracking-[-0.02em] mb-2">
        {ritual.title}
      </h3>

      <div className="flex items-center gap-4 text-[12px] text-stone-500 mb-8">
        <span>{formatDuration(ritual.durationSeconds)}</span>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="capitalize">{answers.support}</span>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="capitalize">{answers.where?.replace('-', ' ')}</span>
      </div>

      <p className="text-stone-700 text-[16px] leading-[1.75] mb-10 max-w-[58ch]">
        {ritual.guidance}
      </p>

      <div className="rounded-2xl bg-[#F7F3EB] border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-1">
            Pairs well with
          </div>
          <div className="font-serif text-[17px] text-stone-900 leading-tight">
            {ritual.productName}
          </div>
          <div className="text-[12px] text-stone-500 mt-1">{ritual.productNote}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-stone-700 text-sm tabular-nums">${price}</span>
          <button
            type="button"
            onClick={() =>
              add({
                id: ritual.productName,
                name: ritual.productName,
                note: ritual.productNote,
                price,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 text-[#FDFBF7] text-[13px] font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to cart
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <a
          href="#breath"
          className="inline-flex items-center gap-2 text-[13px] text-stone-700 hover:text-stone-900"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          Or begin a 60-second reset →
        </a>
        <span className="text-[11px] text-stone-400">
          Saved only in this browser. Closing the tab erases everything.
        </span>
      </div>
    </motion.div>
  );
}