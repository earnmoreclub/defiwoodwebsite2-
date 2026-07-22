const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awarenessbe.com';
const ORG_NAME = 'Awareness Be';
const LOGO_URL = `${SITE_URL}/og-logo.png`;
const CONTACT_EMAIL = 'hello@awarenessbe.com';

/** Root layout — WebSite + Organization schema */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORG_NAME,
        description:
          'Evidence-based neuroscience, embodied cognition, and conscious exploration for modern seekers.',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en', 'zh-TW'],
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: ORG_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 512,
          height: 512,
        },
        description:
          'Evidence-based neuroscience, embodied cognition, and conscious exploration for modern seekers.',
        email: CONTACT_EMAIL,
        sameAs: [
          'https://www.instagram.com/awarenessbe',
          'https://www.facebook.com/awarenessbe',
          'https://line.me/ti/p/@awarenessbe',
        ],
        areaServed: [
          { '@type': 'Country', name: 'Taiwan' },
          { '@type': 'Country', name: 'Hong Kong' },
          { '@type': 'Country', name: 'Singapore' },
          { '@type': 'Country', name: 'United States' },
        ],
        knowsAbout: [
          'Neuroscience',
          'Embodied Cognition',
          'Vagus Nerve Stimulation',
          'MBTI',
          'Johari Window',
          'Consciousness Studies',
          'Breathwork',
          'Psychology',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
