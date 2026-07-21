import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import type { Article } from '@/types';

interface PostCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact';
}

export default function PostCard({ article, variant = 'standard' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <article className="group">
        <Link href={`/blog/${article.slug}`} className="block">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-forest-100 to-amber-50 rounded-2xl overflow-hidden mb-6">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-forest-300 text-6xl font-serif">
                  {article.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 bg-forest-800 text-cream-50 text-xs uppercase tracking-editorial">
                {article.category.name}
              </span>
            </div>
          </div>

          <div className="max-w-prose">
            <div className="flex items-center space-x-4 mb-4 text-xs text-stone-500">
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1.5" />
                {article.author.name}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                {article.readingTime} min read
              </span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4 group-hover:text-forest-800 transition-colors leading-snug">
              {article.title}
            </h2>

            <p className="text-stone-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group pb-6 border-b border-stone-200 last:border-0">
        <Link href={`/blog/${article.slug}`} className="flex space-x-4">
          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-forest-100 to-amber-50 rounded-lg overflow-hidden">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-forest-300 text-xl font-serif">
                  {article.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-editorial text-amber-500">
              {article.category.name}
            </span>
            <h3 className="font-serif text-base text-stone-900 group-hover:text-forest-800 transition-colors leading-snug line-clamp-2 mt-1">
              {article.title}
            </h3>
            <span className="text-xs text-stone-500 mt-2 block">
              {article.readingTime} min read
            </span>
          </div>
        </Link>
      </article>
    );
  }

  // Standard variant
  return (
    <article className="group">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-forest-100 to-amber-50 rounded-xl overflow-hidden mb-4">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-forest-300 text-4xl font-serif">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <span className="inline-block text-xs uppercase tracking-editorial text-amber-500">
            {article.category.name}
          </span>
          <h3 className="font-serif text-lg text-stone-900 group-hover:text-forest-800 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center space-x-3 text-xs text-stone-500">
            <span>{article.readingTime} min read</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}