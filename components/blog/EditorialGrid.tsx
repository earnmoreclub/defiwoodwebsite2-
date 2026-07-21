'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PostCard from './PostCard';
import type { Article } from '@/types';

interface EditorialGridProps {
  featured: Article | null;
  articles: Article[];
  locale: string;
}

const CATEGORY_SLUGS = [
  { slug: 'all', key: 'categoryAll' },
  { slug: 'metabolic-health', key: 'categories.metabolic' },
  { slug: 'gut-biome', key: 'categories.gut' },
  { slug: 'hair-longevity', key: 'categories.hair' },
  { slug: 'mindfulness', key: 'categories.mindfulness' },
];

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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-stone-200">
          {CATEGORY_SLUGS.map((cat) => {
            const label = cat.key === 'categoryAll' 
              ? t('categoryAll') 
              : t(cat.key);
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`text-xs uppercase tracking-editorial transition-colors ${
                  activeCategory === cat.slug
                    ? 'text-forest-800 border-b-2 border-forest-800 pb-1'
                    : 'text-stone-500 hover:text-forest-800'
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
                className="mb-16 pb-16 border-b border-stone-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-xs uppercase tracking-editorial">
                    Featured Story
                  </span>
                  <span className="text-xs text-stone-500">
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
              <div className="text-center py-16">
                <p className="text-stone-500 mb-4">
                  {locale === 'zh-TW' 
                    ? '文章將透過 AI 內容引擎即將發佈。' 
                    : 'Articles coming soon via our AI-powered content engine.'}
                </p>
                <Link
                  href={`${basePath}/blog`}
                  className="text-forest-800 hover:text-forest-700 inline-flex items-center text-sm"
                >
                  {t('viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-12">
              {/* Trending */}
              <div>
                <h3 className="font-serif text-xl text-stone-900 mb-2 pb-3 border-b border-stone-200">
                  {tSidebar('trendingTitle')}
                </h3>
                <p className="text-xs text-stone-500 mb-6 uppercase tracking-editorial">
                  {tSidebar('trendingSubtitle')}
                </p>
                <div className="space-y-6">
                  {articles.slice(0, 4).map((article) => (
                    <PostCard key={article.id} article={article} variant="compact" locale={locale} />
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-forest-800 text-cream-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-forest-700 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="font-serif text-xl mb-3">
                  {tSidebar('newsletterTitle')}
                </h3>
                <p className="text-cream-100/80 text-sm mb-6 leading-relaxed">
                  {tSidebar('newsletterDescription')}
                </p>

                {subscribed ? (
                  <div className="bg-forest-700/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-amber-300">
                      {locale === 'zh-TW' ? '歡迎加入 ✨' : 'Welcome aboard ✨'}
                    </p>
                    <p className="text-xs text-cream-100/60 mt-1">
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
                      className="w-full px-4 py-3 bg-forest-700 border border-forest-600 text-cream-50 placeholder-cream-100/40 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-amber-300 text-forest-900 text-xs uppercase tracking-editorial font-medium hover:bg-amber-200 transition-colors"
                    >
                      {tSidebar('newsletterCta')}
                    </button>
                  </form>
                )}
              </div>

              {/* About Card */}
              <div className="bg-cream-50 border border-stone-200 rounded-2xl p-8">
                <h3 className="font-serif text-lg text-stone-900 mb-3">
                  About Awareness Be
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  {locale === 'zh-TW'
                    ? '我們以循證代謝健康、腸道韌性與正念生活為橋樑，助您由內而外綻放生命力。'
                    : 'We bridge evidence-based metabolic health, gut resilience, and conscious living — empowering you to thrive from the inside out.'}
                </p>
                <Link
                  href={`${basePath}/#about`}
                  className="text-forest-800 hover:text-forest-700 text-sm inline-flex items-center"
                >
                  {locale === 'zh-TW' ? '我們的理念' : 'Our philosophy'} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}