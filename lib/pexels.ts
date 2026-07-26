const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  avg_color: string;
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

export async function searchPhotos(
  query: string,
  options: {
    perPage?: number;
    page?: number;
    orientation?: 'landscape' | 'portrait' | 'any';
    size?: 'large' | 'medium' | 'small';
  } = {}
): Promise<PexelsSearchResponse | null> {
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  const params = new URLSearchParams({
    query,
    per_page: String(options.perPage || 5),
    page: String(options.page || 1),
  });

  if (options.orientation) {
    params.set('orientation', options.orientation);
  }

  try {
    const response = await fetch(`${PEXELS_BASE_URL}/search?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`[Pexels] API error: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('[Pexels] Fetch error:', error);
    return null;
  }
}

export async function getCuratedPhotos(
  perPage: number = 10,
  page: number = 1
): Promise<PexelsSearchResponse | null> {
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${PEXELS_BASE_URL}/curated?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`[Pexels] API error: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('[Pexels] Fetch error:', error);
    return null;
  }
}

// Pre-defined image collections for different sections
export const imageQueries = {
  hero: ['mindfulness meditation person forest', 'calm person nature landscape', 'peaceful zen garden person'],
  about: ['self-discovery reflection person', 'personal growth journey', 'mindful person contemplation'],
  booking: ['professional therapist office', 'calm consultation space', 'healing wellness room'],
  meditation: ['meditation practice person', 'zen lotus pose nature', 'mindful breathing calm'],
  nature: ['serene forest mountains', 'peaceful ocean waves', 'tranquil nature landscape'],
  wellness: ['yoga practice wellness', 'holistic health balance', 'relaxation spa calm'],
  philosophy: ['yin yang balance', 'ancient wisdom modern', 'zen minimalism aesthetic'],
  journal: ['journal writing desk', 'contemplative writing moment', 'creative notebook peaceful'],
} as const;

// Curated specific image IDs for premium quality (all verified)
export const curatedImageIds = {
  hero: [156120, 13338045, 38005937], // Meditation in forest
  about: [156120, 13338045, 38005937], // Peaceful wellness
  booking: [4067759, 3958405, 4067759], // Professional calm
  meditation: [156120, 13338045, 38005937], // Zen practice  
  nature: [1287145, 15286, 1287145], // Serene nature
  wellness: [156120, 13338045, 38005937], // Health balance
};
