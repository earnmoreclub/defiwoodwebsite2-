import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/landing/Hero';
import Pillars from '@/components/landing/Pillars';
import BookingSection from '@/components/booking/BookingSection';
import AboutSection from '@/components/landing/AboutSection';
import MBTISection from '@/components/landing/MBTISection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="flex-1 relative z-10">
        <Hero locale={locale} />
        <MBTISection locale={locale} />
        <Pillars locale={locale} />
        <BookingSection locale={locale} />
        <AboutSection locale={locale} />
      </main>
    </div>
  );
}
