import { config } from 'dotenv';
import { streamText } from 'ai';

// Load .env.local explicitly
config({ path: '.env.local' });

async function main() {
  console.log('Starting AI Gateway demo with google/gemini-3.1-flash-lite-image...\n');
  
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  console.log('API Key loaded:', apiKey ? 'Yes (starts with ' + apiKey.substring(0, 4) + '...)' : 'No');
  console.log('');

  const result = streamText({
    model: 'google/gemini-3.1-flash-lite-image',
    system: 'You are a helpful assistant. Keep responses concise.',
    prompt: 'Say hello and tell me what image generation capabilities you have.',
  });

  let fullText = '';

  console.log('Streaming response:\n---');

  for await (const delta of result.fullStream) {
    if (delta.type === 'text-delta') {
      process.stdout.write(delta.text);
      fullText += delta.text;
    }
  }

  console.log('\n\n---');
  console.log('\nFull response:', fullText);

  const usage = await result.usage;
  if (usage) {
    console.log('\nToken Usage:');
    console.log(`  Input Tokens: ${usage.inputTokens}`);
    console.log(`  Output Tokens: ${usage.outputTokens}`);
  }
}

main().catch(console.error);
