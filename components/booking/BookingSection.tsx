'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, CheckCircle } from 'lucide-react';
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
    <section id="book" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            {t('formTitle')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
            {t('header')}
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtext')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-forest-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-forest-700" />
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3">
                    {tForm('successTitle')}
                  </h3>
                  <p className="text-stone-600 mb-6 max-w-md mx-auto">
                    {tForm('successDescription')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-forest-800 hover:text-forest-700 text-sm underline"
                  >
                    {tForm('submit')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-serif text-xl text-stone-900 mb-6">
                    {t('formTitle')}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                        {tForm('name')} *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                        placeholder={tForm('namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                        {tForm('email')} *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                        placeholder={tForm('emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="primaryHealthGoals" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      {tForm('goals')} *
                    </label>
                    <select
                      id="primaryHealthGoals"
                      name="primaryHealthGoals"
                      required
                      value={formData.primaryHealthGoals}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                    >
                      <option value="">{tForm('goalsPlaceholder')}</option>
                      {HEALTH_GOALS_OPTIONS.map(goal => (
                        <option key={goal} value={goal}>{goal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      {tForm('preferredTime')} *
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                    >
                      <option value="">{tForm('preferredTimePlaceholder')}</option>
                      {PREFERRED_TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm resize-none"
                      placeholder="..."
                    />
                  </div>

                  {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-700">{err}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-forest-800 text-cream-50 text-sm uppercase tracking-editorial font-medium hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? tForm('submitting') : tForm('submit')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-gradient-to-br from-forest-50 to-amber-50 border border-stone-200 rounded-2xl p-8 text-center">
              <p className="text-xs uppercase tracking-editorial text-amber-600 mb-3">
                {t('calTitle')}
              </p>
              <h3 className="font-serif text-lg text-stone-900 mb-3">
                {t('calDescription')}
              </h3>
              <a
                href={process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/awareness-be'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial hover:bg-forest-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('formTitle')}
              </a>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <Clock className="w-8 h-8 text-forest-700 mb-4" />
              <Shield className="w-8 h-8 text-amber-600 mb-4 ml-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
