import { NextRequest, NextResponse } from 'next/server';
import { getCachedImage, aiImagePrompts, generateImage } from '@/lib/leonardo';
import { getCachedMiniMaxImage, minimaxImagePrompts, generateMiniMaxImage } from '@/lib/minimax';
import { generatePuterImage, generateCategoryImage, puterImagePrompts } from '@/lib/puter-client';
import { getCachedAIGatewayImage, aiGatewayImagePrompts, generateAIGatewayImage } from '@/lib/ai-gateway';

const validCategories = Object.keys(aiImagePrompts) as Array<keyof typeof aiImagePrompts>;
type ImageProvider = 'leonardo' | 'minimax' | 'puter' | 'ai-gateway';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') as keyof typeof aiImagePrompts | null;
  const customPrompt = searchParams.get('prompt');
  const provider = (searchParams.get('provider') as ImageProvider) || 'leonardo';

  if (!category && !customPrompt) {
    return NextResponse.json(
      { error: 'Category or prompt required' },
      { status: 400 }
    );
  }

  if (category && !validCategories.includes(category)) {
    return NextResponse.json(
      { error: `Invalid category. Valid: ${validCategories.join(', ')}` },
      { status: 400 }
    );
  }

  if (provider !== 'leonardo' && provider !== 'minimax' && provider !== 'puter' && provider !== 'ai-gateway') {
    return NextResponse.json(
      { error: 'Invalid provider. Valid: leonardo, minimax, puter, ai-gateway' },
      { status: 400 }
    );
  }

  // Puter.js runs client-side (browser-based, free tier with Puter account)
  if (provider === 'puter') {
    return NextResponse.json(
      {
        useClientSide: true,
        provider: 'puter',
        category,
        prompt: customPrompt,
        message: 'Puter.js is browser-side. Use generatePuterImage() in the client.',
      },
      { status: 200 }
    );
  }

  try {
    let imageUrl = '';
    let imageWidth = 1024;
    let imageHeight = 1024;
    let imageId = '';
    let imageProvider = provider;

    if (customPrompt) {
      if (provider === 'minimax') {
        const minimax = await generateMiniMaxImage(customPrompt);
        if (minimax) {
          imageUrl = minimax.url;
          imageWidth = minimax.width;
          imageHeight = minimax.height;
          imageId = minimax.id;
        }
      } else if (provider === 'ai-gateway') {
        const aig = await generateAIGatewayImage(customPrompt);
        if (aig) {
          imageUrl = aig.url;
          imageWidth = aig.width;
          imageHeight = aig.height;
          imageId = aig.id;
        }
      } else {
        const leonardo = await generateImage(customPrompt);
        if (leonardo) {
          imageUrl = leonardo.generated_images?.[0]?.url || leonardo.url;
          imageWidth = leonardo.width || 1024;
          imageHeight = leonardo.height || 1024;
          imageId = leonardo.id;
        }
      }
    } else if (category) {
      if (provider === 'minimax') {
        const minimax = await getCachedMiniMaxImage(category);
        if (minimax) {
          imageUrl = minimax.url;
          imageWidth = minimax.width;
          imageHeight = minimax.height;
          imageId = minimax.id;
        }
      } else if (provider === 'ai-gateway') {
        const aig = await getCachedAIGatewayImage(category);
        if (aig) {
          imageUrl = aig.url;
          imageWidth = aig.width;
          imageHeight = aig.height;
          imageId = aig.id;
        }
      } else {
        const leonardo = await getCachedImage(category);
        if (leonardo) {
          imageUrl = leonardo.generated_images?.[0]?.url || leonardo.url;
          imageWidth = leonardo.width || 1024;
          imageHeight = leonardo.height || 1024;
          imageId = leonardo.id;
        }
      }
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: imageId,
      url: imageUrl,
      width: imageWidth,
      height: imageHeight,
      category: category || 'custom',
      provider,
    });
  } catch (error) {
    console.error('[AI Images] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
