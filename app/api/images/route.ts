import { NextRequest, NextResponse } from 'next/server';
import { searchPhotos, imageQueries, getCuratedPhotos } from '@/lib/pexels';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

const imageQueryMap: Record<string, readonly string[]> = {
  hero: imageQueries.hero,
  about: imageQueries.about,
  booking: imageQueries.booking,
  meditation: imageQueries.meditation,
  nature: imageQueries.nature,
  wellness: imageQueries.wellness,
  philosophy: imageQueries.philosophy,
  journal: imageQueries.journal,
  mbti: imageQueries.mbti,
};

// Fetch a specific photo by ID from Pexels
async function getPhotoById(photoId: number) {
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${PEXELS_BASE_URL}/photos/${photoId}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'hero';
  const count = parseInt(searchParams.get('count') || '3', 10);
  const photoId = searchParams.get('photoId');

  // If specific photo ID is requested, fetch that one
  if (photoId) {
    const photo = await getPhotoById(parseInt(photoId, 10));
    if (photo) {
      return NextResponse.json({ photo });
    }
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  const queries = imageQueryMap[category] || imageQueries.hero;
  
  // Get one image from each query
  const imagePromises = queries.slice(0, count).map(async (query) => {
    const result = await searchPhotos(query, { perPage: 1 });
    return result?.photos[0] || null;
  });

  const images = await Promise.all(imagePromises);
  const validImages = images.filter(Boolean);

  return NextResponse.json({
    images: validImages,
    count: validImages.length,
  });
}
