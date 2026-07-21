'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

type Step = 'welcome' | 'location' | 'severity' | 'duration' | 'morningStiffness' | 'dailyImpact' | 'redFlags' | 'result';

type Tier = 1 | 2 | 3;

interface ScreenerState {
  language: 'en' | 'zh';
  location?: string;
  severity?: number;
  duration?: '<2w' | '1-6m' | '6m+';
  morningStiffness?: boolean;
  dailyImpact?: boolean;
  redFlags?: boolean;
}

export default function BoneSpurScreener({ locale }: { locale: string }) {
  const t = useTranslations('boneSpur');
  const [step, setStep] = useState<Step>('welcome');
  const [state, setState] = useState<ScreenerState>({ language: locale === 'zh-TW' ? 'zh' : 'en' });
  const [textInput, setTextInput] = useState('');

  const isZh = state.language === 'zh';

  const computeTier = (): Tier => {
    if (state.redFlags || (state.severity && state.severity >= 8 && state.redFlags)) return 1;
    if (state.duration === '6m+' || state.severity && state.severity >= 5 || state.morningStiffness || state.dailyImpact) return 2;
    return 3;
  };

  const tier = step === 'result' ? computeTier() : 3;

  const next = () => {
    const order: Step[] = ['welcome', 'location', 'severity', 'duration', 'morningStiffness', 'dailyImpact', 'redFlags', 'result'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const reset = () => {
    setStep('welcome');
    setState({ language: locale === 'zh-TW' ? 'zh' : 'en' });
    setTextInput('');
  };

  const Message = ({ children, isUser = false }: { children: React.ReactNode; isUser?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs text-white mr-2 flex-shrink-0">
          🏥
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? 'bg-purple-600 text-white' : 'glass text-slate-100'}`}>
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full mb-3">
            <span className="text-xs text-slate-300">🏥 {t('title')}</span>
          </div>
          <h1 className="font-serif text-2xl text-white">
            {isZh ? '骨刺與關節健康評估助手' : 'Bone Spur & Joint Health Screener'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('subtitle')}</p>
        </div>

        {/* Chat */}
        <div className="glass-strong rounded-2xl p-5 mb-4 min-h-[420px]">
          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>
                  <div className="space-y-1">
                    <p className="font-medium">{isZh ? '歡迎！' : 'Welcome!'}</p>
                    <p>{isZh ? '我是您的關節健康評估助手。' : 'I am your Joint Health Assistant.'}</p>
                    <p className="text-slate-300 text-xs">{isZh ? '請選擇您的語言，或直接告訴我您的不適症狀。' : 'Please choose your preferred language or tell me about your symptoms.'}</p>
                  </div>
                </Message>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => { setState({ ...state, language: 'en' }); next(); }} className="glass rounded-xl py-2.5 text-sm text-white hover:bg-white/10">
                    🇬🇧 English
                  </button>
                  <button onClick={() => { setState({ ...state, language: 'zh' }); next(); }} className="glass rounded-xl py-2.5 text-sm text-white hover:bg-white/10">
                    🇹🇼 繁體中文
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'location' && (
              <motion.div key="location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('symptomLocationZh') : t('symptomLocation')}</Message>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { en: 'Neck / Cervical', zh: '頸椎 / 脖子' },
                    { en: 'Lower Back', zh: '腰椎 / 下背' },
                    { en: 'Knee', zh: '膝蓋' },
                    { en: 'Heel / Foot', zh: '足跟 / 腳底' },
                    { en: 'Shoulder', zh: '肩膀' },
                  ].map((loc) => (
                    <button
                      key={loc.en}
                      onClick={() => { setState({ ...state, location: loc.en }); next(); }}
                      className="glass rounded-xl py-2 px-3 text-sm text-white hover:bg-white/10"
                    >
                      {isZh ? loc.zh : loc.en}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'severity' && (
              <motion.div key="severity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('painSeverityZh') : t('painSeverity')}</Message>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => { setState({ ...state, severity: n }); next(); }}
                      className="glass rounded-xl py-3 text-white hover:bg-white/10 font-medium"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                  <span>{isZh ? '輕微' : 'Mild'}</span>
                  <span>{isZh ? '非常嚴重' : 'Severe'}</span>
                </div>
              </motion.div>
            )}

            {step === 'duration' && (
              <motion.div key="duration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('durationZh') : t('duration')}</Message>
                <div className="space-y-2 mt-2">
                  {[
                    { v: '<2w' as const, en: 'Less than 2 weeks', zh: '少於 2 週' },
                    { v: '1-6m' as const, en: '1 – 6 months', zh: '1 – 6 個月' },
                    { v: '6m+' as const, en: '6+ months', zh: '超過 6 個月' },
                  ].map((d) => (
                    <button
                      key={d.v}
                      onClick={() => { setState({ ...state, duration: d.v }); next(); }}
                      className="w-full glass rounded-xl py-3 px-4 text-sm text-white hover:bg-white/10 text-left"
                    >
                      {isZh ? d.zh : d.en}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'morningStiffness' && (
              <motion.div key="morningStiffness" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('morningStiffnessZh') : t('morningStiffness')}</Message>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => { setState({ ...state, morningStiffness: true }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10">
                    {isZh ? '是' : 'Yes'}
                  </button>
                  <button onClick={() => { setState({ ...state, morningStiffness: false }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10">
                    {isZh ? '否' : 'No'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'dailyImpact' && (
              <motion.div key="dailyImpact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('dailyImpactZh') : t('dailyImpact')}</Message>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => { setState({ ...state, dailyImpact: true }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10">
                    {isZh ? '是' : 'Yes'}
                  </button>
                  <button onClick={() => { setState({ ...state, dailyImpact: false }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10">
                    {isZh ? '否' : 'No'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'redFlags' && (
              <motion.div key="redFlags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>{isZh ? t('redFlagsZh') : t('redFlags')}</Message>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button onClick={() => { setState({ ...state, redFlags: true }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10 border-red-400/30">
                    {isZh ? '是' : 'Yes'}
                  </button>
                  <button onClick={() => { setState({ ...state, redFlags: false }); next(); }} className="glass rounded-xl py-3 text-white hover:bg-white/10">
                    {isZh ? '否' : 'No'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Message>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    tier === 1 ? 'bg-red-500/20 text-red-300' :
                    tier === 2 ? 'bg-amber-500/20 text-amber-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {tier === 1 ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isZh
                      ? ['', t('tier1.titleZh'), t('tier2.titleZh'), t('tier3.titleZh')][tier]
                      : ['', t('tier1.title'), t('tier2.title'), t('tier3.title')][tier]}
                  </div>
                  <p className="leading-relaxed mt-1">
                    {isZh
                      ? ['', t('tier1.recommendationZh'), t('tier2.recommendationZh'), t('tier3.recommendationZh')][tier]
                      : ['', t('tier1.recommendation'), t('tier2.recommendation'), t('tier3.recommendation')][tier]}
                  </p>
                </Message>
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                  ⚠️ {isZh ? t('disclaimerZh') : t('disclaimer')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {step !== 'welcome' && (
            <button
              onClick={reset}
              className="flex-1 glass rounded-xl py-3 text-sm text-slate-300 hover:bg-white/10 inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('restart')}
            </button>
          )}
          {step === 'result' && (
            <Link
              href={`/${locale}/book`}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl py-3 text-sm text-white font-medium inline-flex items-center justify-center gap-2 hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              {t('bookConsultation')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
