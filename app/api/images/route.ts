import { NextRequest, NextResponse } from 'next/server';
import { searchPhotos, imageQueries, getCuratedPhotos, type PexelsPhoto } from '@/lib/pexels';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Cache duration constants (in seconds)
const CACHE_DURATION = {
  PHOTO_BY_ID: 86400, // 24 hours
  SEARCH: 3600,       // 1 hour
};

// Validate and sanitize category parameter
const getValidatedCategory = (category: string | null): string => {
  const validCategories = ['hero', 'about', 'booking', 'meditation', 'nature', 'wellness', 'philosophy', 'journal', 'mbti'];
  return validCategories.includes(category || '') ? category! : 'hero';
};

// Validate and sanitize count parameter
const getValidatedCount = (count: string | null, defaultValue: number = 3): number => {
  const parsed = parseInt(count || '', 10);
  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, 10); // Cap at 10 images
};

// Fetch a specific photo by ID from Pexels
async function getPhotoById(photoId: number): Promise<PexelsPhoto | null> {
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${PEXELS_BASE_URL}/photos/${photoId}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: CACHE_DURATION.PHOTO_BY_ID },
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

// Cache control headers for response
const getCacheHeaders = (isPhotoById: boolean): Record<string, string> => ({
  'Cache-Control': `public, s-maxage=${isPhotoById ? CACHE_DURATION.PHOTO_BY_ID : CACHE_DURATION.SEARCH}, stale-while-revalidate=86400`,
  'CDN-Cache-Control': `public, max-age=${isPhotoById ? CACHE_DURATION.PHOTO_BY_ID : CACHE_DURATION.SEARCH}`,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = getValidatedCategory(searchParams.get('category'));
  const count = getValidatedCount(searchParams.get('count'));
  const photoId = searchParams.get('photoId');

  // If specific photo ID is requested, fetch that one
  if (photoId) {
    const parsedPhotoId = parseInt(photoId, 10);
    if (isNaN(parsedPhotoId)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400, headers: getCacheHeaders(true) }
      );
    }

    const photo = await getPhotoById(parsedPhotoId);
    if (photo) {
      return NextResponse.json({ photo }, { headers: getCacheHeaders(true) });
    }
    return NextResponse.json(
      { error: 'Photo not found' },
      { status: 404, headers: getCacheHeaders(true) }
    );
  }

  const queries = imageQueries[category as keyof typeof imageQueries] || imageQueries.hero;
  
  // Get one image from each query (limited by count)
  const imagePromises = queries.slice(0, count).map(async (query) => {
    const result = await searchPhotos(query, { perPage: 1 });
    return result?.photos[0] || null;
  });

  const images = await Promise.all(imagePromises);
  const validImages = images.filter((img): img is PexelsPhoto => img !== null);

  return NextResponse.json(
    {
      images: validImages,
      count: validImages.length,
    },
    { headers: getCacheHeaders(false) }
  );
}
