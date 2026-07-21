import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import EditorialGrid from '@/components/blog/EditorialGrid';
import { getArticles, getFeaturedArticle } from '@/lib/strapi';
import type { Article } from '@/types';

interface EditorialFeedProps {
  locale: string;
}

// Fallback content for development/demo before Strapi is connected
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

export default async function EditorialFeed({ locale }: EditorialFeedProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const basePath = locale === 'zh-TW' ? '' : '/en';

  let featured: Article = FALLBACK_FEATURED;
  let articles: Article[] = FALLBACK_ARTICLES;

  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      const [featuredArticle, articlesData] = await Promise.all([
        getFeaturedArticle(),
        getArticles({ pageSize: 7, locale }),
      ]);
      if (featuredArticle) featured = featuredArticle;
      if (articlesData.articles.length > 0) articles = articlesData.articles.slice(1);
    }
  } catch {
    console.warn('Using fallback content - Strapi not configured');
  }

  return (
    <>
      <div className="mb-12 flex items-end justify-between border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-2 block">
            {t('sectionSubtitle')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
            {t('sectionTitle')}
          </h2>
        </div>
        <Link
          href={`${basePath}/blog`}
          className="hidden md:inline-flex items-center text-sm font-medium text-forest-800 hover:text-forest-700 transition-colors"
        >
          {t('viewAll')}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <EditorialGrid featured={featured} articles={articles} locale={locale} />
    </>
  );
}
