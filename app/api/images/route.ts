import { NextRequest, NextResponse } from 'next/server';
import { searchPhotos, imageQueries, type PexelsPhoto } from '@/lib/pexels';

// Cache duration constants (in seconds) - longer for better performance
const CACHE_DURATION = {
  PHOTO_BY_ID: 86400 * 7, // 7 days for specific photos
  SEARCH: 86400,          // 24 hours for searches
  CATEGORY_BATCH: 86400 * 3, // 3 days for category batches
} as const;

// Valid categories - strict allowlist
const VALID_CATEGORIES = ['hero', 'about', 'booking', 'meditation', 'nature', 'wellness', 'philosophy', 'journal', 'mbti'] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

// Validate and sanitize category parameter
const getValidatedCategory = (category: string | null): ValidCategory => {
  return VALID_CATEGORIES.includes(category as ValidCategory) 
    ? category as ValidCategory 
    : 'hero';
};

// Validate and sanitize count parameter
const getValidatedCount = (count: string | null, defaultValue: number = 3): number => {
  const parsed = parseInt(count || '', 10);
  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, 10);
};

// Fetch a specific photo by ID from Pexels
async function getPhotoById(photoId: number): Promise<PexelsPhoto | null> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
      headers: { Authorization: PEXELS_API_KEY },
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

// Fetch multiple photos for a category in parallel
async function getCategoryImages(
  category: ValidCategory, 
  count: number
): Promise<PexelsPhoto[]> {
  const queries = imageQueries[category] || imageQueries.hero;
  
  // Fetch in parallel - limited by count
  const imagePromises = queries.slice(0, count).map(async (query) => {
    const result = await searchPhotos(query, { perPage: 1 });
    return result?.photos[0] || null;
  });

  const images = await Promise.all(imagePromises);
  return images.filter((img): img is PexelsPhoto => img !== null);
}

// Cache control headers for response
const getCacheHeaders = (duration: number): Record<string, string> => ({
  'Cache-Control': `public, s-maxage=${duration}, stale-while-revalidate=86400`,
  'CDN-Cache-Control': `public, max-age=${Math.floor(duration / 2)}`,
});

// API Response types
interface PhotoResponse {
  photo: PexelsPhoto;
  cachedAt: string;
}

interface CategoryResponse {
  images: PexelsPhoto[];
  category: ValidCategory;
  count: number;
  cachedAt: string;
}

interface ErrorResponse {
  error: string;
  message?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  
  const category = getValidatedCategory(searchParams.get('category'));
  const count = getValidatedCount(searchParams.get('count'));
  const photoId = searchParams.get('photoId');
  const batch = searchParams.get('batch') === 'true';

  // Handle single photo request
  if (photoId) {
    const parsedPhotoId = parseInt(photoId, 10);
    if (isNaN(parsedPhotoId)) {
      return NextResponse.json(
        { error: 'Invalid photo ID', message: 'Photo ID must be a number' } as ErrorResponse,
        { status: 400, headers: getCacheHeaders(CACHE_DURATION.PHOTO_BY_ID) }
      );
    }

    const photo = await getPhotoById(parsedPhotoId);
    if (photo) {
      return NextResponse.json(
        { photo, cachedAt: new Date().toISOString() } as PhotoResponse,
        { headers: getCacheHeaders(CACHE_DURATION.PHOTO_BY_ID) }
      );
    }
    return NextResponse.json(
      { error: 'Photo not found', message: `No photo found with ID ${parsedPhotoId}` } as ErrorResponse,
      { status: 404, headers: getCacheHeaders(CACHE_DURATION.PHOTO_BY_ID) }
    );
  }

  // Handle batch category request (multiple images at once)
  if (batch) {
    const images = await getCategoryImages(category, count);
    return NextResponse.json(
      { 
        images, 
        category, 
        count: images.length,
        cachedAt: new Date().toISOString() 
      } as CategoryResponse,
      { headers: getCacheHeaders(CACHE_DURATION.CATEGORY_BATCH) }
    );
  }

  // Default: single image for category (legacy support)
  const images = await getCategoryImages(category, count);
  const firstImage = images[0] || null;

  if (!firstImage) {
    return NextResponse.json(
      { error: 'No images found', message: `Could not find images for category: ${category}` } as ErrorResponse,
      { status: 404, headers: getCacheHeaders(CACHE_DURATION.SEARCH) }
    );
  }

  return NextResponse.json(
    { photo: firstImage, cachedAt: new Date().toISOString() } as PhotoResponse,
    { headers: getCacheHeaders(CACHE_DURATION.SEARCH) }
  );
}
