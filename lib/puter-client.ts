'use client';

import { puter } from '@heyputer/puter.js';

export interface PuterImageResult {
  id: string;
  url: string;
  width: number;
  height: number;
}

// Pre-defined prompts for different sections
export const puterImagePrompts = {
  hero: 'Serene mindfulness meditation scene, soft natural lighting, peaceful forest clearing, ethereal glow, photorealistic style, 4K quality',
  about: 'Introspective self-discovery moment, warm golden light, person in contemplation, soft focus background, cinematic photography, professional portrait',
  booking: 'Calm professional therapy environment, warm lighting, peaceful consultation space, natural elements, professional photography, inviting atmosphere',
  meditation: 'Zen meditation practice, lotus position, morning mist, bamboo forest, serene atmosphere, award-winning photography, peaceful zen garden',
  nature: 'Majestic forest landscape, golden hour light rays through trees, misty mountains in background, pristine wilderness, national geographic quality',
  wellness: 'Holistic wellness practice, person breathing mindfully, natural stone garden, soft bokeh, health and balance, editorial wellness magazine style',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism, minimalist composition, thoughtful symbolism, fine art photography, zen aesthetic',
  journal: 'Contemplative writing moment, journal on wooden desk, morning coffee, window light, cozy atmosphere, lifestyle photography, warm tones',
  mbti: 'Person discovering inner self, mirror reflection, psychological insight, warm lighting, mind map visualization, modern psychology concept, soft gradient background',
} as const;

export async function generatePuterImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'low' | 'medium' | 'high';
  } = {}
): Promise<PuterImageResult | null> {
  const { width = 1024, height = 1024, quality = 'high' } = options;

  try {
    const imgElement = await puter.ai.txt2img(prompt, {
      width,
      height,
      quality,
    });

    const imageUrl = imgElement.src;

    if (imageUrl) {
      return {
        id: `puter-${Date.now()}`,
        url: imageUrl,
        width,
        height,
      };
    }

    console.error('[Puter] No image URL found in result');
    return null;
  } catch (error) {
    console.error('[Puter] Generation error:', error);
    return null;
  }
}

export async function generateCategoryImage(
  category: keyof typeof puterImagePrompts,
  options: {
    width?: number;
    height?: number;
    quality?: 'low' | 'medium' | 'high';
  } = {}
): Promise<PuterImageResult | null> {
  const prompt = puterImagePrompts[category];
  return generatePuterImage(prompt, options);
}
