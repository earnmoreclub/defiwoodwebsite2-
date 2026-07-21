import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Pillars from '@/components/landing/Pillars';
import BookingSection from '@/components/booking/BookingSection';
import EditorialFeed from '@/components/blog/EditorialFeed';
import AboutSection from '@/components/landing/AboutSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar locale={locale} />

      <main className="flex-1">
        <Hero locale={locale} />
        <Pillars locale={locale} />
        <EditorialFeed locale={locale} />
        <BookingSection locale={locale} />
        <AboutSection locale={locale} />
      </main>

      <Footer locale={locale} />
    </div>
  );
}