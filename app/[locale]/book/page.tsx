import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingSection from '@/components/booking/BookingSection';
import { BookingSchema } from '@/components/seo/BookingSchema';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awarenessbe.com';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? '預約一對一教練' : 'Book a Coaching Session';
  const description =
    locale === 'zh'
      ? '預約 Awareness Be 的神經科學教練服務，結合迷走神經刺激、呼吸法與具身認知技術。'
      : 'Book a neuroscience coaching session with Awareness Be — combining vagus nerve stimulation, breathwork, and embodied cognition.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=diagnostic&lang=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BookingSchema />
      <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <Navbar locale={locale} />

        <main className="flex-1 relative z-10 pt-32">
          <BookingSection locale={locale} />
        </main>

        <Footer locale={locale} />
      </div>
    </>
  );
}
