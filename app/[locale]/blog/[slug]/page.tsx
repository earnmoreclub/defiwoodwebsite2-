import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { getArticleBySlug, getArticles } from '@/lib/strapi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PostCard from '@/components/blog/PostCard';
import type { Article } from '@/types';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale).catch(() => null);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

const FALLBACK: Record<string, Article> = {
  'gut-brain-axis-microbiome-mental-health': {
    id: '1',
    title: 'The Gut-Brain Axis: How Your Microbiome Shapes Your Mental Health',
    slug: 'gut-brain-axis-microbiome-mental-health',
    excerpt: 'Discover the profound connection between your digestive system and cognitive function.',
    content: `## The Gut-Brain Connection

The gut-brain axis represents one of the most fascinating frontiers in modern medicine. Your gut contains 500 million neurons — more than your spinal cord — and houses the enteric nervous system, often called the "second brain."

### How Bacteria Talk to Your Brain

Trillions of microorganisms in your gut produce neurotransmitters, including:
- 90% of your body's serotonin
- Significant amounts of dopamine and GABA
- Short-chain fatty acids that cross the blood-brain barrier

### What the Research Shows

Recent studies demonstrate that people with depression often have measurably different gut flora than those without. The implications are profound: mental wellness may be partially addressable through nutrition.

## Practical Steps

1. Eat 30+ plant varieties per week
2. Include fermented foods daily
3. Prioritize fiber diversity
4. Consider targeted probiotics after consultation

## The Bottom Line

Your gut is not separate from your mind — it's deeply integrated into everything you feel. Nourishing it is foundational mental healthcare.`,
    category: { id: '1', name: 'Gut Biome', slug: 'gut-biome' },
    tags: ['Microbiome', 'Mental Health'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 8,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const basePath = locale === 'zh-TW' ? '' : '/en';
  const dateLocale = locale === 'zh-TW' ? 'zh-TW' : 'en-US';
  const minRead = locale === 'zh-TW' ? '分鐘閱讀' : 'min read';

  let article: Article | null = null;

  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      article = await getArticleBySlug(slug, locale);
    }
  } catch {
    article = null;
  }

  if (!article && FALLBACK[slug]) {
    article = FALLBACK[slug];
  }

  if (!article) {
    notFound();
  }

  let related: Article[] = [];
  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      const data = await getArticles({ pageSize: 3, locale });
      related = data.articles.filter(a => a.slug !== slug).slice(0, 3);
    }
  } catch {
    related = [];
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar locale={locale} />

      <article className="flex-1 relative z-10 pt-32">
        {/* Back nav */}
        <div className="border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href={`${basePath}/blog`}
              className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {locale === 'zh-TW' ? '返回文章列表' : 'Back to Articles'}
            </Link>
          </div>
        </div>

        {/* Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12">
          <div className="flex items-center space-x-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs uppercase tracking-editorial rounded-full">
              {article.category.name}
            </span>
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-slate-500">#{tag}</span>
            ))}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6 text-balance">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pb-8 border-b border-white/10">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2 text-purple-400" />
              {article.author.name}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-cyan-400" />
              {article.readingTime} {minRead}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </time>
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="prose-editorial">
              {article.content.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('# ')) {
                  return <h1 key={i}>{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.match(/^\d+\./)) {
                  return <li key={i} className="leading-relaxed ml-6 mb-2 list-decimal">{paragraph.replace(/^\d+\.\s*/, '')}</li>;
                }
                if (paragraph.startsWith('- ')) {
                  return <li key={i} className="leading-relaxed ml-6 mb-2 list-disc">{paragraph.replace(/^-\s*/, '')}</li>;
                }
                if (paragraph.trim() === '') return null;
                return <p key={i}>{paragraph}</p>;
              })}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-white/5 py-20 bg-dark-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl text-white mb-8 text-center">
                <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
                  {locale === 'zh-TW' ? '延伸閱讀' : 'Continue Reading'}
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {related.map((a) => (
                  <PostCard key={a.id} article={a} variant="standard" locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer locale={locale} />
    </div>
  );
}