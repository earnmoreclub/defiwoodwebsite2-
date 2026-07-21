import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingSection from '@/components/booking/BookingSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar locale={locale} />
      <BookingSection locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}