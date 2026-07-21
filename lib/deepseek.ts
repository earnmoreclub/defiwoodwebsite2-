// DeepSeek AI API Client for Awareness Be Blog Generation
import type { DeepSeekPostResponse } from '@/types';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

// Health topics pool for blog generation
const TOPICS_POOL = [
  'The Gut-Brain Axis: How Your Microbiome Shapes Mental Health',
  'Metabolic Flexibility: The Key to Sustainable Energy',
  'Intermittent Fasting: Evidence-Based Protocols for Beginners',
  'Scalp Microbiome: The Hidden Foundation of Hair Health',
  'Circadian Rhythm Alignment: Optimizing Sleep Through Light',
  'Nervous System Regulation: Breathwork for Stress Resilience',
  'Inflammation and Longevity: The Root of Chronic Disease',
  'Nutrient Density: Building a Foundation for Vitality',
  'The Vagus Nerve: Your Body\'s Natural Healing Pathway',
  'Adaptogens: Ancient Wisdom Meets Modern Science',
  'Gut-Brain Connection: How Probiotics Support Mental Clarity',
  'Sleep Architecture: Maximizing Restorative Sleep Cycles',
  'Hormonal Balance: A Functional Medicine Perspective',
  'Detoxification Pathways: Supporting Your Body\'s Natural Filters',
  'Immune Resilience: Building Defense Through Nutrition',
];

// System prompt for the AI writer
const SYSTEM_PROMPT = `You are an expert medical writer and wellness consultant for 'Awareness Be', a premium health and wellness platform. 

Write authoritative, evidence-backed articles in clean Markdown format. Your writing style should be:
- Warm yet professional
- Grounded in peer-reviewed research
- Accessible to health-conscious readers
- Empathetic and empowering

Always include:
- A compelling introduction
- 3-5 key insights with practical takeaways
- Supporting research references (general citations, not specific links)
- A conclusion with actionable next steps

Format output as valid JSON with these exact keys:
{
  "title": "Article Title",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence compelling summary",
  "contentMarkdown": "Full article in Markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "seoTitle": "SEO-optimized title (under 60 chars)",
  "metaDescription": "Meta description (150-160 chars)"
}`;

export async function generateBlogPost(): Promise<DeepSeekPostResponse | null> {
  if (!DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key not configured');
    return null;
  }

  // Select a random topic
  const randomTopic = TOPICS_POOL[Math.floor(Math.random() * TOPICS_POOL.length)];

  const userPrompt = `Write an in-depth article about: "${randomTopic}"

Requirements:
- 800-1200 words
- Use hierarchical headings (##, ###)
- Include 2-3 relevant subheadings
- Add a pull quote or key insight callout
- End with 3 actionable takeaways readers can implement today`;

  try {
    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in DeepSeek response');
      return null;
    }

    // Parse JSON from the response
    // The model might wrap the JSON in markdown code blocks
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr) as DeepSeekPostResponse;

    // Generate slug if not provided
    if (!parsed.slug) {
      parsed.slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return parsed;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return null;
  }
}

// Validate that a generated post has all required fields
export function validatePostResponse(post: DeepSeekPostResponse): boolean {
  return !!(
    post.title &&
    post.slug &&
    post.excerpt &&
    post.contentMarkdown &&
    Array.isArray(post.tags) &&
    post.seoTitle &&
    post.metaDescription
  );
}