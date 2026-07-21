import { NextRequest, NextResponse } from 'next/server';
import { searchPhotos, imageQueries } from '@/lib/pexels';

const imageQueryMap: Record<string, readonly string[]> = {
  hero: imageQueries.hero,
  about: imageQueries.about,
  meditation: imageQueries.meditation,
  nature: imageQueries.nature,
  wellness: imageQueries.wellness,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'hero';
  const count = parseInt(searchParams.get('count') || '3', 10);

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
