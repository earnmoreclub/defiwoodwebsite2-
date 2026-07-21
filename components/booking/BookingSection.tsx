'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, CheckCircle } from 'lucide-react';
import {
  HEALTH_GOALS_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  validateBookingForm,
} from '@/lib/calcom';
import type { BookingFormData } from '@/types';

export default function BookingSection() {
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
        setErrors(['Something went wrong. Please try again.']);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            Begin Your Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
            Begin Your Wellness Journey
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Select a date and time for your initial 45-minute holistic health 
            intake consultation. Our team will review your goals and craft a 
            personalized path forward.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Booking Form */}
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
                    Request Received
                  </h3>
                  <p className="text-stone-600 mb-6 max-w-md mx-auto">
                    Thank you for choosing Awareness Be. We'll reach out within 
                    24 hours to confirm your consultation details.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-forest-800 hover:text-forest-700 text-sm underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-serif text-xl text-stone-900 mb-6">
                    Request Your Consultation
                  </h3>

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Health Goals */}
                  <div>
                    <label htmlFor="primaryHealthGoals" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      Primary Health Goals *
                    </label>
                    <select
                      id="primaryHealthGoals"
                      name="primaryHealthGoals"
                      required
                      value={formData.primaryHealthGoals}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                    >
                      <option value="">Select your primary focus</option>
                      {HEALTH_GOALS_OPTIONS.map(goal => (
                        <option key={goal} value={goal}>{goal}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label htmlFor="preferredTime" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm"
                    >
                      <option value="">Select preferred time</option>
                      {PREFERRED_TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-editorial text-stone-600 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-200 bg-cream-50 focus:outline-none focus:border-forest-400 transition-colors text-sm resize-none"
                      placeholder="Anything else you'd like us to know..."
                    />
                  </div>

                  {/* Errors */}
                  {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-700">{err}</p>
                      ))}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-forest-800 text-cream-50 text-sm uppercase tracking-editorial font-medium hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Sending...' : 'Request Consultation'}
                  </button>

                  <p className="text-xs text-stone-500 text-center">
                    By submitting, you agree to receive a confirmation email. 
                    We respect your privacy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <h3 className="font-serif text-xl text-stone-900 mb-6">
                What to Expect
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-forest-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-sm">45 Minutes</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Comprehensive intake and goal setting
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-sm">1-on-1 Virtual</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Via secure video call from anywhere
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-forest-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 text-sm">100% Confidential</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Your information stays private and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cal.com Embed Placeholder */}
            <div className="bg-gradient-to-br from-forest-50 to-amber-50 border border-stone-200 rounded-2xl p-8 text-center">
              <p className="text-xs uppercase tracking-editorial text-amber-600 mb-3">
                Or Book Directly
              </p>
              <h3 className="font-serif text-lg text-stone-900 mb-3">
                Real-time Calendar
              </h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Connect directly with our Cal.com scheduler to see real-time availability 
                and book your preferred slot instantly.
              </p>
              <a
                href="https://cal.com/awareness-be"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial hover:bg-forest-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Open Cal.com
              </a>
              <p className="text-xs text-stone-500 mt-4">
                Configure NEXT_PUBLIC_CALCOM_URL to enable
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}