import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import EditorialGrid from '@/components/blog/EditorialGrid';
import { getArticles, getFeaturedArticle } from '@/lib/strapi';
import type { Article } from '@/types';

// Fallback content for development/demo before Strapi is connected
const FALLBACK_FEATURED: Article = {
  id: 'demo-1',
  title: 'The Gut-Brain Axis: How Your Microbiome Shapes Your Mental Health',
  slug: 'gut-brain-axis-microbiome-mental-health',
  excerpt: 'Discover the profound connection between your digestive system and cognitive function. New research reveals how gut bacteria influence mood, anxiety, and even decision-making.',
  content: '',
  category: { id: '1', name: 'Gut Biome', slug: 'gut-biome' },
  tags: ['Microbiome', 'Mental Health', 'Research'],
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
    excerpt: 'Learn how training your metabolism to switch between fuel sources can transform your energy levels throughout the day.',
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
    excerpt: 'Morning light exposure, evening rituals, and the science behind why your sleep quality depends on more than just hours in bed.',
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
    excerpt: 'Why the bacteria living on your scalp may be the missing piece in your hair care routine. Evidence-based insights.',
    content: '',
    category: { id: '4', name: 'Hair & Longevity', slug: 'hair-longevity' },
    tags: ['Hair', 'Microbiome'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 7,
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Vagus Nerve Stimulation: Your Body\'s Natural Healing Pathway',
    slug: 'vagus-nerve-natural-healing',
    excerpt: 'Simple daily practices to activate your parasympathetic nervous system and unlock profound healing responses.',
    content: '',
    category: { id: '3', name: 'Mindfulness', slug: 'mindfulness' },
    tags: ['Nervous System', 'Breathwork'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 6,
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Inflammation and Longevity: The Root of Chronic Disease',
    slug: 'inflammation-longevity-chronic-disease',
    excerpt: 'Understanding how chronic low-grade inflammation drives aging — and what you can do about it starting today.',
    content: '',
    category: { id: '4', name: 'Hair & Longevity', slug: 'hair-longevity' },
    tags: ['Longevity', 'Inflammation'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 9,
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-7',
    title: 'Breathwork Protocols for Stress Resilience',
    slug: 'breathwork-protocols-stress-resilience',
    excerpt: 'Clinical breathing techniques used by neuroscientists and elite performers to regulate the nervous system.',
    content: '',
    category: { id: '3', name: 'Mindfulness', slug: 'mindfulness' },
    tags: ['Breathwork', 'Stress'],
    author: { id: '1', name: 'Awareness Be Editorial' },
    readingTime: 5,
    publishedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function EditorialFeed() {
  // Fetch from Strapi, fall back to demo content
  let featured: Article = FALLBACK_FEATURED;
  let articles: Article[] = FALLBACK_ARTICLES;

  try {
    if (process.env.STRAPI_URL && process.env.STRAPI_API_TOKEN) {
      const [featuredArticle, articlesData] = await Promise.all([
        getFeaturedArticle(),
        getArticles({ pageSize: 7 }),
      ]);
      if (featuredArticle) featured = featuredArticle;
      if (articlesData.articles.length > 0) articles = articlesData.articles.slice(1);
    }
  } catch (error) {
    // Silent fallback to demo content
    console.warn('Using fallback content - Strapi not configured');
  }

  return (
    <>
      {/* Section Header */}
      <div className="mb-12 flex items-end justify-between border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-2 block">
            The Journal
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
            Insights &amp; Editorial
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden md:inline-flex items-center text-sm font-medium text-forest-800 hover:text-forest-700 transition-colors"
        >
          View All Articles
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <EditorialGrid featured={featured} articles={articles} />
    </>
  );
}