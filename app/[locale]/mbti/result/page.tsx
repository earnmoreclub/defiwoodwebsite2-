import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MBTIResult from '@/components/mbti/MBTIResult';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

export default async function MBTIResultPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const validType = sp.type?.toUpperCase() as
    | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
    | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
    | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
    | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'
    | undefined;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <Navbar locale={locale} />

      <main className="flex-1 relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-slate-400">Loading\u2026</div>}>
            <MBTIResult initialType={validType} />
          </Suspense>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}