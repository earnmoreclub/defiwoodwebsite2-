import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/strapi';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Awareness Be',
    };
  }

  return {
    title: `${article.title} | Awareness Be`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="bg-white">
      {/* Hero */}
      <header className="bg-cream-50 border-b border-stone-200">
        <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link
            href="/blog"
            className="inline-flex items-center text-xs uppercase tracking-editorial text-stone-500 hover:text-forest-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back to Articles
          </Link>

          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs uppercase tracking-editorial mb-6">
            {article.category.name}
          </span>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1.5" />
              {article.author.name}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1.5" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1.5" />
              {article.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full rounded-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="prose-editorial">
          {article.contentMarkdown ? (
            <MarkdownRenderer content={article.contentMarkdown} />
          ) : (
            <p className="text-stone-600">{article.content}</p>
          )}
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-stone-100 text-stone-600 text-xs uppercase tracking-editorial"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-forest-800 text-cream-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-serif text-2xl mb-3">
            Translate Insights into Action
          </h3>
          <p className="text-cream-100/80 mb-6 max-w-md mx-auto leading-relaxed">
            Book a personalized 1-on-1 consultation to create a tailored 
            protocol based on your unique health goals.
          </p>
          <Link
            href="/#book"
            className="inline-flex items-center px-8 py-4 bg-amber-300 text-forest-900 text-xs uppercase tracking-editorial font-medium hover:bg-amber-200 transition-colors"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>
    </article>
  );
}

// Simple markdown renderer (basic)
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-6 text-stone-700 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={i} className="font-serif text-3xl text-stone-900 mt-8">
              {trimmed.slice(2)}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="font-serif text-2xl text-stone-900 mt-8">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="font-serif text-xl text-stone-900 mt-6">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-4 border-amber-400 pl-6 italic text-stone-600">
              {trimmed.slice(2)}
            </blockquote>
          );
        }
        if (trimmed.startsWith('- ')) {
          return (
            <li key={i} className="ml-6 list-disc">
              {trimmed.slice(2)}
            </li>
          );
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return (
            <p key={i} className="font-medium text-stone-900">
              {trimmed.slice(2, -2)}
            </p>
          );
        }
        if (trimmed === '') return null;
        
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}