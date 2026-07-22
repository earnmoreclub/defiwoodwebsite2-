import type { Metadata } from 'next';
import { OrganizationSchema } from '@/components/seo/StructuredData';

// Root layout - actual layout lives in [locale]/layout.tsx
// This file must exist for Next.js App Router
export const metadata: Metadata = {
  title: 'Awareness Be',
  description: 'Holistic Health & Metabolic Wellness',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationSchema />
      {children}
    </>
  );
}
