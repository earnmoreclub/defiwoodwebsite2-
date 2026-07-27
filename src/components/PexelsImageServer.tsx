import { fetchImageByCategory, fetchImageById } from '@/lib/pexels-server';
import PexelsImage from './PexelsImage';
import type { PexelsPhoto } from '@/lib/pexels';

export type { PexelsImageProps, RoundedClass, ImageQuality } from './PexelsImage';

interface PexelsImageServerProps {
  /** Image category for fetching curated images */
  category?: string;
  /** Pre-loaded photo data (from server) */
  photo?: PexelsPhoto;
  /** Container width in pixels */
  width: number;
  /** Container height in pixels */
  height: number;
  /** Additional CSS classes */
  className?: string;
  /** Prioritize loading (above fold) */
  priority?: boolean;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Border radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  /** Index into curated images array */
  index?: number;
  /** Show photographer credit overlay */
  showCredit?: boolean;
  /** Image quality variant */
  quality?: 'tiny' | 'small' | 'medium' | 'large' | 'large2x';
  /** Blur placeholder color (avg_color from API) */
  placeholderColor?: string;
}

interface PexelsImageServerWithIdProps extends Omit<PexelsImageServerProps, 'category'> {
  /** Specific photo ID to fetch */
  photoId: number;
}

interface PexelsImageServerWithCategoryProps extends PexelsImageServerProps {
  category: string;
  photoId?: never;
}

// Type guard to check if props has category
function hasCategory(props: PexelsImageServerProps): props is PexelsImageServerWithCategoryProps {
  return !!(props as PexelsImageServerWithCategoryProps).category;
}

/**
 * Server component wrapper for PexelsImage
 * 
 * Fetches image data on the server to eliminate client-side API calls,
 * reduce layout shifts, and improve SEO.
 * 
 * @example
 * // With category (fetches from Pexels API on server)
 * <PexelsImageServer category="hero" width={1200} height={600} priority />
 * 
 * @example
 * // With specific photo ID (fetches single photo on server)
 * <PexelsImageServer photoId={156120} width={800} height={600} />
 */
export default async function PexelsImageServer(props: PexelsImageServerWithCategoryProps | PexelsImageServerWithIdProps) {
  // Extract photoId if present
  const photoId = (props as PexelsImageServerWithIdProps).photoId;
  
  let photo: PexelsPhoto | undefined;
  let error: string | null = null;

  try {
    if (photoId) {
      // Fetch specific photo by ID
      const result = await fetchImageById(photoId);
      photo = result ?? undefined;
      if (!photo) error = `Photo ${photoId} not found`;
    } else if (hasCategory(props)) {
      // Fetch by category with index
      const result = await fetchImageByCategory(props.category, props.index ?? 0);
      photo = result ?? undefined;
      if (!photo) error = `No photo found for category: ${props.category}`;
    }
  } catch (err) {
    console.error('[PexelsImageServer] Fetch error:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch image';
  }

  // If we have a photo, render client component with pre-loaded data
  if (photo) {
    return (
      <PexelsImage
        {...props}
        photo={photo}
        // Disable client-side fetching since we have the data
        category={undefined}
      />
    );
  }

  // Fallback: render client component without data (will show skeleton/error)
  console.warn(`[PexelsImageServer] ${error || 'No image data available'}`);
  
  return (
    <PexelsImage
      {...props}
      photo={undefined}
      category={hasCategory(props) ? props.category : undefined}
    />
  );
}
