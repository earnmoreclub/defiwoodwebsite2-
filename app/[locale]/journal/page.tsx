import { Metadata } from 'next';
import { getAllArticles, getAllCategories } from '@/lib/journal';
import JournalIndex from '@/components/journal/JournalIndex';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://awarenessbe.com';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale;
  const title = 'Journal | Awareness Be — 神經科學與自我覺察';
  const description =
    '探索具身認知、迷走神經、情緒韌性與腦科學的最新研究。透過科學實證的視角，深化你的自我覺察與身心整合。';
  const url = `${SITE_URL}/${locale}/journal`;

  return {
    title,
    description,
    keywords: [
      '具身認知',
      '迷走神經',
      '情緒韌性',
      '腦科學',
      '自我覺察',
      'MBTI',
      '神經可塑性',
      '正念',
    ],
    alternates: {
      canonical: url,
      languages: {
        'zh-TW': `${SITE_URL}/zh-TW/journal`,
        en: `${SITE_URL}/en/journal`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Awareness Be',
      locale: locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og/journal.png`,
          width: 1200,
          height: 630,
          alt: 'Awareness Be Journal',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og/journal.png`],
    },
  };
}

export default function JournalPage({
  params,
}: {
  params: { locale: string };
}) {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <JournalIndex articles={articles} categories={categories} locale={params.locale} />
      </div>
    </main>
  );
}