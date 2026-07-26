import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pre-defined prompts for DALL-E 3
export const dalleImagePrompts = {
  hero: 'A serene mindfulness meditation scene in a peaceful forest clearing, soft natural lighting filtering through leaves, ethereal glow effect, photorealistic style, cinematic composition, 4K ultra quality, warm earth tones',
  about: 'An introspective self-discovery moment, person in deep contemplation, warm golden hour lighting, soft focus background with natural elements, professional portrait photography, emotional depth, editorial quality',
  booking: 'A calm professional therapy environment, warm ambient lighting, peaceful consultation space with natural elements like plants and soft textures, inviting and welcoming atmosphere, professional photography, cozy interior design',
  meditation: 'Zen meditation practice, person in lotus position on a stone platform, morning mist in a bamboo forest, serene and peaceful atmosphere, award-winning photography style, spiritual tranquility, soft natural lighting',
  nature: 'Majestic ancient forest landscape, golden hour light rays streaming through tall trees, misty mountains in the background, pristine wilderness, National Geographic quality photography, dramatic sky, vibrant colors',
  wellness: 'Holistic wellness practice, person breathing mindfully in a peaceful setting, natural stone garden background, soft bokeh effect, health and balance symbolism, editorial wellness magazine style, warm and nurturing atmosphere',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism subtly integrated, minimalist composition with meaningful objects, fine art photography style, zen aesthetic, contemplative mood, elegant simplicity',
  journal: 'Contemplative writing moment, leather journal on a rustic wooden desk, morning coffee steam rising, warm window light streaming in, cozy atmosphere, lifestyle photography, nostalgic warm tones, creative inspiration',
} as const;

export interface DalleImageResult {
  id: string;
  url: string;
  revised_prompt?: string;
  width: number;
  height: number;
}

// Cache for generated images (in production, use Redis or similar)
const imageCache = new Map<string, DalleImageResult>();

export async function generateDalleImage(
  prompt: string,
  options: {
    model?: 'dall-e-3' | 'dall-e-2';
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}
): Promise<DalleImageResult | null> {
  const {
    model = 'dall-e-3',
    size = '1024x1024',
    quality = 'hd',
    style = 'vivid',
  } = options;

  if (!process.env.OPENAI_API_KEY) {
    console.error('[DALL-E] Missing OPENAI_API_KEY');
    return null;
  }

  try {
    const response = await openai.images.generate({
      model,
      prompt,
      n: 1,
      size,
      quality,
      style,
      response_format: 'url',
    });

    const imageData = response.data?.[0];

    if (imageData?.url) {
      return {
        id: `dalle-${Date.now()}`,
        url: imageData.url,
        revised_prompt: imageData.revised_prompt,
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1]),
      };
    }

    return null;
  } catch (error) {
    console.error('[DALL-E] Generation error:', error);
    return null;
  }
}

export async function getCachedDalleImage(
  category: keyof typeof dalleImagePrompts,
  options: {
    model?: 'dall-e-3' | 'dall-e-2';
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}
): Promise<DalleImageResult | null> {
  const cacheKey = `${category}-${options.model || 'dall-e-3'}-${options.size || '1024x1024'}-${options.quality || 'hd'}-${options.style || 'vivid'}`;

  // Return cached result if available and less than 1 hour old
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = dalleImagePrompts[category];
  const result = await generateDalleImage(prompt, options);

  if (result) {
    imageCache.set(cacheKey, result);

    // Clear cache after 1 hour
    setTimeout(() => {
      imageCache.delete(cacheKey);
    }, 60 * 60 * 1000);
  }

  return result;
}
