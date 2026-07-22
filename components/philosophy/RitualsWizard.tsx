'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopy } from './PhilosophyExperience';
import { useCart } from './cart/CartContext';

type Answers = [string | null, string | null, string | null, string | null];

type Ritual = {
  name: string;
  exercise: string;
  productName: string;
  productDesc: string;
  duration: string;
  why: string;
};

const RITUALS: Ritual[] = [
  {
    name: 'Somatic Shoulder Release',
    exercise: 'Sit or stand. On each inhale, draw the shoulders up toward the ears. On the exhale, release them fully downward — as if a weight is pulling them down. Repeat 8 times, then hold the shoulders down and breathe into the back body for 1 minute.',
    productName: 'Ashwagandha & Magnesium',
    productDesc: 'For residual tension held in the nervous system after long screen sessions.',
    duration: '5 min',
    why: 'You described tension and being at your desk — somatic release restores interoceptive awareness.',
  },
  {
    name: 'Box Breathing Reset',
    exercise: 'Inhale for 4 counts. Hold for 4. Exhale for 4. Hold for 4. Repeat for 4 complete cycles. Let the count be the only thing in the room.',
    productName: 'L-Theanine & GABA Complex',
    productDesc: 'Supports calm alpha-wave brain activity and parasympathetic rest.',
    duration: '5 min',
    why: 'Scattered focus responds well to rhythmic, bilateral breath patterns that retrain the attention circuit.',
  },
  {
    name: 'Three-Part Exhale',
    exercise: 'Breathe in through the nose. Divide the exhale into three equal parts: release half the air, pause, release the next quarter, pause, release the last quarter. The exhale should be roughly twice the length of the inhale. Continue for 2 minutes.',
    productName: 'Rhodiola & B-Complex',
    productDesc: 'For low energy and cognitive fatigue that accumulates over the day.',
    duration: '5 min',
    why: 'Extended exhales directly stimulate the vagus nerve, shifting the nervous system toward rest.',
  },
  {
    name: 'Sensory Counting',
    exercise: 'Choose one sense at a time. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Move slowly through each layer. This is not a memory exercise — it is a homecoming to the present moment.',
    productName: 'Evening Routine Kit',
    productDesc: 'Micro-dosed magnesium and chamomile for gentle wind-down before rest.',
    duration: '3 min',
    why: 'Sleep is not a mental achievement. Sensory anchoring prepares the nervous system for descent.',
  },
  {
    name: 'Progressive Relaxation',
    exercise: 'Starting at the toes, contract each muscle group firmly for 3 seconds, then release completely. Move upward: feet, calves, thighs, abdomen, chest, hands, arms, shoulders, jaw, face. By the time you reach the top, most tension will have moved through and out.',
    productName: 'Warm Bath Ritual Set',
    productDesc: 'Epsom salt, lavender, and arnica blend to support deep muscular release.',
    duration: '15 min',
    why: 'Tense body + time + quiet = the ideal conditions for somatic discharge.',
  },
];

function getRitual(answers: Answers): Ritual {
  const [feel, , time, support] = answers;
  if (feel === 'Seeking sleep' || feel === 'Low energy') return RITUALS[2];
  if (feel === 'Tense body') return RITUALS[4];
  if (feel === 'Scattered focus') return RITUALS[1];
  if (support === 'Sensory pause') return RITUALS[3];
  if (support === 'Somatic reset') return RITUALS[0];
  return RITUALS[0];
}

export default function RitualsWizard() {
  const copy = useCopy();
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>([null, null, null, null]);

  // persist to sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('ritual-answers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Answers;
        if (parsed.length === 4) setAnswers(parsed);
        const firstNull = parsed.findIndex((a) => a === null);
        if (firstNull >= 0) setStep(firstNull);
        else setStep(4);
      } catch {}
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('ritual-answers', JSON.stringify(answers));
  }, [answers]);

  const current = copy.wizard.steps[step];
  const isLastStep = step === 3;
  const isDone = step === 4;

  function selectAnswer(choice: string) {
    const next: Answers = [...answers];
    next[step] = choice;
    setAnswers(next);
  }

  function handleNext() {
    if (isLastStep) {
      setStep(4);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  function handleRestart() {
    setAnswers([null, null, null, null]);
    setStep(0);
    sessionStorage.removeItem('ritual-answers');
  }

  const ritual = getRitual(answers);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{copy.wizard.title}</h2>
        <p className="mt-3 text-charcoal/60 text-sm">{copy.wizard.subtitle}</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i < step
                ? 'w-6 bg-sage'
                : i === step && !isDone
                ? 'w-8 bg-charcoal'
                : 'w-6 bg-clay'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-cream-50 border border-charcoal/10 rounded-2xl p-8 md:p-10 shadow-sm"
          >
            <div className="text-[10px] uppercase tracking-editorial text-sage-600 mb-2">
              {copy.wizard.resultTitle}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal">{ritual.name}</h3>
            <p className="mt-3 text-charcoal/60 text-sm">{copy.wizard.resultSubtitle}</p>

            <div className="mt-8 p-6 bg-cream-100 rounded-xl border border-charcoal/5">
              <div className="text-[10px] uppercase tracking-editorial text-charcoal/40 mb-3">
                The practice
              </div>
              <p className="text-sm leading-relaxed text-charcoal/80">{ritual.exercise}</p>
            </div>

            <div className="mt-5 flex items-start gap-3 p-5 bg-sage-50 rounded-xl border border-sage-200/50">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-editorial text-sage-600 mb-1">
                  {copy.wizard.match}
                </div>
                <p className="text-xs leading-relaxed text-charcoal/70">{ritual.why}</p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 p-5 rounded-xl border border-charcoal/10">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-editorial text-charcoal/40 mb-1">
                  {copy.wizard.paired}
                </div>
                <div className="font-medium text-sm text-charcoal">{ritual.productName}</div>
                <p className="mt-1 text-xs text-charcoal/60">{ritual.productDesc}</p>
              </div>
              <button
                onClick={() =>
                  add({
                    id: ritual.name.toLowerCase().replace(/\s+/g, '-'),
                    name: ritual.productName,
                    price: 4500,
                    description: ritual.productDesc,
                  })
                }
                className="flex-shrink-0 px-4 py-2 rounded-full bg-charcoal text-cream-50 text-xs uppercase tracking-editorial hover:bg-sage-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-full border border-charcoal/20 text-charcoal text-xs uppercase tracking-editorial hover:bg-cream-100 transition-colors"
              >
                {copy.wizard.restart}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="text-[10px] uppercase tracking-editorial text-charcoal/40 mb-2">
                {step + 1} / {copy.wizard.steps.length}
              </div>
              <h3 className="font-serif text-2xl text-charcoal">{current.title}</h3>
              <p className="mt-1 text-sm text-charcoal/50">{current.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((option) => {
                const selected = answers[step] === option;
                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    className={`px-5 py-4 rounded-xl border text-left text-sm transition-all duration-200 ${
                      selected
                        ? 'border-charcoal bg-charcoal text-cream-50 shadow-sm'
                        : 'border-charcoal/15 bg-cream-50 text-charcoal hover:border-charcoal/40 hover:bg-cream-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="px-5 py-2.5 text-xs uppercase tracking-editorial text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
              >
                {copy.wizard.back}
              </button>
              <button
                onClick={handleNext}
                disabled={answers[step] === null}
                className="px-6 py-2.5 rounded-full bg-charcoal text-cream-50 text-xs uppercase tracking-editorial hover:bg-sage-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isLastStep ? copy.wizard.start : copy.wizard.next}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
