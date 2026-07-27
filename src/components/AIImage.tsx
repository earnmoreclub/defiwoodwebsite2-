'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { generatePuterImage, generateCategoryImage, puterImagePrompts } from '@/lib/puter-client';

interface AIImageProps {
  category?: 'hero' | 'about' | 'booking' | 'meditation' | 'nature' | 'wellness' | 'philosophy' | 'journal' | 'mbti';
  prompt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  provider?: 'leonardo' | 'minimax' | 'puter' | 'ai-gateway';
}

interface AIGeneratedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  provider?: string;
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

export default function AIImage({
  category,
  prompt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  rounded = 'xl',
  provider = 'leonardo',
}: AIImageProps) {
  const [imageData, setImageData] = useState<AIGeneratedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category && !prompt) {
      setError('No category or prompt provided');
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        // Puter.js runs in the browser - call it directly (no API key needed for free tier)
        if (provider === 'puter') {
          const result = prompt
            ? await generatePuterImage(prompt, { width, height })
            : category
            ? await generateCategoryImage(category, { width, height })
            : null;

          if (result) {
            setImageData({
              id: result.id,
              url: result.url,
              width: result.width,
              height: result.height,
              provider: 'puter',
            });
          } else {
            throw new Error('Puter generation returned no image');
          }
          return;
        }

        // Server-side providers (leonardo, minimax) go through the API
        const params = new URLSearchParams();
        if (prompt) {
          params.set('prompt', prompt);
        } else if (category) {
          params.set('category', category);
        }
        params.set('provider', provider);

        const res = await fetch(`/api/ai-images?${params}`);
        
        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const data = await res.json();
        setImageData(data);
      } catch (err) {
        console.error('[AIImage] Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [category, prompt, provider, width, height]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-dark-800 animate-pulse ${roundedClasses[rounded]} ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (error || !imageData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-dark-800 flex items-center justify-center ${roundedClasses[rounded]} ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs text-white/40">AI image unavailable</span>
      </motion.div>
    );
  }

  const providerLabel = provider === 'ai-gateway' ? 'AI Gateway' : provider === 'puter' ? 'Puter AI' : provider === 'minimax' ? 'MiniMax M3' : 'Leonardo AI';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden ${roundedClasses[rounded]} ${className}`}
    >
      <Image
        src={imageData.url}
        alt={`AI-generated image${category ? ` for ${category}` : ''}`}
        width={imageData.width}
        height={imageData.height}
        priority={priority}
        sizes={sizes}
        className="object-cover"
        style={{ width: '100%', height: '100%' }}
      />
      {/* AI generation badge */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
        <span className="text-[10px] text-white/80 font-medium">✨ {providerLabel}</span>
      </div>
    </motion.div>
  );
}