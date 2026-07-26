import { NextRequest, NextResponse } from 'next/server';
import { getCachedImage, aiImagePrompts, generateImage } from '@/lib/leonardo';
import { getCachedStabilityImage, stabilityImagePrompts, generateStabilityImage } from '@/lib/stability';
import { getCachedDalleImage, dalleImagePrompts, generateDalleImage } from '@/lib/dalle';

const validCategories = Object.keys(aiImagePrompts) as Array<keyof typeof aiImagePrompts>;
type ImageProvider = 'leonardo' | 'stability' | 'dalle';

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

  if (provider !== 'leonardo' && provider !== 'stability' && provider !== 'dalle') {
    return NextResponse.json(
      { error: 'Invalid provider. Valid: leonardo, stability, dalle' },
      { status: 400 }
    );
  }

  try {
    let imageUrl = '';
    let imageWidth = 1024;
    let imageHeight = 1024;
    let imageId = '';

    if (customPrompt) {
      if (provider === 'dalle') {
        const dalle = await generateDalleImage(customPrompt);
        if (dalle) {
          imageUrl = dalle.url;
          imageWidth = dalle.width;
          imageHeight = dalle.height;
          imageId = dalle.id;
        }
      } else if (provider === 'stability') {
        const stability = await generateStabilityImage(customPrompt);
        if (stability) {
          imageUrl = stability.url;
          imageWidth = stability.width;
          imageHeight = stability.height;
          imageId = stability.id;
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
      if (provider === 'dalle') {
        const dalle = await getCachedDalleImage(category);
        if (dalle) {
          imageUrl = dalle.url;
          imageWidth = dalle.width;
          imageHeight = dalle.height;
          imageId = dalle.id;
        }
      } else if (provider === 'stability') {
        const stability = await getCachedStabilityImage(category);
        if (stability) {
          imageUrl = stability.url;
          imageWidth = stability.width;
          imageHeight = stability.height;
          imageId = stability.id;
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
