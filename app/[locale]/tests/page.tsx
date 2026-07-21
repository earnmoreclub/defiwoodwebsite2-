'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Heart, Bone, Sparkles, ArrowRight } from 'lucide-react';

const tests = [
  {
    id: 'bone-spur',
    href: (locale: string) => `/${locale}/bone-spur`,
    icon: Bone,
    color: 'from-red-500 to-orange-500',
    tagColor: 'text-red-400',
    tagBg: 'bg-red-400/10',
  },
  {
    id: 'mbti',
    href: (locale: string) => `/${locale}/mbti`,
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    tagColor: 'text-purple-400',
    tagBg: 'bg-purple-400/10',
  },
  {
    id: 'johari',
    href: (locale: string) => `/${locale}/johari`,
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    tagColor: 'text-emerald-400',
    tagBg: 'bg-emerald-400/10',
  },
];

export default function TestsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = useTranslations('tests');
  const isZh = locale === 'zh-TW';

  return (
    <main className="min-h-screen bg-dark-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs uppercase tracking-editorial text-slate-300">
              {t('badge')}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={test.href(locale)}
                className="group block glass rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${test.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <test.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${test.tagBg} ${test.tagColor} text-xs px-2 py-0.5 rounded-full font-medium`}>
                        {t(`cards.${test.id}.tag`)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {t(`cards.${test.id}.title`)}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {t(`cards.${test.id}.desc`)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-purple-400 font-medium">
                      <span>{t('startTest')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl p-6 border-dashed border-white/10 opacity-60"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <span className="bg-dark-700 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {t('comingSoon.tag')}
                </span>
                <h2 className="text-xl font-semibold text-slate-400 mt-2 mb-2">
                  {t('cards.more.title')}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t('cards.more.desc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
