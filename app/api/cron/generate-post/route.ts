// DeepSeek + Strapi 5 Auto-Blog Pipeline
// Triggered by Vercel Cron or external cron service

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateBlogPost, validatePostResponse } from '@/lib/deepseek';
import { createArticle } from '@/lib/strapi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}

async function handleCron(request: NextRequest) {
  try {
    // 1. Authenticate cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    const providedSecret = 
      authHeader?.replace('Bearer ', '') || 
      request.nextUrl.searchParams.get('secret');

    if (providedSecret !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Verify required env vars
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
      return NextResponse.json(
        { error: 'Strapi credentials not configured' },
        { status: 500 }
      );
    }

    // 3. Generate blog post via DeepSeek
    console.log('[Cron] Generating blog post via DeepSeek...');
    const generated = await generateBlogPost();

    if (!generated) {
      return NextResponse.json(
        { error: 'Failed to generate blog post' },
        { status: 500 }
      );
    }

    // 4. Validate generated content
    if (!validatePostResponse(generated)) {
      return NextResponse.json(
        { error: 'Invalid post response from DeepSeek', data: generated },
        { status: 500 }
      );
    }

    // 5. Push to Strapi
    console.log('[Cron] Pushing article to Strapi...');
    const article = await createArticle({
      title: generated.title,
      slug: generated.slug,
      excerpt: generated.excerpt,
      content: generated.contentMarkdown,
      tags: generated.tags,
      seoTitle: generated.seoTitle,
      metaDescription: generated.metaDescription,
    });

    // 6. Trigger Next.js revalidation
    try {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${article.slug}`);
    } catch (revalidateError) {
      console.warn('[Cron] Revalidation warning:', revalidateError);
    }

    console.log(`[Cron] Successfully created article: ${article.title}`);

    return NextResponse.json({
      success: true,
      message: 'Blog post generated and published successfully',
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category.name,
      },
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}