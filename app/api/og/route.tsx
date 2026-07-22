import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://awarenessbe.com';
const BRAND_NAME = 'Awareness Be';
const LOGO_TEXT = 'AB';

const GOLD = '#E8C27A';
const EMERALD = '#34D399';
const BG = '#0A0A0A';

type OGType = 'mbti-result' | 'blog-article' | 'diagnostic' | 'home';

interface OGParams {
  title?: string;
  description?: string;
  type?: OGType;
  lang?: string;
}

const TYPE_LABELS: Record<OGType, { en: string; zh: string }> = {
  'mbti-result': { en: 'MBTI Brain Type', zh: 'MBTI 腦型測驗' },
  'blog-article': { en: 'Journal', zh: '科學日誌' },
  'diagnostic': { en: 'Self-Assessment', zh: '自我測驗' },
  home: { en: 'Self-Awareness Platform', zh: '覺察力平台' },
};

function wrapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];
  for (const word of words) {
    if ((line + word).length > maxChars) {
      if (line) lines.push(line.trim());
      line = word + ' ';
    } else {
      line += word + ' ';
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.join('\n');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? BRAND_NAME;
  const description = searchParams.get('description') ?? '';
  const type = (searchParams.get('type') ?? 'home') as OGType;
  const lang = searchParams.get('lang') ?? 'en';

  const label = TYPE_LABELS[type] ?? TYPE_LABELS.home;
  const badge = lang === 'zh' ? label.zh : label.en;
  const displayTitle = lang === 'zh' && type === 'mbti-result'
    ? '你的 MBTI 腦型'
    : title;
  const wrappedTitle = wrapText(displayTitle, 22);
  const wrappedDesc = wrapText(description, 38);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: BG,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing gradient border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 0,
            padding: '3px',
            background:
              'linear-gradient(135deg, #7C3AED 0%, #34D399 50%, #E8C27A 100%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Inner dark background */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            right: 3,
            bottom: 3,
            backgroundColor: BG,
            borderRadius: 0,
          }}
        />

        {/* Ambient glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Content area */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '56px 68px 52px',
          }}
        >
          {/* Top: badge + logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Type badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 999,
                padding: '8px 20px',
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: GOLD,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {badge}
              </span>
            </div>

            {/* Logo mark */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #34D399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                {LOGO_TEXT}
              </div>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                }}
              >
                {BRAND_NAME}
              </span>
            </div>
          </div>

          {/* Middle: title + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 780 }}>
            <div
              style={{
                fontSize: wrappedTitle.includes('\n') ? 64 : 72,
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                maxWidth: 780,
              }}
            >
              {wrappedTitle}
            </div>

            {wrappedDesc && (
              <div
                style={{
                  fontSize: 26,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.45,
                  maxWidth: 720,
                }}
              >
                {wrappedDesc}
              </div>
            )}
          </div>

          {/* Bottom: CTA + domain */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #E8C27A 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: BG,
                }}
              >
                →
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: GOLD,
                }}
              >
                {lang === 'zh' ? '探索你的意識潛能' : 'Explore your awareness'}
              </span>
            </div>

            <span
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.30)',
                fontWeight: 500,
              }}
            >
              {new URL(BASE_URL).hostname}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate',
        'Content-Type': 'image/png',
      },
    }
  );
}
