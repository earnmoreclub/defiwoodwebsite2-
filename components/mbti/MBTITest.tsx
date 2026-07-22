'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Sparkles, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GameHeader from '@/components/layout/GameHeader';

type AxisKey = 'e' | 's' | 't' | 'j';
type Answer = 'a' | 'b';

interface Question {
  id: string;
  axis: AxisKey;
  // 'a' corresponds to first letter of axis (E, S, T, J), 'b' to second (I, N, F, P)
  side: Record<Answer, 'first' | 'second'>;
}

const QUESTIONS: Question[] = [
  { id: 'e1', axis: 'e', side: { a: 'first', b: 'second' } },
  { id: 'e2', axis: 'e', side: { a: 'first', b: 'second' } },
  { id: 's1', axis: 's', side: { a: 'first', b: 'second' } },
  { id: 's2', axis: 's', side: { a: 'first', b: 'second' } },
  { id: 't1', axis: 't', side: { a: 'first', b: 'second' } },
  { id: 't2', axis: 't', side: { a: 'first', b: 'second' } },
  { id: 'j1', axis: 'j', side: { a: 'first', b: 'second' } },
  { id: 'j2', axis: 'j', side: { a: 'first', b: 'second' } },
];

const AXIS_LETTERS: Record<AxisKey, { first: string; second: string }> = {
  e: { first: 'E', second: 'I' },
  s: { first: 'S', second: 'N' },
  t: { first: 'T', second: 'F' },
  j: { first: 'J', second: 'P' },
};

type Stage = 'intro' | 'testing' | 'result';

export default function MBTITest() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = useTranslations('mbti');
  const tg = useTranslations('common.game');
  const [stage, setStage] = useState<Stage>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  // answers stores questionId -> 'a' | 'b'
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIdx];
  const progress = useMemo(
    () => Math.round((Object.keys(answers).length / total) * 100),
    [answers, total]
  );

  // Calculate scores per axis: count for first vs second letter
  const scores = useMemo(() => {
    const result: Record<AxisKey, { first: number; second: number }> = {
      e: { first: 0, second: 0 },
      s: { first: 0, second: 0 },
      t: { first: 0, second: 0 },
      j: { first: 0, second: 0 },
    };
    QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      const side = q.side[ans];
      result[q.axis][side] += 1;
    });
    return result;
  }, [answers]);

  const resultType = useMemo(() => {
    const order: AxisKey[] = ['e', 's', 't', 'j'];
    return order
      .map((axis) => {
        const s = scores[axis];
        // Tie-break toward first letter (more common convention)
        return s.first >= s.second
          ? AXIS_LETTERS[axis].first
          : AXIS_LETTERS[axis].second;
      })
      .join('');
  }, [scores]);

  const axisPercentages = useMemo(() => {
    const map: Record<AxisKey, { first: number; second: number }> = {
      e: { first: 50, second: 50 },
      s: { first: 50, second: 50 },
      t: { first: 50, second: 50 },
      j: { first: 50, second: 50 },
    };
    (Object.keys(scores) as AxisKey[]).forEach((axis) => {
      const s = scores[axis];
      const total = s.first + s.second;
      const pct = total === 0 ? 50 : Math.round((s.first / total) * 100);
      map[axis] = { first: pct, second: 100 - pct };
    });
    return map;
  }, [scores]);

  const handleSelect = useCallback((ans: Answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: ans }));
  }, [currentQuestion]);

  const goNext = useCallback(() => {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setStage('result');
    }
  }, [currentIdx, total]);

  // Persist results and route to the shareable result page once complete.
  useEffect(() => {
    if (stage !== 'result') return;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'mbti:lastResult',
        JSON.stringify({ type: resultType, axisPercentages })
      );
    } catch {
      /* noop */
    }
  }, [stage, resultType, axisPercentages]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  }, [currentIdx]);

  const retake = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setStage('intro');
  }, []);

  const selectedAnswer = answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <GameHeader title={tg('mbtiTitle')} />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              {t('subtitle')}
            </p>
            <button
              onClick={() => setStage('testing')}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <span className="relative z-10">{t('startTest')}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {stage === 'testing' && currentQuestion && (
          <motion.div
            key={`q-${currentIdx}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-6 md:p-10"
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-editorial text-slate-400 mb-3">
                <span>{t('questionOf', { current: currentIdx + 1, total })}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-display font-semibold text-white leading-relaxed">
                {t(`questions.${currentQuestion.id}.text`)}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {(['a', 'b'] as Answer[]).map((opt) => {
                const isSelected = selectedAnswer === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-400/50 shadow-lg shadow-purple-500/10'
                        : 'bg-dark-900/50 border-white/10 hover:border-white/30 hover:bg-dark-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-purple-500 text-white'
                            : 'bg-dark-800 text-slate-400 group-hover:bg-dark-700'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{opt.toUpperCase()}</span>
                        )}
                      </div>
                      <span
                        className={`text-base md:text-lg ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {t(`questions.${currentQuestion.id}.${opt}`)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('previous')}
              </button>
              <button
                onClick={goNext}
                disabled={!selectedAnswer}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span>
                  {currentIdx === total - 1 ? t('submit') : t('next')}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-3xl p-6 md:p-10"
          >
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-editorial text-slate-400 mb-3">
                {t('result')}
              </div>
              <div className="inline-block">
                <div className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {resultType}
                </div>
                <div className="text-xl md:text-2xl font-display text-white">
                  {t(`types.${resultType}.title`)}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-center text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              {t(`types.${resultType}.desc`)}
            </p>

            {/* Trait Bars */}
            <div className="space-y-6 mb-10">
              {(Object.keys(axisPercentages) as AxisKey[]).map((axis) => {
                const letters = AXIS_LETTERS[axis];
                const { first: firstPct, second: secondPct } = axisPercentages[axis];
                const traitKey =
                  axis === 'e'
                    ? 'ei'
                    : axis === 's'
                    ? 'sn'
                    : axis === 't'
                    ? 'tf'
                    : 'jp';
                return (
                  <div key={axis}>
                    <div className="flex items-center justify-between text-xs uppercase tracking-editorial text-slate-400 mb-2">
                      <span>{t(`traits.${traitKey}.title`)}</span>
                      <span className="font-mono text-slate-500">
                        {letters.first} {firstPct}% · {secondPct}% {letters.second}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium text-purple-300">
                        {firstPct}% {t(`traits.${traitKey}.${
                          letters.first === 'E'
                            ? 'extrovert'
                            : letters.first === 'S'
                            ? 'sensing'
                            : letters.first === 'T'
                            ? 'thinking'
                            : 'judging'
                        }`)}
                      </span>
                      <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden flex">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${firstPct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${secondPct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        />
                      </div>
                      <span className="w-16 text-sm font-medium text-cyan-300 text-right">
                        {t(`traits.${traitKey}.${
                          letters.second === 'I'
                            ? 'introvert'
                            : letters.second === 'N'
                            ? 'intuition'
                            : letters.second === 'F'
                            ? 'feeling'
                            : 'perceiving'
                        }`)} {secondPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${locale}/mbti/result?type=${resultType}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 text-dark-950 text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                {t('viewShareCard')}
              </Link>
              <button
                onClick={retake}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-dark-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t('retake')}
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator
                      .share({
                        title: t('title'),
                        text: `${resultType} - ${t(`types.${resultType}.title`)}`,
                      })
                      .catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-dark-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {t('shareResult')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
