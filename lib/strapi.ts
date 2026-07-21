// Strapi 5 API Client for Awareness Be
import type { Article, Category, StrapiResponse } from '@/types';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    contentMarkdown?: string;
    readingTime: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    coverImage?: {
      data?: {
        attributes: {
          url: string;
        };
      };
    };
    category?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    tags?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
        };
      }>;
    };
    author?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          bio?: string;
          avatar?: {
            data?: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
  };
}

function transformArticle(item: StrapiArticle): Article {
  const attrs = item.attributes;
  return {
    id: String(item.id),
    title: attrs.title,
    slug: attrs.slug,
    excerpt: attrs.excerpt,
    content: attrs.contentMarkdown || attrs.content,
    contentMarkdown: attrs.contentMarkdown,
    coverImage: attrs.coverImage?.data?.attributes?.url 
      ? `${STRAPI_URL}${attrs.coverImage.data.attributes.url}`
      : undefined,
    category: attrs.category?.data 
      ? {
          id: String(attrs.category.data.id),
          name: attrs.category.data.attributes.name,
          slug: attrs.category.data.attributes.slug,
        }
      : { id: '1', name: 'Wellness', slug: 'wellness' },
    tags: attrs.tags?.data?.map(t => t.attributes.name) || [],
    author: attrs.author?.data
      ? {
          id: String(attrs.author.data.id),
          name: attrs.author.data.attributes.name,
          avatar: attrs.author.data.attributes.avatar?.data?.attributes?.url
            ? `${STRAPI_URL}${attrs.author.data.attributes.avatar.data.attributes.url}`
            : undefined,
          bio: attrs.author.data.attributes.bio,
        }
      : { id: '1', name: 'Awareness Be Team' },
    readingTime: attrs.readingTime || 5,
    publishedAt: attrs.publishedAt,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  };
}

async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get all articles
export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<{ articles: Article[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('pagination[page]', String(params.page));
  if (params?.pageSize) queryParams.set('pagination[pageSize]', String(params.pageSize));
  if (params?.category) queryParams.set('filters[category][slug][$eq]', params.category);
  
  queryParams.set('populate[0]', 'coverImage');
  queryParams.set('populate[1]', 'category');
  queryParams.set('populate[2]', 'tags');
  queryParams.set('populate[3]', 'author.avatar');
  queryParams.set('sort', 'publishedAt:desc');

  const response = await fetchStrapi<StrapiResponse<StrapiArticle[]>>(
    `articles?${queryParams.toString()}`
  );

  return {
    articles: response.data.map(transformArticle),
    total: response.meta.pagination?.total || 0,
  };
}

// Get single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const queryParams = new URLSearchParams();
  queryParams.set('filters[slug][$eq]', slug);
  queryParams.set('populate[0]', 'coverImage');
  queryParams.set('populate[1]', 'category');
  queryParams.set('populate[2]', 'tags');
  queryParams.set('populate[3]', 'author.avatar');

  const response = await fetchStrapi<StrapiResponse<StrapiArticle[]>>(
    `articles?${queryParams.toString()}`
  );

  if (response.data.length === 0) return null;
  return transformArticle(response.data[0]);
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchStrapi<{
    data: Array<{ id: number; attributes: { name: string; slug: string; description?: string } }>;
  }>('categories?sort=name:asc');

  return response.data.map(cat => ({
    id: String(cat.id),
    name: cat.attributes.name,
    slug: cat.attributes.slug,
    description: cat.attributes.description,
  }));
}

// Create article (for cron job)
export async function createArticle(article: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
}): Promise<Article> {
  const response = await fetchStrapi<StrapiResponse<StrapiArticle>>('articles', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        contentMarkdown: article.content,
        tags: article.tags,
        seoTitle: article.seoTitle,
        metaDescription: article.metaDescription,
        publishedAt: new Date().toISOString(),
        readingTime: Math.ceil(article.content.split(/\s+/).length / 200),
      },
    }),
  });

  return transformArticle(response.data);
}

// Get featured article (most recent)
export async function getFeaturedArticle(): Promise<Article | null> {
  const queryParams = new URLSearchParams();
  queryParams.set('pagination[pageSize]', '1');
  queryParams.set('populate[0]', 'coverImage');
  queryParams.set('populate[1]', 'category');
  queryParams.set('populate[2]', 'author.avatar');
  queryParams.set('sort', 'publishedAt:desc');

  const response = await fetchStrapi<StrapiResponse<StrapiArticle[]>>(
    `articles?${queryParams.toString()}`
  );

  if (response.data.length === 0) return null;
  return transformArticle(response.data[0]);
}

// Get trending articles (excluding featured)
export async function getTrendingArticles(limit: number = 4): Promise<Article[]> {
  const queryParams = new URLSearchParams();
  queryParams.set('pagination[pageSize]', String(limit + 1)); // +1 to account for featured
  queryParams.set('populate[0]', 'coverImage');
  queryParams.set('populate[1]', 'category');
  queryParams.set('populate[2]', 'author.avatar');
  queryParams.set('sort', 'publishedAt:desc');

  const response = await fetchStrapi<StrapiResponse<StrapiArticle[]>>(
    `articles?${queryParams.toString()}`
  );

  return response.data.slice(0, limit).map(transformArticle);
}