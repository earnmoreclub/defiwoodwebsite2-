# Awareness Be

Premium health and wellness platform — minimalist, luxury, evidence-based.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **CMS:** Strapi 5 (Headless REST/Document API)
- **Styling:** Tailwind CSS, Framer Motion, Lucide Icons
- **AI:** DeepSeek API for automated content generation
- **Calendar:** Cal.com integration
- **Email:** Resend API for confirmations

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture

```
app/
├── (site)/
│   ├── page.tsx            # Main landing page
│   ├── blog/
│   │   ├── page.tsx        # Magazine blog feed
│   │   └── [slug]/page.tsx # Dynamic article rendering
│   └── book/page.tsx       # Dedicated booking page
├── api/
│   ├── cron/generate-post/ # DeepSeek + Strapi pipeline
│   └── booking/            # Booking form endpoint
components/
├── landing/                # Hero, Pillars, Proof
├── blog/                   # PostCard, EditorialGrid, Feed
├── booking/                # CalendarEmbed, IntakeForm
└── layout/                 # Navbar, Footer
lib/
├── deepseek.ts             # DeepSeek API client
├── strapi.ts               # Strapi REST client
└── calcom.ts               # Calendar integration
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRAPI_URL` | Strapi CMS base URL |
| `STRAPI_API_TOKEN` | Strapi API authentication token |
| `DEEPSEEK_API_KEY` | DeepSeek API key for content generation |
| `NEXT_PUBLIC_CALCOM_URL` | Cal.com username/profile URL |
| `RESEND_API_KEY` | Resend API key for emails |
| `CRON_SECRET` | Shared secret for cron job authentication |

## Auto-Blog Pipeline

The platform includes an automated content pipeline:

1. **Trigger:** Vercel Cron (Mon/Wed/Fri at 9 AM UTC)
2. **Generate:** DeepSeek API creates evidence-based wellness articles
3. **Publish:** Articles pushed directly to Strapi
4. **Revalidate:** Next.js revalidates `/blog` paths

Manual trigger:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/generate-post
```

## Design System

- **Background:** `#FAF8F5` (warm cream)
- **Primary:** `#1C2B26` (deep forest green)
- **Accent:** `#D4A373` (muted warm amber)
- **Typography:** Cormorant Garamond (serif) + Inter (sans)

## License

© 2026 Awareness Be. All rights reserved.