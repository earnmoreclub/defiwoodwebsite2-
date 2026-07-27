'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { JournalArticle, JournalCategory } from '@/types/journal';
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';
import PexelsImage from "@/src/components/PexelsImage";
import SupplementBanner from "@/src/components/SupplementBanner";

interface JournalIndexProps {
  articles: JournalArticle[];
  categories: JournalCategory[];
  locale: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function JournalIndex({ articles, categories, locale }: JournalIndexProps) {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<JournalCategory | 'all'>('all');

  // Stable per-article shop variant selection based on slug
  const tints = useMemo<Array<'purple' | 'cyan' | 'emerald'>>(() => {
    return articles.map((_, i) => {
      const cycle: Array<'purple' | 'cyan' | 'emerald'> = ['purple', 'cyan', 'emerald'];
      return cycle[i % cycle.length];
    });
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const featuredArticle = useMemo(
    () => articles.find((a) => a.featured) || articles[0],
    [articles]
  );

  return (
    <>
      {/* Hero Section */}
      <section className="mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-purple-500/10"
        >
          {/* AI-generated background */}
          <div className="absolute inset-0 opacity-50">
            <PexelsImage
              category="journal"
              width={1600}
              height={800}
              rounded="3xl"
              className="w-full h-full"
              priority
            />
          </div>

          {/* Layered gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/92 via-dark-900/80 to-dark-950/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/40" />

          {/* Glow accents */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" aria-hidden="true" />

          {/* Text content */}
          <div className="relative text-center py-20 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-block px-4 py-1.5 mb-5 rounded-full glass border border-purple-400/30"
            >
              <span className="text-[11px] uppercase tracking-editorial text-purple-200 font-semibold">
                Awareness Be Journal
              </span>
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-5 tracking-tight text-balance">
              <span className="bg-gradient-to-br from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                神經科學 · 覺察 · 自我成長
              </span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              探索身體、情緒與大腦之間的深層連結，
              <br className="hidden sm:block" />
              透過科學實證的視角，深化你的自我覺察。
            </p>
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Featured Article */}
      {featuredArticle && activeCategory === 'all' && (
        <section className="mb-14">
          <h2 className="text-[11px] uppercase tracking-editorial text-slate-400 mb-5 font-semibold">
            精選文章
          </h2>
          <ArticleCard article={featuredArticle} locale={locale} featured />
        </section>
      )}

      {/* Articles Grid */}
      <section>
        <h2 className="text-[11px] uppercase tracking-editorial text-slate-400 mb-5 font-semibold">
          {activeCategory === 'all' ? '所有文章' : activeCategory}
        </h2>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            此分類尚無文章
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles
              .filter((a) => activeCategory !== 'all' || a.slug !== featuredArticle?.slug)
              .map((article, idx) => {
                // Index into the original articles list to get a stable tint
                const originalIdx = articles.findIndex((a) => a.slug === article.slug);
                const tint = tints[originalIdx] ?? 'emerald';
                return (
                  <div key={article.slug} className="flex flex-col">
                    <ArticleCard article={article} locale={locale} />
                    {/* Per-article shop callout — renders beneath each card */}
                    <div className="mt-4">
                      <SupplementBanner
                        badge="Awareness Be Shop"
                        title={t('shop.bannerTitle')}
                        body={t('shop.bannerBody')}
                        ctaLabel={t('shop.journalCta')}
                        tint={tint}
                        variant="card"
                        animateOnView={false}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </>
  );
}
