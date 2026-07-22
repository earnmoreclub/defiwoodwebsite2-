import Link from 'next/link';
import Image from 'next/image';
import { JournalArticle } from '@/types/journal';
import { Clock, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';

interface ArticleCardProps {
  article: JournalArticle;
  locale: string;
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  '具身認知': 'from-emerald-400 to-teal-400',
  '迷走神經': 'from-purple-400 to-fuchsia-400',
  '情緒韌性': 'from-amber-400 to-orange-400',
  '腦科學': 'from-cyan-400 to-blue-400',
};

export default function ArticleCard({ article, locale, featured }: ArticleCardProps) {
  const dateLocale = locale === 'zh-TW' ? zhTW : enUS;
  const formattedDate = format(parseISO(article.publishedAt), 'yyyy 年 M 月 d 日', {
    locale: dateLocale,
  });
  const gradientClass = CATEGORY_COLORS[article.category] || 'from-purple-400 to-cyan-400';

  return (
    <Link href={`/${locale}/journal/${article.slug}`} className="group block">
      <article
        className={`
          glass rounded-2xl overflow-hidden transition-all duration-300
          hover:ring-1 hover:ring-white/20 hover:shadow-xl hover:shadow-purple-500/10
          hover:-translate-y-1
          ${featured ? 'md:flex md:gap-6' : ''}
        `}
      >
        {article.coverImage && (
          <div
            className={`
              relative overflow-hidden
              ${featured ? 'md:w-1/2 aspect-[16/10]' : 'aspect-[16/9]'}
            `}
          >
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
          </div>
        )}

        <div className={`p-6 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
          {/* Category badge */}
          <div className="mb-3">
            <span
              className={`inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent rounded-full`}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`
              font-serif text-white mb-3 group-hover:text-purple-300 transition-colors
              ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}
            `}
          >
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {article.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} 分鐘閱讀
            </span>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] text-slate-500 bg-dark-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
