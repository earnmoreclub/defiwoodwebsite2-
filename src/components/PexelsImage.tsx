'use client';

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import Image from 'next/image';
import type { PexelsPhoto } from '@/lib/pexels';
import { curatedImageIds } from '@/lib/pexels';

// Type definitions
type RoundedClass = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
type ImageQuality = 'tiny' | 'small' | 'medium' | 'large' | 'large2x';

interface PexelsImageProps {
  /** Image category for fetching curated images */
  category?: string;
  /** Pre-loaded photo data */
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
  rounded?: RoundedClass;
  /** Index into curated images array */
  index?: number;
  /** Show photographer credit overlay */
  showCredit?: boolean;
  /** Image quality variant */
  quality?: ImageQuality;
  /** Blur placeholder color (avg_color from API) */
  placeholderColor?: string;
}

// Rounded corner CSS mappings
const ROUNDED_CLASSES: Record<RoundedClass, string> = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
} as const;

// Fallback gradient backgrounds for error states
const FALLBACK_GRADIENTS = [
  'from-purple-900/50 to-dark-900',
  'from-cyan-900/50 to-dark-900',
  'from-emerald-900/50 to-dark-900',
  'from-purple-800/40 to-cyan-800/40',
] as const;

// Memoized rounded class computation
const getRoundedClass = (rounded: RoundedClass, baseClass: string): string => {
  const roundedClass = ROUNDED_CLASSES[rounded];
  return roundedClass ? `${roundedClass} ${baseClass}` : baseClass;
};

// Fetch image data from API
const fetchImageData = async (
  category: string,
  index: number
): Promise<PexelsPhoto | null> => {
  // Try curated images first for consistent results
  const curatedIds = curatedImageIds[category as keyof typeof curatedImageIds];
  if (curatedIds && curatedIds[index]) {
    try {
      const res = await fetch(`/api/images?photoId=${curatedIds[index]}`, {
        cache: 'force-cache',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.photo) return data.photo;
      }
    } catch {
      // Fall through to search
    }
  }
  
  // Fallback to category search
  try {
    const res = await fetch(`/api/images?category=${category}&count=1`, {
      cache: 'force-cache',
    });
    const data = await res.json();
    return data.images?.[0] ?? null;
  } catch {
    return null;
  }
};

// Skeleton loading placeholder
const ImageSkeleton = memo(function ImageSkeleton({
  width,
  height,
  rounded,
  className,
}: {
  width: number;
  height: number;
  rounded: RoundedClass;
  className: string;
}) {
  return (
    <div
      className={`bg-dark-800 animate-pulse ${getRoundedClass(rounded, '')} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
});

// Error/fallback placeholder
const ImageFallback = memo(function ImageFallback({
  width,
  height,
  rounded,
  className,
  gradient,
}: {
  width: number;
  height: number;
  rounded: RoundedClass;
  className: string;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${getRoundedClass(rounded, '')} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      <div className="text-white/20 text-xs">No image</div>
    </div>
  );
});

// Photographer credit overlay
const CreditOverlay = memo(function CreditOverlay({
  photographer,
  photographerUrl,
}: {
  photographer: string;
  photographerUrl: string;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
      <a
        href={photographerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-white/70 hover:text-white transition-colors"
        aria-label={`Photo by ${photographer}`}
      >
        Photo by {photographer}
      </a>
    </div>
  );
});

// Main optimized PexelsImage component
const PexelsImage = memo(function PexelsImage({
  category,
  photo,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  rounded = 'xl',
  index = 0,
  showCredit = true,
  quality = 'large',
  placeholderColor,
}: PexelsImageProps) {
  const [imageData, setImageData] = useState<PexelsPhoto | null>(photo ?? null);
  const [isLoading, setIsLoading] = useState(!photo);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const fetchRef = useRef(false);
  const gradientIndex = index % FALLBACK_GRADIENTS.length;

  // Fetch image when category changes
  useEffect(() => {
    // Skip if we already have photo or no category
    if (photo || !category) return;
    
    // Prevent duplicate fetches
    if (fetchRef.current) return;
    fetchRef.current = true;
    
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const data = await fetchImageData(category, index);
        if (data) {
          setImageData(data);
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error('[PexelsImage] Failed to fetch image:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      fetchRef.current = false;
    };
  }, [category, photo, index]);

  // Loading state
  if (isLoading) {
    return (
      <ImageSkeleton
        width={width}
        height={height}
        rounded={rounded}
        className={className}
      />
    );
  }

  // Error or no data state
  if (hasError || !imageData) {
    return (
      <ImageFallback
        width={width}
        height={height}
        rounded={rounded}
        className={className}
        gradient={FALLBACK_GRADIENTS[gradientIndex]}
      />
    );
  }

  // Determine best available image source
  const src = imageData.src[quality] || imageData.src.large || imageData.src.medium;
  
  // Use average color as blur placeholder if available
  const blurDataURL = placeholderColor || imageData.avg_color 
    ? `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect fill="${imageData.avg_color || '#1a1a2e'}" width="10" height="10"/></svg>`).toString('base64')}`
    : undefined;

  return (
    <div
      className={`relative overflow-hidden ${getRoundedClass(rounded, '')} ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder layer */}
      {!isLoaded && !priority && (
        <div
          className="absolute inset-0 bg-dark-800 animate-pulse"
          style={{ 
            backgroundColor: imageData.avg_color || '#1a1a2e',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}
      
      <Image
        src={src}
        alt={imageData.alt || 'Photo from Pexels'}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: '100%', height: '100%' }}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {showCredit && isLoaded && (
        <CreditOverlay
          photographer={imageData.photographer}
          photographerUrl={imageData.photographer_url}
        />
      )}
    </div>
  );
});

export default PexelsImage;

// Export types for external use
export type { PexelsImageProps, RoundedClass, ImageQuality };
