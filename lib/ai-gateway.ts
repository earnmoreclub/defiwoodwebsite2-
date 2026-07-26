/**
 * Vercel AI Gateway for Image Generation
 * 
 * Setup:
 * 1. Get your AI Gateway API key from https://ai.vercel.com
 * 2. Add VERCEL_AI_GATEWAY_API_KEY to your .env.local
 * 3. Configure providers in AI Gateway dashboard (OpenAI, Stability AI, etc.)
 */

const AI_GATEWAY_URL = 'https://gateway.ai.cloudflare.com/v1/account';

interface AIGatewayConfig {
  accountId: string;
  gatewayId: string;
  apiKey: string;
}

// Default configuration - you can customize these
const DEFAULT_CONFIG: AIGatewayConfig = {
  accountId: process.env.AI_GATEWAY_ACCOUNT_ID || 'your-account-id',
  gatewayId: process.env.AI_GATEWAY_GATEWAY_ID || 'your-gateway-id',
  apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY || '',
};

export interface AIGatewayImageResult {
  id: string;
  url: string;
  width: number;
  height: number;
  provider: string;
}

// Pre-defined prompts for different sections (aligned with other providers)
export const aiGatewayImagePrompts = {
  hero: 'Serene mindfulness meditation scene, soft natural lighting, peaceful forest clearing, ethereal glow, photorealistic style, 4K quality',
  about: 'Introspective self-discovery moment, warm golden light, person in contemplation, soft focus background, cinematic photography, professional portrait',
  booking: 'Calm professional therapy environment, warm lighting, peaceful consultation space, natural elements, professional photography, inviting atmosphere',
  meditation: 'Zen meditation practice, lotus position, morning mist, bamboo forest, serene atmosphere, award-winning photography, peaceful zen garden',
  nature: 'Majestic forest landscape, golden hour light rays through trees, misty mountains in background, pristine wilderness, national geographic quality',
  wellness: 'Holistic wellness practice, person breathing mindfully, natural stone garden, soft bokeh, health and balance, editorial wellness magazine style',
  philosophy: 'Ancient wisdom meeting modern life, yin yang symbolism, minimalist composition, thoughtful symbolism, fine art photography, zen aesthetic',
  journal: 'Contemplative writing moment, journal on wooden desk, morning coffee, window light, cozy atmosphere, lifestyle photography, warm tones',
} as const;

// Cache for generated images
const imageCache = new Map<string, AIGatewayImageResult>();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Generate image using Vercel AI Gateway
 * Supports multiple providers configured in AI Gateway
 */
export async function generateAIGatewayImage(
  prompt: string,
  options: {
    provider?: 'openai' | 'stability-ai' | 'replicate';
    model?: string;
    width?: number;
    height?: number;
  } = {}
): Promise<AIGatewayImageResult | null> {
  const {
    provider = 'openai',
    model,
    width = 1024,
    height = 1024,
  } = options;

  if (!DEFAULT_CONFIG.apiKey) {
    console.error('[AI Gateway] API key not configured. Set VERCEL_AI_GATEWAY_API_KEY');
    return null;
  }

  try {
    // Build the AI Gateway URL
    const baseUrl = `https://gateway.ai.cloudflare.com/v1/${DEFAULT_CONFIG.accountId}/${DEFAULT_CONFIG.gatewayId}`;
    
    let endpoint = '';
    let requestBody: Record<string, unknown> = {};
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${DEFAULT_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    };

    switch (provider) {
      case 'openai':
        // Using DALL-E through AI Gateway
        endpoint = `${baseUrl}/openai/chat/completions`;
        requestBody = {
          model: model || 'dall-e-3',
          messages: [
            {
              role: 'user',
              content: `Generate an image: ${prompt}`
            }
          ],
          max_tokens: 1000,
        };
        // For DALL-E, we need to use the images endpoint
        endpoint = `${baseUrl}/openai/images/generations`;
        requestBody = {
          model: model || 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: `${width}x${height}`,
        };
        break;

      case 'stability-ai':
        endpoint = `${baseUrl}/stability-ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`;
        requestBody = {
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: height,
          width: width,
          steps: 30,
        };
        break;

      case 'replicate':
        endpoint = `${baseUrl}/replicate/predictions`;
        requestBody = {
          version: model || 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1f35c6e1c05c29',
          input: {
            prompt: prompt,
            width: width,
            height: height,
          },
        };
        break;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[AI Gateway] API error:', error);
      return null;
    }

    const data = await response.json();

    // Parse response based on provider
    let imageUrl = '';
    let imageId = `aigateway-${Date.now()}`;

    switch (provider) {
      case 'openai':
        if (data.data?.[0]?.url) {
          imageUrl = data.data[0].url;
          imageId = data.data[0].revised_prompt || imageId;
        } else if (data.data?.[0]?.b64_json) {
          // Base64 response - would need to handle differently
          console.error('[AI Gateway] Base64 response not supported');
          return null;
        }
        break;

      case 'stability-ai':
        if (data.artifacts?.[0]?.base64) {
          imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
          imageId = data.id || imageId;
        }
        break;

      case 'replicate':
        if (data.output?.[0]) {
          imageUrl = data.output[0];
          imageId = data.id || imageId;
        } else if (data.urls?.get) {
          // Poll for result
          const resultResponse = await fetch(data.urls.get, { headers });
          const resultData = await resultResponse.json();
          if (resultData.output?.[0]) {
            imageUrl = resultData.output[0];
          }
        }
        break;
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
      provider: `ai-gateway-${provider}`,
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
    provider?: 'openai' | 'stability-ai' | 'replicate';
    width?: number;
    height?: number;
  } = {}
): Promise<AIGatewayImageResult | null> {
  const cacheKey = `${category}-${options.provider || 'openai'}-${options.width || 1024}-${options.height || 1024}`;

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

/**
 * List available models from AI Gateway
 */
export async function listAIGatewayModels(): Promise<string[]> {
  if (!DEFAULT_CONFIG.apiKey) {
    return [];
  }

  try {
    const baseUrl = `https://gateway.ai.cloudflare.com/v1/${DEFAULT_CONFIG.accountId}/${DEFAULT_CONFIG.gatewayId}`;
    
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${DEFAULT_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.models?.map((m: { id: string }) => m.id) || [];
  } catch (error) {
    console.error('[AI Gateway] List models error:', error);
    return [];
  }
}
