/**
 * Server-side Pexels API utilities
 * 
 * These functions should only be used in Server Components or API routes.
 * They do NOT make client-side fetches.
 */

import { searchPhotos, curatedImageIds, imageQueries, type PexelsPhoto } from './pexels';

// Valid categories - strict allowlist
const VALID_CATEGORIES = ['hero', 'about', 'booking', 'meditation', 'nature', 'wellness', 'philosophy', 'journal', 'mbti'] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

/**
 * Fetch a specific photo by ID from Pexels
 * Used by server components to pre-load image data
 */
export async function fetchImageById(photoId: number): Promise<PexelsPhoto | null> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
  
  if (!PEXELS_API_KEY) {
    console.error('[Pexels] API key not configured');
    return null;
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
      headers: { Authorization: PEXELS_API_KEY },
      next: { revalidate: 86400 * 7 }, // Cache for 7 days
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

/**
 * Fetch a photo by category and optional index
 * First tries curated IDs, then falls back to search
 */
export async function fetchImageByCategory(
  category: string, 
  index: number = 0
): Promise<PexelsPhoto | null> {
  // Validate category
  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    console.warn(`[Pexels] Invalid category: ${category}, defaulting to hero`);
    category = 'hero';
  }

  const validCategory = category as ValidCategory;
  
  // Try curated images first for consistent results
  const curatedIds = curatedImageIds[validCategory];
  if (curatedIds && curatedIds[index]) {
    const photo = await fetchImageById(curatedIds[index]);
    if (photo) return photo;
  }
  
  // Fallback to search
  const queries = imageQueries[validCategory] || imageQueries.hero;
  const query = queries[index % queries.length];
  
  if (!query) {
    console.error('[Pexels] No queries available for category:', validCategory);
    return null;
  }

  try {
    const result = await searchPhotos(query, { perPage: 1, page: 1 });
    return result?.photos[0] ?? null;
  } catch (error) {
    console.error('[Pexels] Search error:', error);
    return null;
  }
}

/**
 * Fetch multiple images for a category
 * Useful for galleries or multiple images on a page
 */
export async function fetchImagesByCategory(
  category: string,
  count: number = 3
): Promise<PexelsPhoto[]> {
  // Validate category
  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    console.warn(`[Pexels] Invalid category: ${category}, defaulting to hero`);
    category = 'hero';
  }

  const validCategory = category as ValidCategory;
  
  // Get queries for the category
  const queries = imageQueries[validCategory] || imageQueries.hero;
  
  // Fetch images in parallel
  const imagePromises = queries.slice(0, Math.min(count, queries.length)).map(async (query) => {
    const result = await searchPhotos(query, { perPage: 1 });
    return result?.photos[0] || null;
  });

  const images = await Promise.all(imagePromises);
  return images.filter((img): img is PexelsPhoto => img !== null);
}

// Re-export types for convenience
export type { PexelsPhoto } from './pexels';
