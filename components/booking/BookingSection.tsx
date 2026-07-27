'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, CheckCircle, Sparkles, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  HEALTH_GOALS_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  validateBookingForm,
} from '@/lib/calcom';
import PexelsImage from "@/src/components/PexelsImage";
import type { BookingFormData } from '@/types';

interface BookingSectionProps {
  locale: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export default function BookingSection({ locale: _locale }: BookingSectionProps) {
  const t = useTranslations('booking');
  const tForm = useTranslations('booking.form');

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    primaryHealthGoals: '',
    preferredTime: '',
    message: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateBookingForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          primaryHealthGoals: '',
          preferredTime: '',
          message: '',
        });
      } else {
        setErrors([tForm('errorMessage')]);
      }
    } catch {
      setErrors([tForm('errorMessage')]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="relative py-28 sm:py-32 bg-dark-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/[0.1] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/[0.08] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-purple-300 mb-5 px-4 py-1.5 glass rounded-full font-medium"
          >
            <Sparkles className="w-3 h-3" />
            {t('formTitle')}
          </motion.span>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-5 tracking-tight text-balance">
            <span className="bg-gradient-to-br from-purple-200 via-white to-cyan-200 bg-clip-text text-transparent">
              {t('header')}
            </span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-base sm:text-[17px]">
            {t('subtext')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="lg:col-span-3"
          >
            <div className="relative glass-strong rounded-3xl p-8 md:p-12 overflow-hidden ring-1 ring-white/10">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] to-cyan-500/[0.04] pointer-events-none" />

              {submitted ? (
                <div className="relative text-center py-16">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-2xl opacity-50" />
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3 tracking-tight">
                    {tForm('successTitle')}
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                    {tForm('successDescription')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors"
                  >
                    {tForm('submit')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <h3 className="font-serif text-xl text-white mb-7 tracking-tight">
                    {t('formTitle')}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-[11px] uppercase tracking-editorial text-slate-400 mb-2.5 font-semibold">
                        {tForm('name')} *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-white placeholder-slate-500"
                        placeholder={tForm('namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[11px] uppercase tracking-editorial text-slate-400 mb-2.5 font-semibold">
                        {tForm('email')} *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-white placeholder-slate-500"
                        placeholder={tForm('emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="primaryHealthGoals" className="block text-[11px] uppercase tracking-editorial text-slate-400 mb-2.5 font-semibold">
                      {tForm('goals')} *
                    </label>
                    <select
                      id="primaryHealthGoals"
                      name="primaryHealthGoals"
                      required
                      value={formData.primaryHealthGoals}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-white"
                    >
                      <option value="" className="bg-dark-900">{tForm('goalsPlaceholder')}</option>
                      {HEALTH_GOALS_OPTIONS.map(goal => (
                        <option key={goal} value={goal} className="bg-dark-900">{goal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-[11px] uppercase tracking-editorial text-slate-400 mb-2.5 font-semibold">
                      {tForm('preferredTime')} *
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-white"
                    >
                      <option value="" className="bg-dark-900">{tForm('preferredTimePlaceholder')}</option>
                      {PREFERRED_TIME_OPTIONS.map(time => (
                        <option key={time} value={time} className="bg-dark-900">{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] uppercase tracking-editorial text-slate-400 mb-2.5 font-semibold">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-white placeholder-slate-500 resize-none"
                      placeholder="..."
                    />
                  </div>

                  {errors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 ring-1 ring-red-500/20">
                      {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-300">{err}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/15"
                  >
                    <span className="relative z-10 flex items-center">
                      {submitting ? tForm('submitting') : tForm('submit')}
                      <Send className="w-4 h-4 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Side Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Cal.com Card */}
            <div className="relative glass-strong rounded-3xl p-8 overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 ring-1 ring-white/10">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl" aria-hidden="true" />
              <div className="absolute inset-0 opacity-30 mix-blend-luminosity">
                <PexelsImage
                  category="booking"
                  width={800}
                  height={600}
                  rounded="3xl"
                  className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-dark-950/88 via-dark-900/75 to-dark-950/88" />

              <div className="relative">
                <p className="text-[11px] uppercase tracking-editorial text-cyan-300 mb-3 flex items-center gap-2 font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  </span>
                  {t('calTitle')}
                </p>
                <h3 className="font-serif text-xl text-white mb-5 tracking-tight">
                  {t('calDescription')}
                </h3>
                <a
                  href={process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/awareness-be'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/50 text-white text-[11px] uppercase tracking-editorial font-semibold rounded-xl transition-all duration-300"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('formTitle')}
                </a>
              </div>
            </div>

            {/* Trust Signals Card */}
            <div className="relative glass-strong rounded-3xl p-8 overflow-hidden ring-1 ring-white/10">
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl" aria-hidden="true" />
              <div className="relative space-y-5">
                {[
                  { Icon: Clock, color: 'emerald', title: '45-min session', desc: 'Deep-dive intake consultation' },
                  { Icon: Shield, color: 'purple', title: 'Confidential', desc: 'Your data is private & secure' },
                  { Icon: Sparkles, color: 'cyan', title: 'Tailored guidance', desc: 'Personalized plan after session' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center flex-shrink-0`}>
                      <item.Icon className={`w-5 h-5 text-${item.color}-300`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
