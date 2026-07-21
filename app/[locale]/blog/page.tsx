import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/strapi';
import PostCard from '@/components/blog/PostCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Article, Category } from '@/types';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: `${t('pageTitle')} | Awareness Be`,
    description: t('pageSubtitle'),
  };
}

const FALLBACK_ARTICLES: Article[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
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
    id: '3',
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
    id: '4',
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

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Gut Biome', slug: 'gut-biome' },
  { id: '2', name: 'Metabolic Health', slug: 'metabolic-health' },
  { id: '3', name: 'Mindfulness', slug: 'mindfulness' },
  { id: '4', name: 'Hair & Longevity', slug: 'hair-longevity' },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  let articles = FALLBACK_ARTICLES;
  let categories = FALLBACK_CATEGORIES;

  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      const [articlesData, categoriesData] = await Promise.all([
        getArticles({ pageSize: 50, locale }),
        getCategories(locale),
      ]);
      if (articlesData.articles.length > 0) articles = articlesData.articles;
      if (categoriesData.length > 0) categories = categoriesData;
    }
  } catch {
    console.warn('Using fallback content - Strapi not configured');
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar locale={locale} />

      <div className="bg-white flex-1">
        <header className="border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
                {t('sectionSubtitle')}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
                {t('pageTitle')}
              </h1>
              <p className="text-stone-600 leading-relaxed">
                {t('pageSubtitle')}
              </p>
            </div>
          </div>
        </header>

        <div className="border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial">
                {t('categoryAll')}
              </span>
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-4 py-2 border border-stone-200 text-stone-700 text-xs uppercase tracking-editorial hover:border-forest-400 hover:text-forest-800 transition-colors cursor-pointer"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <PostCard key={article.id} article={article} variant="standard" locale={locale} />
            ))}
          </div>
        </section>

        <section className="bg-forest-800 text-cream-50 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-12 h-12 mx-auto mb-6 bg-forest-700 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <h2 className="font-serif text-3xl mb-4">
              {t('sidebar.newsletterTitle')}
            </h2>
            <p className="text-cream-100/80 mb-8 leading-relaxed">
              {t('sidebar.newsletterDescription')}
            </p>
            <a
              href={`${locale === 'zh-TW' ? '' : '/en'}/#book`}
              className="inline-flex items-center px-8 py-4 bg-amber-300 text-forest-900 text-xs uppercase tracking-editorial font-medium hover:bg-amber-200 transition-colors"
            >
              {t('sidebar.newsletterCta')}
            </a>
          </div>
        </section>
      </div>

      <Footer locale={locale} />
    </div>
  );
}