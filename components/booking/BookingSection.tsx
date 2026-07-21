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
import type { BookingFormData } from '@/types';

interface BookingSectionProps {
  locale: string;
}

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
    <section id="book" className="relative py-24 bg-dark-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-purple-400 mb-4 px-4 py-1.5 glass rounded-full">
            <Sparkles className="w-3 h-3" />
            {t('formTitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
              {t('header')}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('subtext')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative glass-strong rounded-3xl p-8 md:p-10 overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
              
              {submitted ? (
                <div className="relative text-center py-12">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-xl opacity-50" />
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-3">
                    {tForm('successTitle')}
                  </h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    {tForm('successDescription')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                  >
                    {tForm('submit')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <h3 className="font-serif text-xl text-white mb-6">
                    {t('formTitle')}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs uppercase tracking-editorial text-slate-400 mb-2">
                        {tForm('name')} *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm text-white placeholder-slate-500"
                        placeholder={tForm('namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs uppercase tracking-editorial text-slate-400 mb-2">
                        {tForm('email')} *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm text-white placeholder-slate-500"
                        placeholder={tForm('emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="primaryHealthGoals" className="block text-xs uppercase tracking-editorial text-slate-400 mb-2">
                      {tForm('goals')} *
                    </label>
                    <select
                      id="primaryHealthGoals"
                      name="primaryHealthGoals"
                      required
                      value={formData.primaryHealthGoals}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm text-white"
                    >
                      <option value="" className="bg-dark-900">{tForm('goalsPlaceholder')}</option>
                      {HEALTH_GOALS_OPTIONS.map(goal => (
                        <option key={goal} value={goal} className="bg-dark-900">{goal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs uppercase tracking-editorial text-slate-400 mb-2">
                      {tForm('preferredTime')} *
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm text-white"
                    >
                      <option value="" className="bg-dark-900">{tForm('preferredTimePlaceholder')}</option>
                      {PREFERRED_TIME_OPTIONS.map(time => (
                        <option key={time} value={time} className="bg-dark-900">{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-editorial text-slate-400 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm text-white placeholder-slate-500 resize-none"
                      placeholder="..."
                    />
                  </div>

                  {errors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-400">{err}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center">
                      {submitting ? tForm('submitting') : tForm('submit')}
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Side Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Cal.com Card */}
            <div className="relative glass-strong rounded-3xl p-8 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
              <div className="relative">
                <p className="text-xs uppercase tracking-editorial text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  {t('calTitle')}
                </p>
                <h3 className="font-serif text-xl text-white mb-4">
                  {t('calDescription')}
                </h3>
                <a
                  href={process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/awareness-be'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white text-xs uppercase tracking-editorial rounded-lg transition-all duration-300"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('formTitle')}
                </a>
              </div>
            </div>

            {/* Trust Signals Card */}
            <div className="relative glass-strong rounded-3xl p-8 overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              <div className="relative space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">45-min session</h4>
                    <p className="text-xs text-slate-400 mt-1">Deep-dive intake consultation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Confidential</h4>
                    <p className="text-xs text-slate-400 mt-1">Your data is private & secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Tailored guidance</h4>
                    <p className="text-xs text-slate-400 mt-1">Personalized plan after session</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}