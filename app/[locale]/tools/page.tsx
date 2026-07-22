import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ToolsPageClient from '@/components/tools/ToolsPageClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awarenessbe.com';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Tools — A quieter next step | Awareness Be';
  const description =
    'A private, browser-only ritual engine. Tell us what feels present and receive one considered practice — breathwork, somatic reset, sensory pause — without adding more noise.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=home`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ToolsPageClient />;
}
