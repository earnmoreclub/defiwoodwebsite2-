import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowUpRight } from 'lucide-react';
import type { Article } from '@/types';
import { getTranslations } from 'next-intl/server';

interface PostCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact';
  locale: string;
}

async function PostCard({
  article,
  variant = 'standard',
  locale,
}: PostCardProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const basePath = locale === 'zh-TW' ? '' : '/en';
  const dateLocale = locale === 'zh-TW' ? 'zh-TW' : 'en-US';

  if (variant === 'featured') {
    return (
      <article className="group">
        <Link href={`${basePath}/blog/${article.slug}`} className="block">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-purple-900/40 via-dark-800 to-cyan-900/40 rounded-2xl overflow-hidden mb-6 border border-white/5">
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
                <span className="relative text-purple-300/40 text-8xl font-serif">
                  {article.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 bg-dark-900/80 backdrop-blur-sm border border-purple-500/30 text-purple-300 text-xs uppercase tracking-editorial rounded-full">
                {article.category.name}
              </span>
            </div>
          </div>

          <div className="max-w-prose">
            <div className="flex items-center space-x-4 mb-4 text-xs text-slate-500">
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1.5" />
                {article.author.name}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                {article.readingTime} {t('article.minRead')}
              </span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-white mb-4 group-hover:text-cyan-300 transition-colors leading-snug">
              {article.title}
            </h2>

            <p className="text-slate-400 leading-relaxed">{article.excerpt}</p>
            
            <div className="mt-4 inline-flex items-center text-xs uppercase tracking-editorial text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Read more <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group pb-6 border-b border-white/5 last:border-0">
        <Link href={`${basePath}/blog/${article.slug}`} className="flex space-x-4">
          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-xl overflow-hidden border border-white/5">
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
                <span className="text-purple-300/40 text-xl font-serif">
                  {article.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase tracking-editorial text-cyan-400">
              {article.category.name}
            </span>
            <h3 className="font-serif text-base text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 mt-1">
              {article.title}
            </h3>
            <span className="text-xs text-slate-500 mt-2 block">
              {article.readingTime} {t('article.minRead')}
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`${basePath}/blog/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-900/40 via-dark-800 to-emerald-900/40 rounded-xl overflow-hidden mb-4 border border-white/5">
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10" />
              <span className="relative text-purple-300/40 text-5xl font-serif">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
        </div>

        <div className="space-y-3">
          <span className="inline-block text-xs uppercase tracking-editorial text-cyan-400">
            {article.category.name}
          </span>
          <h3 className="font-serif text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>{article.readingTime} {t('article.minRead')}</span>
            <span>·</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
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

export default PostCard;