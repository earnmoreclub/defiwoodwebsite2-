const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Cache durations (in seconds)
const CACHE_DURATION = {
  SEARCH: 3600,        // 1 hour
  CURATED: 3600,       // 1 hour
} as const;

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

export interface PexelsSearchOptions {
  perPage?: number;
  page?: number;
  orientation?: 'landscape' | 'portrait' | 'any';
  size?: 'large' | 'medium' | 'small';
}

// Pre-defined image query collections
export const imageQueries = {
  hero: ['mindfulness meditation person forest', 'calm person nature landscape', 'peaceful zen garden person'],
  about: ['self-discovery reflection person', 'personal growth journey', 'mindful person contemplation'],
  booking: ['professional therapist office', 'calm consultation space', 'healing wellness room'],
  meditation: ['meditation practice person', 'zen lotus pose nature', 'mindful breathing calm'],
  nature: ['serene forest mountains', 'peaceful ocean waves', 'tranquil nature landscape'],
  wellness: ['yoga practice wellness', 'holistic health balance', 'relaxation spa calm'],
  philosophy: ['yin yang balance', 'ancient wisdom modern', 'zen minimalism aesthetic'],
  journal: ['journal writing desk', 'contemplative writing moment', 'creative notebook peaceful'],
  mbti: ['person thinking mirror reflection', 'psychology self discovery', 'mind map creative thinking'],
} as const;

export type ImageCategory = keyof typeof imageQueries;

// Curated specific image IDs for premium quality (all verified)
export const curatedImageIds: Record<ImageCategory, readonly number[]> = {
  hero: [156120, 13338045, 38005937],
  about: [156120, 13338045, 38005937],
  booking: [4067759, 3958405, 4067759],
  meditation: [156120, 13338045, 38005937],
  nature: [1287145, 15286, 1287145],
  wellness: [156120, 13338045, 38005937],
  philosophy: [156120, 13338045, 38005937],
  journal: [156120, 13338045, 38005937],
  mbti: [156120, 13338045, 38005937],
} as const;

export async function searchPhotos(
  query: string,
  options: PexelsSearchOptions = {}
): Promise<PexelsSearchResponse | null> {
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  const params = new URLSearchParams({
    query,
    per_page: String(options.perPage ?? 5),
    page: String(options.page ?? 1),
  });

  if (options.orientation) {
    params.set('orientation', options.orientation);
  }

  try {
    const response = await fetch(`${PEXELS_BASE_URL}/search?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: CACHE_DURATION.SEARCH },
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
        next: { revalidate: CACHE_DURATION.CURATED },
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