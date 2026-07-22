import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeadMagnetModal from '@/components/lead-magnet/LeadMagnetModal';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: '%s | Awareness Be',
    default: 'Awareness Be — Self-Awareness Gaming Platform',
  },
  description:
    'Evidence-based neuroscience, embodied cognition, and conscious exploration for modern seekers.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className="antialiased bg-dark-950 text-slate-300 min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar locale={locale} />
          {children}
          <Footer locale={locale} />
          <LeadMagnetModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}