import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PhilosophyExperience from '@/components/philosophy/PhilosophyExperience';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh-TW';
  return {
    title: isZh ? '理念 · Awareness Be' : 'Philosophy · Awareness Be',
    description: isZh
      ? '一處安靜的儀式與覺察品牌 —— 提出更溫柔的下一步。'
      : 'A quieter next step. Mindfulness, ritual, and considered support for modern life.',
  };
}

export default async function PhilosophyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PhilosophyExperience locale={locale} />;
}
