/**
 * Vercel AI Gateway for Image Generation
 * 
 * Setup:
 * 1. Get your AI Gateway API key from https://ai.vercel.com
 * 2. Add VERCEL_AI_GATEWAY_API_KEY to your .env.local
 * 3. Deploy to Vercel for the gateway to work with model providers
 * 
 * Note: The Vercel AI Gateway is primarily designed for use from Vercel deployments
 * or via the AI SDK (npm i ai). The gateway URL will work from serverless functions
 * deployed on Vercel.
 */

export interface AIGatewayConfig {
  apiKey: string;
}

// Default configuration from environment
const DEFAULT_CONFIG: AIGatewayConfig = {
  apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY || '',
};

export interface AIGatewayImageResult {
  id: string;
  url: string;
  width: number;
  height: number;
  provider: string;
}

// Pre-defined prompts for different sections
export const aiGatewayImagePrompts = {
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

// Cache for generated images
const imageCache = new Map<string, AIGatewayImageResult>();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Generate image using Vercel AI Gateway
 * The gateway provides access to OpenAI DALL-E and other providers.
 * It works through the unified AI Gateway endpoint.
 */
export async function generateAIGatewayImage(
  prompt: string,
  options: {
    model?: string;
    width?: number;
    height?: number;
  } = {}
): Promise<AIGatewayImageResult | null> {
  const {
    model = 'openai/dall-e-3',
    width = 1024,
    height = 1024,
  } = options;

  if (!DEFAULT_CONFIG.apiKey) {
    console.error('[AI Gateway] API key not configured. Set VERCEL_AI_GATEWAY_API_KEY');
    return null;
  }

  try {
    // Vercel AI Gateway unified endpoint
    // Format: https://ai.vercel.com/v1/{provider}/{endpoint}
    // For images: https://ai.vercel.com/v1/images/generations
    const response = await fetch('https://ai.vercel.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEFAULT_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: width >= 1024 ? '1024x1024' : '512x512',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[AI Gateway] API error:', error);
      return null;
    }

    const data = await response.json();

    // Parse response - Vercel AI Gateway returns OpenAI-compatible format
    let imageUrl = '';
    let imageId = `aigateway-${Date.now()}`;

    if (data.data?.[0]?.url) {
      imageUrl = data.data[0].url;
      imageId = data.data[0].revised_prompt || imageId;
    } else if (data.data?.[0]?.b64_json) {
      console.error('[AI Gateway] Base64 response not supported - need URL response');
      return null;
    }

    if (!imageUrl) {
      console.error('[AI Gateway] No image URL in response:', data);
      return null;
    }

    return {
      id: imageId,
      url: imageUrl,
      width,
      height,
      provider: `ai-gateway-${model.split('/')[1] || 'image'}`,
    };
  } catch (error) {
    console.error('[AI Gateway] Generation error:', error);
    return null;
  }
}

/**
 * Get cached image for a category
 */
export async function getCachedAIGatewayImage(
  category: keyof typeof aiGatewayImagePrompts,
  options: {
    width?: number;
    height?: number;
  } = {}
): Promise<AIGatewayImageResult | null> {
  const cacheKey = `${category}-${options.width || 1024}-${options.height || 1024}`;

  const cached = imageCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = aiGatewayImagePrompts[category];
  const result = await generateAIGatewayImage(prompt, options);

  if (result) {
    imageCache.set(cacheKey, result);

    // Clear cache after TTL
    setTimeout(() => {
      imageCache.delete(cacheKey);
    }, CACHE_TTL);
  }

  return result;
}