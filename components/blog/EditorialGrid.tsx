'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PostCard from './PostCard';
import type { Article } from '@/types';

interface EditorialGridProps {
  featured: Article | null;
  articles: Article[];
  locale: string;
}

const CATEGORY_SLUGS = [
  { slug: 'all', key: 'categoryAll', accent: 'purple' },
  { slug: 'metabolic-health', key: 'categories.metabolic', accent: 'purple' },
  { slug: 'gut-biome', key: 'categories.gut', accent: 'cyan' },
  { slug: 'hair-longevity', key: 'categories.hair', accent: 'emerald' },
  { slug: 'mindfulness', key: 'categories.mindfulness', accent: 'cyan' },
] as const;

const accentMap: Record<string, string> = {
  purple: 'text-purple-400 border-purple-400',
  cyan: 'text-cyan-400 border-cyan-400',
  emerald: 'text-emerald-400 border-emerald-400',
};

const accentBgMap: Record<string, string> = {
  purple: 'bg-purple-500/10',
  cyan: 'bg-cyan-500/10',
  emerald: 'bg-emerald-500/10',
};

export default function EditorialGrid({ featured, articles, locale }: EditorialGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const t = useTranslations('blog');
  const tSidebar = useTranslations('blog.sidebar');

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category.slug === activeCategory);

  const basePath = locale === 'zh-TW' ? '' : '/en';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {CATEGORY_SLUGS.map((cat) => {
          const label = cat.key === 'categoryAll' 
            ? t('categoryAll') 
            : t(cat.key);
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-editorial rounded-full transition-all duration-300 border ${
                isActive
                  ? `${accentMap[cat.accent]} ${accentBgMap[cat.accent]} border-current shadow-lg shadow-purple-500/20`
                  : 'text-slate-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Editorial Layout */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {featured && activeCategory === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 pb-16 border-b border-white/5"
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-xs uppercase tracking-editorial rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Featured Story
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(featured.publishedAt).toLocaleDateString(
                    locale === 'zh-TW' ? 'zh-TW' : 'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </span>
              </div>
              <PostCard article={featured} variant="featured" locale={locale} />
            </motion.div>
          )}

          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 gap-10">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PostCard article={article} variant="standard" locale={locale} />
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && !featured && (
            <div className="text-center py-16 glass rounded-3xl">
              <p className="text-slate-400 mb-4">
                {locale === 'zh-TW' 
                  ? '文章將透過 AI 內容引擎即將發佈。' 
                  : 'Articles coming soon via our AI-powered content engine.'}
              </p>
              <Link
                href={`${basePath}/blog`}
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center text-sm"
              >
                {t('viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Trending */}
            <div className="glass-strong rounded-3xl p-6">
              <h3 className="font-serif text-xl text-white mb-2">
                {tSidebar('trendingTitle')}
              </h3>
              <p className="text-xs text-slate-500 mb-6 uppercase tracking-editorial">
                {tSidebar('trendingSubtitle')}
              </p>
              <div className="space-y-6">
                {articles.slice(0, 4).map((article) => (
                  <PostCard key={article.id} article={article} variant="compact" locale={locale} />
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="relative glass-strong rounded-3xl p-6 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">
                  {tSidebar('newsletterTitle')}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {tSidebar('newsletterDescription')}
                </p>

                {subscribed ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-emerald-400">
                      {locale === 'zh-TW' ? '歡迎加入 ✨' : 'Welcome aboard ✨'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {locale === 'zh-TW' ? '請至您的信箱確認' : 'Check your inbox for confirmation'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={locale === 'zh-TW' ? '您的電子郵件' : 'your@email.com'}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 text-white placeholder-slate-500 text-sm transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs uppercase tracking-editorial font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    >
                      {tSidebar('newsletterCta')}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* About Card */}
            <div className="glass rounded-3xl p-6">
              <h3 className="font-serif text-lg text-white mb-3">
                About Awareness Be
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {locale === 'zh-TW'
                  ? '我們以循證自我覺察、身心整合與覺察練習為橋樑，助您由內而外綻放生命力。'
                  : 'We bridge evidence-based self-awareness, body-mind integration, and conscious exploration — empowering you to thrive from the inside out.'}
              </p>
              <Link
                href={`${basePath}/#about`}
                className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center group"
              >
                {locale === 'zh-TW' ? '我們的理念' : 'Our philosophy'} 
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}