const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_BASE_URL = 'https://api.stability.ai';

export interface StabilityImage {
  id: string;
  url: string;
  width: number;
  height: number;
  finishReason: string;
  seed?: number;
}

export interface StabilityResponse {
  artifacts: Array<{
    base64?: string;
    finishReason: string;
    seed: number;
  }>;
}

// Pre-defined prompts for different sections (Stability-optimized)
export const stabilityImagePrompts = {
  hero: 'Serene mindfulness meditation scene, soft natural lighting, peaceful forest clearing, ethereal glow, photorealistic, cinematic, 8k, high detail',
  about: 'Introspective self-discovery moment, warm golden hour light, person in contemplation, soft focus background, cinematic photography, professional',
  booking: 'Calm professional therapy environment, warm ambient lighting, peaceful consultation space, natural elements, professional photography, clean',
  meditation: 'Zen meditation practice, lotus position, morning mist, bamboo forest, serene atmosphere, award-winning photography, peaceful',
  nature: 'Majestic forest landscape, golden hour light rays through trees, misty mountains in background, pristine wilderness, 8k, national geographic',
  wellness: 'Holistic wellness practice, person breathing mindfully, natural stone garden, soft bokeh, health and balance, editorial style photography',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism, minimalist composition, thoughtful symbolism, fine art photography, contemplative',
  journal: 'Contemplative writing moment, journal on wooden desk, morning coffee, window light, cozy atmosphere, lifestyle photography, warm tones',
} as const;

export async function generateStabilityImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    negativePrompt?: string;
    cfgScale?: number;
    steps?: number;
    samples?: number;
  } = {}
): Promise<StabilityImage | null> {
  if (!STABILITY_API_KEY) {
    console.error('[Stability] API key not configured');
    return null;
  }

  const {
    width = 1024,
    height = 1024,
    negativePrompt = 'blurry, low quality, distorted, disfigured, poor lighting, oversaturated',
    cfgScale = 7,
    steps = 40,
    samples = 1,
  } = options;

  try {
    const response = await fetch(
      `${STABILITY_BASE_URL}/v2beta/stable-image/generate/sd3`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          aspect_ratio: getAspectRatio(width, height),
          cfg_scale: cfgScale,
          steps,
          samples,
          model: 'sd3.5-large',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[Stability] API error:', error);
      return null;
    }

    const data: StabilityResponse = await response.json();

    if (!data.artifacts || data.artifacts.length === 0) {
      console.error('[Stability] No artifacts returned');
      return null;
    }

    // For SD3, the response includes base64 or url depending on output_format
    const artifact = data.artifacts[0];

    // If we got a URL, use it; if base64, we'd need to convert
    return {
      id: `stability-${Date.now()}`,
      url: artifact.base64
        ? `data:image/png;base64,${artifact.base64}`
        : '',
      width,
      height,
      finishReason: artifact.finishReason,
      seed: artifact.seed,
    };
  } catch (error) {
    console.error('[Stability] Generation error:', error);
    return null;
  }
}

function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  if (Math.abs(ratio - 16 / 9) < 0.1) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.1) return '9:16';
  if (Math.abs(ratio - 21 / 9) < 0.1) return '21:9';
  if (Math.abs(ratio - 9 / 21) < 0.1) return '9:21';
  if (Math.abs(ratio - 3 / 2) < 0.1) return '3:2';
  if (Math.abs(ratio - 2 / 3) < 0.1) return '2:3';
  if (Math.abs(ratio - 5 / 4) < 0.1) return '5:4';
  if (Math.abs(ratio - 4 / 5) < 0.1) return '4:5';
  
  return '1:1';
}

// Cached version for stable UI
const stabilityCache = new Map<string, { image: StabilityImage; timestamp: number }>();
const STABILITY_CACHE_TTL = 3600000; // 1 hour

export async function getCachedStabilityImage(
  category: keyof typeof stabilityImagePrompts
): Promise<StabilityImage | null> {
  const cached = stabilityCache.get(category);
  
  if (cached && Date.now() - cached.timestamp < STABILITY_CACHE_TTL) {
    return cached.image;
  }

  const prompt = stabilityImagePrompts[category];
  const image = await generateStabilityImage(prompt);

  if (image && image.url) {
    stabilityCache.set(category, { image, timestamp: Date.now() });
  }

  return image;
}