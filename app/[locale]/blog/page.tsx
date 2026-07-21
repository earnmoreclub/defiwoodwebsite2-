import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EditorialGrid from '@/components/blog/EditorialGrid';
import { getArticles, getFeaturedArticle } from '@/lib/strapi';
import type { Article } from '@/types';
import { Sparkles } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

const FALLBACK_FEATURED: Article = {
  id: 'demo-1',
  title: 'The Gut-Brain Axis: How Your Microbiome Shapes Your Mental Health',
  slug: 'gut-brain-axis-microbiome-mental-health',
  excerpt: 'Discover the profound connection between your digestive system and cognitive function.',
  content: '',
  category: { id: '1', name: 'Gut Biome', slug: 'gut-biome' },
  tags: ['Microbiome', 'Mental Health'],
  author: { id: '1', name: 'Awareness Be Editorial' },
  readingTime: 8,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 'demo-2',
    title: 'Metabolic Flexibility: The Key to Sustainable Energy',
    slug: 'metabolic-flexibility-sustainable-energy',
    excerpt: 'Learn how training your metabolism to switch between fuel sources.',
    content: '',
    category: { id: '2', name: 'Metabolic Health', slug: 'metabolic-health' },
    tags: ['Metabolism', 'Nutrition'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 6,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Circadian Rhythm Alignment: Optimizing Sleep Through Light',
    slug: 'circadian-rhythm-alignment-sleep',
    excerpt: 'The science behind why sleep quality depends on more than hours in bed.',
    content: '',
    category: { id: '3', name: 'Mindfulness', slug: 'mindfulness' },
    tags: ['Sleep', 'Circadian'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 5,
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'The Scalp Microbiome: A Hidden Foundation for Hair Health',
    slug: 'scalp-microbiome-hair-health',
    excerpt: 'Why the bacteria on your scalp may be the missing piece in hair care.',
    content: '',
    category: { id: '4', name: 'Hair & Longevity', slug: 'hair-longevity' },
    tags: ['Hair', 'Microbiome'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 7,
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  let featured: Article | null = FALLBACK_FEATURED;
  let articles: Article[] = FALLBACK_ARTICLES;

  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      const [featuredArticle, articlesData] = await Promise.all([
        getFeaturedArticle(),
        getArticles({ pageSize: 12, locale }),
      ]);
      if (featuredArticle) featured = featuredArticle;
      if (articlesData.articles.length > 0) articles = articlesData.articles.slice(1);
    }
  } catch {
    console.warn('Using fallback content');
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar locale={locale} />

      <main className="flex-1 relative z-10 pt-32">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-cyan-400 mb-4 px-4 py-1.5 glass rounded-full">
              <Sparkles className="w-3 h-3" />
              {t('sectionSubtitle')}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-4 text-balance">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {t('pageTitle')}
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('pageSubtitle')}
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-8" />
          </div>

          <EditorialGrid featured={featured} articles={articles} locale={locale} />
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}