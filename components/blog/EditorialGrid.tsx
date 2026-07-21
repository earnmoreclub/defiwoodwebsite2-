'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import PostCard from './PostCard';
import type { Article } from '@/types';

interface EditorialGridProps {
  featured: Article | null;
  articles: Article[];
}

const CATEGORIES = [
  { name: 'All', slug: 'all' },
  { name: 'Metabolic Health', slug: 'metabolic-health' },
  { name: 'Gut Biome', slug: 'gut-biome' },
  { name: 'Hair & Longevity', slug: 'hair-longevity' },
  { name: 'Mindfulness', slug: 'mindfulness' },
];

export default function EditorialGrid({ featured, articles }: EditorialGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category.slug === activeCategory);

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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            Editorial
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
            Latest Insights
          </h2>
          <p className="text-stone-600 max-w-2xl">
            Evidence-based articles on metabolic health, gut resilience, and 
            conscious living — written to inform and empower your wellness journey.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-stone-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`text-xs uppercase tracking-editorial transition-colors ${
                activeCategory === cat.slug
                  ? 'text-forest-800 border-b-2 border-forest-800 pb-1'
                  : 'text-stone-500 hover:text-forest-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Editorial Layout */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Featured + Grid */}
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
                    {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <PostCard article={featured} variant="featured" />
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
                  <PostCard article={article} variant="standard" />
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && !featured && (
              <div className="text-center py-16">
                <p className="text-stone-500 mb-4">
                  Articles coming soon via our AI-powered content engine.
                </p>
                <Link 
                  href="/blog"
                  className="text-forest-800 hover:text-forest-700 inline-flex items-center text-sm"
                >
                  Browse all articles <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-12">
              {/* Trending */}
              <div>
                <h3 className="font-serif text-xl text-stone-900 mb-6 pb-3 border-b border-stone-200">
                  Trending in Wellness
                </h3>
                <div className="space-y-6">
                  {articles.slice(0, 4).map((article) => (
                    <PostCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-forest-800 text-cream-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-forest-700 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="font-serif text-xl mb-3">
                  The Awareness Letter
                </h3>
                <p className="text-cream-100/80 text-sm mb-6 leading-relaxed">
                  Weekly evidence-based insights on metabolic health, gut resilience, 
                  and conscious living. No noise — just clarity.
                </p>
                
                {subscribed ? (
                  <div className="bg-forest-700/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-amber-300">Welcome aboard ✨</p>
                    <p className="text-xs text-cream-100/60 mt-1">
                      Check your inbox for confirmation
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-forest-700 border border-forest-600 text-cream-50 placeholder-cream-100/40 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-amber-300 text-forest-900 text-xs uppercase tracking-editorial font-medium hover:bg-amber-200 transition-colors"
                    >
                      Subscribe
                    </button>
                    <p className="text-xs text-cream-100/40">
                      Unsubscribe anytime. We respect your inbox.
                    </p>
                  </form>
                )}
              </div>

              {/* About Card */}
              <div className="bg-cream-50 border border-stone-200 rounded-2xl p-8">
                <h3 className="font-serif text-lg text-stone-900 mb-3">
                  About Awareness Be
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  We bridge evidence-based metabolic health, gut resilience, and 
                  conscious living — empowering you to thrive from the inside out.
                </p>
                <Link 
                  href="/#about"
                  className="text-forest-800 hover:text-forest-700 text-sm inline-flex items-center"
                >
                  Our philosophy <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}