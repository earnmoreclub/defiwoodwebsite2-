const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awarenessbe.com';
const ORG_NAME = 'Awareness Be';
const CONTACT_EMAIL = 'hello@awarenessbe.com';

/**
 * MedicalBusiness + ProfessionalService schema for the booking section.
 *
 * Awareness Be offers neuroscience-informed 1-on-1 coaching sessions and
 * self-awareness assessments (MBTI, Johari Window, vagus nerve programs).
 *
 * Uses LocalBusiness + ProfessionalService for knowledge-graph recognition
 * on Google and Bing. Adjust priceCurrency / servesCuisine to match your
 * actual offering if needed.
 */
export function BookingSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/book/#professionalservice`,
        name: `${ORG_NAME} — Neuroscience Coaching`,
        description:
          '1-on-1 coaching sessions combining neuroscience, embodied cognition, and consciousness exploration to help clients reduce stress, improve emotional regulation, and deepen self-awareness.',
        url: `${SITE_URL}/book`,
        image: `${SITE_URL}/og-image.png`,
        telephone: '+886-2-XXXX-XXXX',
        email: CONTACT_EMAIL,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'TW',
          addressRegion: 'Taiwan',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.033,
          longitude: 121.565,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '20:00',
          },
        ],
        priceRange: '$$',
        sameAs: [
          'https://www.instagram.com/awarenessbe',
          'https://www.facebook.com/awarenessbe',
          'https://line.me/ti/p/@awarenessbe',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Coaching & Assessment Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: '1-on-1 Neuroscience Coaching Session',
                description:
                  'Personalized coaching session integrating vagus nerve stimulation, breathwork, and embodied cognition techniques.',
              },
              price: '3500',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'MBTI Brain Type Assessment + Debrief',
                description:
                  'Comprehensive MBTI assessment with expert debrief to uncover cognitive patterns and stress responses.',
              },
              price: '1500',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Johari Window Workshop',
                description:
                  'Interactive workshop using the Johari Window model to expand self-awareness and improve interpersonal dynamics.',
              },
              price: '2000',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock',
            },
          ],
        },
        aggregateRating:
          process.env.NEXT_PUBLIC_BOOKING_RATING
            ? {
                '@type': 'AggregateRating',
                ratingValue: process.env.NEXT_PUBLIC_BOOKING_RATING,
                reviewCount: process.env.NEXT_PUBLIC_BOOKING_REVIEW_COUNT ?? '50',
              }
            : undefined,
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/book/#webpage`,
        url: `${SITE_URL}/book`,
        name: `Book a Session | ${ORG_NAME}`,
        description:
          'Book a 1-on-1 neuroscience coaching session or self-awareness assessment with Awareness Be.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/book/#professionalservice` },
      },
    ],
  };

  // Strip undefined aggregateRating so JSON stays valid
  const cleaned = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }}
    />
  );
}
