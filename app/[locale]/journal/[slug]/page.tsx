import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { format, parseISO } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react';
import { getAllArticles, getArticleBySlug } from '@/lib/journal';
import { TableOfContentsItem } from '@/types/journal';
import TableOfContents from '@/components/journal/TableOfContents';
import JournalCTA from '@/components/journal/JournalCTA';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://awarenessbe.com';

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  const locales = ['en', 'zh-TW'];

  return locales.flatMap((locale) =>
    articles.map((article) => ({
      locale,
      slug: article.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = getArticleBySlug(params.slug);
  if (!data) return { title: 'Article Not Found' };

  const { article } = data;
  const url = `${SITE_URL}/${params.locale}/journal/${article.slug}`;
  const ogImage = article.coverImage || `${SITE_URL}/og/journal-default.png`;

  return {
    title: `${article.title} | Awareness Be Journal`,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: 'Awareness Be',
      locale: params.locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
  };
}

/**
 * Parse headings from raw markdown content to build a TOC.
 */
function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TableOfContentsItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
    items.push({ id, title, level });
  }

  return items;
}

export default function ArticlePage({ params }: PageProps) {
  const data = getArticleBySlug(params.slug);
  if (!data) notFound();

  const { article, content } = data;
  const toc = extractTableOfContents(content);
  const dateLocale = params.locale === 'zh-TW' ? zhTW : enUS;
  const formattedDate = format(parseISO(article.publishedAt), 'yyyy 年 M 月 d 日', {
    locale: dateLocale,
  });

  // JSON-LD structured data for Google Search (Article schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.coverImage
      ? [`${SITE_URL}${article.coverImage}`]
      : [`${SITE_URL}/og/journal-default.png`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Awareness Be',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${params.locale}/journal/${article.slug}`,
    },
    keywords: article.tags?.join(', '),
    articleSection: article.category,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href={`/${params.locale}/journal`}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回 Journal
          </Link>

          <div className="flex gap-8">
            {/* Main article */}
            <article className="flex-1 max-w-3xl mx-auto xl:mx-0">
              {/* Header */}
              <header className="mb-12">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-purple-400/10 text-purple-300 rounded-full border border-purple-400/20">
                  {article.category}
                </div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                  {article.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {article.author.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readingTime} 分鐘閱讀
                  </span>
                </div>
              </header>

              {/* Cover image */}
              {article.coverImage && (
                <div className="relative aspect-[16/9] mb-12 rounded-2xl overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                  />
                </div>
              )}

              {/* MDX Content */}
              <div className="prose prose-invert prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-white
                prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-purple-300 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-cyan-300 prose-code:bg-dark-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-l-purple-500 prose-blockquote:text-slate-400
                prose-li:text-slate-300
                prose-hr:border-white/10
              ">
                <MDXRemote
                  source={content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [
                          rehypeAutolinkHeadings,
                          {
                            behavior: 'wrap',
                            properties: { className: ['anchor-link'] },
                          },
                        ],
                      ],
                    },
                  }}
                />
              </div>

              {/* CTA Banner */}
              <JournalCTA locale={params.locale} />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xs uppercase tracking-editorial text-slate-400 mb-4">
                    標籤
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm text-slate-300 bg-dark-700 rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar TOC */}
            <TableOfContents items={toc} />
          </div>
        </div>
      </main>
    </>
  );
}