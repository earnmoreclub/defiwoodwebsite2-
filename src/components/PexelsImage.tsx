'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { PexelsPhoto } from '@/lib/pexels';

interface PexelsImageProps {
  category?: string;
  photo?: PexelsPhoto;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export default function PexelsImage({
  category,
  photo,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  rounded = 'xl',
}: PexelsImageProps) {
  const [imageData, setImageData] = useState<PexelsPhoto | null>(photo || null);
  const [loading, setLoading] = useState(!photo);

  useEffect(() => {
    if (photo || !category) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/images?category=${category}&count=1`);
        const data = await res.json();
        if (data.images?.[0]) {
          setImageData(data.images[0]);
        }
      } catch (error) {
        console.error('[PexelsImage] Failed to fetch image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [category, photo]);

  if (loading || !imageData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-dark-800 animate-pulse ${roundedClasses[rounded]} ${className}`}
        style={{ width, height }}
      />
    );
  }

  const src = imageData.src.large || imageData.src.medium;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden ${roundedClasses[rounded]} ${className}`}
    >
      <Image
        src={src}
        alt={imageData.alt || 'Photo from Pexels'}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Photographer credit overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <a
          href={imageData.photographer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/70 hover:text-white transition-colors"
        >
          Photo by {imageData.photographer}
        </a>
      </div>
    </motion.div>
  );
}
