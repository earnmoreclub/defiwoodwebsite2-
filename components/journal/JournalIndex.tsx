'use client';

import { useState, useMemo } from 'react';
import { JournalArticle, JournalCategory } from '@/types/journal';
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';

interface JournalIndexProps {
  articles: JournalArticle[];
  categories: JournalCategory[];
  locale: string;
}

export default function JournalIndex({ articles, categories, locale }: JournalIndexProps) {
  const [activeCategory, setActiveCategory] = useState<JournalCategory | 'all'>('all');

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
      <section className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-purple-400/10 border border-purple-400/20">
          <span className="text-xs uppercase tracking-editorial text-purple-300 font-medium">
            Awareness Be Journal
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">
          神經科學 · 覺察 · 自我成長
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          探索身體、情緒與大腦之間的深層連結，
          透過科學實證的視角，深化你的自我覺察。
        </p>
      </section>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Featured Article */}
      {featuredArticle && activeCategory === 'all' && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-editorial text-slate-400 mb-4">
            精選文章
          </h2>
          <ArticleCard article={featuredArticle} locale={locale} featured />
        </section>
      )}

      {/* Articles Grid */}
      <section>
        <h2 className="text-xs uppercase tracking-editorial text-slate-400 mb-4">
          {activeCategory === 'all' ? '所有文章' : activeCategory}
        </h2>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            此分類尚無文章
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles
              .filter((a) => activeCategory !== 'all' || a.slug !== featuredArticle?.slug)
              .map((article) => (
                <ArticleCard key={article.slug} article={article} locale={locale} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}