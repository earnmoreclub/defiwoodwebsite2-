import crypto from 'crypto';

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/image_generation';

export interface MiniMaxImageResult {
  id: string;
  url: string;
  width: number;
  height: number;
}

export const minimaxImagePrompts = {
  hero: 'A serene mindfulness meditation scene in a peaceful forest clearing, soft natural lighting filtering through leaves, ethereal glow effect, photorealistic style, cinematic composition, 4K ultra quality, warm earth tones',
  about: 'An introspective self-discovery moment, person in deep contemplation, warm golden hour lighting, soft focus background with natural elements, professional portrait photography, emotional depth, editorial quality',
  booking: 'A calm professional therapy environment, warm ambient lighting, peaceful consultation space with natural elements like plants and soft textures, inviting and welcoming atmosphere, professional photography, cozy interior design',
  meditation: 'Zen meditation practice, person in lotus position on a stone platform, morning mist in a bamboo forest, serene and peaceful atmosphere, award-winning photography style, spiritual tranquility, soft natural lighting',
  nature: 'Majestic ancient forest landscape, golden hour light rays streaming through tall trees, misty mountains in the background, pristine wilderness, National Geographic quality photography, dramatic sky, vibrant colors',
  wellness: 'Holistic wellness practice, person breathing mindfully in a peaceful setting, natural stone garden background, soft bokeh effect, health and balance symbolism, editorial wellness magazine style, warm and nurturing atmosphere',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism subtly integrated, minimalist composition with meaningful objects, fine art photography style, zen aesthetic, contemplative mood, elegant simplicity',
  journal: 'Contemplative writing moment, leather journal on a rustic wooden desk, morning coffee steam rising, warm window light streaming in, cozy atmosphere, lifestyle photography, nostalgic warm tones, creative inspiration',
} as const;

// Cache for generated images
const imageCache = new Map<string, MiniMaxImageResult>();

async function getMiniMaxSignature(apiKey: string, apiSecret: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureStr = `${apiKey}${timestamp}`;
  const signature = crypto.createHmac('sha256', apiSecret).update(signatureStr).digest('hex');
  return `${signature}:${timestamp}`;
}

export async function generateMiniMaxImage(
  prompt: string,
  options: {
    model?: 'image-01' | 'image-01-hd' | 'minimax-image-01';
    width?: number;
    height?: number;
    number?: number;
  } = {}
): Promise<MiniMaxImageResult | null> {
  const {
    model = 'image-01',
    width = 1024,
    height = 1024,
    number = 1,
  } = options;

  const apiKey = process.env.MINIMAX_API_KEY;
  const apiSecret = process.env.MINIMAX_API_SECRET;

  if (!apiKey) {
    console.error('[MiniMax] Missing API credentials. Set MINIMAX_API_KEY');
    return null;
  }

  try {
    // MiniMax uses API key directly in Authorization header
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        number,
        width,
        height,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[MiniMax] API error:', error);
      return null;
    }

    const data = await response.json();

    if (data.data?.[0]?.url) {
      return {
        id: `minimax-${Date.now()}`,
        url: data.data[0].url,
        width,
        height,
      };
    }

    console.error('[MiniMax] No image URL in response:', data);
    return null;
  } catch (error) {
    console.error('[MiniMax] Generation error:', error);
    return null;
  }
}

export async function getCachedMiniMaxImage(
  category: keyof typeof minimaxImagePrompts,
  options: {
    model?: 'image-01' | 'image-01-hd' | 'minimax-image-01';
    width?: number;
    height?: number;
  } = {}
): Promise<MiniMaxImageResult | null> {
  const cacheKey = `${category}-${options.model || 'image-01'}-${options.width || 1024}-${options.height || 1024}`;

  const cached = imageCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = minimaxImagePrompts[category];
  const result = await generateMiniMaxImage(prompt, options);

  if (result) {
    imageCache.set(cacheKey, result);

    // Clear cache after 1 hour
    setTimeout(() => {
      imageCache.delete(cacheKey);
    }, 60 * 60 * 1000);
  }

  return result;
}
