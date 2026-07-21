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
  hero: ['mindfulness', 'meditation', 'calm nature'],
  about: ['self-discovery', 'personal growth', 'peaceful moment'],
  booking: ['consultation', 'professional therapist', 'calm office'],
  meditation: ['meditation', 'zen', 'peaceful practice'],
  nature: ['forest', 'mountain', 'ocean waves'],
  wellness: ['yoga', 'breathing exercises', 'relaxation'],
} as const;
