import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Awareness Be | Science-Backed Wellness for Modern Living',
    template: '%s | Awareness Be',
  },
  description: 'Evidence-based metabolic health, gut resilience, and conscious living. Begin your wellness journey with Awareness Be — Est. 2026.',
  keywords: ['wellness', 'metabolic health', 'gut health', 'holistic', 'longevity', 'mindfulness'],
  authors: [{ name: 'Awareness Be' }],
  openGraph: {
    title: 'Awareness Be',
    description: 'Evidence-based metabolic health, gut resilience, and conscious living.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-cream-50 text-stone-700 antialiased font-sans">
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}