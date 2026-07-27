const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

export interface LeonardoImage {
  id: string;
  url: string;
  nsfw: boolean;
  horror: boolean;
  width: number;
  height: number;
  generated_images?: Array<{
    id: string;
    url: string;
    width: number;
    height: number;
  }>;
}

export interface LeonardoGeneration {
  id: string;
  status: 'submitted' | 'in_progress' | 'complete' | 'failed';
  generated_images: LeonardoImage[];
}

export interface LeonardoCreateResponse {
  sd_raw_generation_request_id: string;
  generation_id?: string;
}

// Pre-defined prompts for different sections
export const aiImagePrompts = {
  hero: 'Serene mindfulness meditation scene, soft natural lighting, peaceful forest clearing, ethereal glow, photorealistic style',
  about: 'Introspective self-discovery moment, warm golden light, person in contemplation, soft focus background, cinematic photography',
  booking: 'Calm professional therapy environment, warm lighting, peaceful consultation space, natural elements, professional photography',
  meditation: 'Zen meditation practice, lotus position, morning mist, bamboo forest, serene atmosphere, award-winning photography',
  nature: 'Majestic forest landscape, golden hour light rays through trees, misty mountains in background, pristine wilderness, 8K quality',
  wellness: 'Holistic wellness practice, person breathing mindfully, natural stone garden, soft bokeh, health and balance, editorial style',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism, minimalist composition, thoughtful symbolism, fine art photography',
  journal: 'Contemplative writing moment, journal on wooden desk, morning coffee, window light, cozy atmosphere, lifestyle photography',
  mbti: 'Person discovering inner self, mirror reflection, psychological insight, warm lighting, mind map visualization, modern psychology concept',
} as const;

export async function generateImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    modelId?: string;
    numImages?: number;
  } = {}
): Promise<LeonardoImage | null> {
  if (!LEONARDO_API_KEY) {
    console.error('[Leonardo] API key not configured');
    return null;
  }

  const {
    width = 1024,
    height = 1024,
    modelId = 'ac616149-f9c4-4218-a4a7-3b0f5d2f91b5', // Default Leonardo model
    numImages = 1,
  } = options;

  try {
    // Create generation request
    const createResponse = await fetch(`${LEONARDO_BASE_URL}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        width,
        height,
        modelId,
        num_images: numImages,
        guidance_scale: 7,
        prompt_magic: true,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('[Leonardo] Create error:', error);
      return null;
    }

    const data: LeonardoCreateResponse = await createResponse.json();
    const generationId = data.sd_raw_generation_request_id || data.generation_id;
    
    if (!generationId) {
      console.error('[Leonardo] No generation ID returned');
      return null;
    }

    // Poll for completion
    const image = await pollForCompletion(generationId);
    return image;
  } catch (error) {
    console.error('[Leonardo] Generation error:', error);
    return null;
  }
}

async function pollForCompletion(
  generationId: string,
  maxAttempts: number = 30,
  interval: number = 5000
): Promise<LeonardoImage | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `${LEONARDO_BASE_URL}/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${LEONARDO_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error('[Leonardo] Poll error:', response.status);
        return null;
      }

      const data: LeonardoGeneration = await response.json();

      if (data.status === 'complete' && data.generated_images?.length > 0) {
        return data.generated_images[0];
      }

      if (data.status === 'failed') {
        console.error('[Leonardo] Generation failed');
        return null;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      console.error('[Leonardo] Poll error:', error);
      return null;
    }
  }

  console.error('[Leonardo] Generation timed out');
  return null;
}

// Quick generate with cached results (for consistent UI)
const generationCache = new Map<string, { image: LeonardoImage; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

export async function getCachedImage(
  category: keyof typeof aiImagePrompts
): Promise<LeonardoImage | null> {
  const cached = generationCache.get(category);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.image;
  }

  const prompt = aiImagePrompts[category];
  const image = await generateImage(prompt);

  if (image) {
    generationCache.set(category, { image, timestamp: Date.now() });
  }

  return image;
}
