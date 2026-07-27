'use client';

import { useState } from 'react';
import PexelsImage from '@/src/components/PexelsImage';

const categories = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'about', label: 'About' },
  { id: 'booking', label: 'Booking' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'nature', label: 'Nature' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'journal', label: 'Journal' },
] as const;

export default function AIDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('hero');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AI Image Generation Demo
        </h1>

        {/* Category Selector */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Select Category:</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-white/70 hover:bg-dark-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Image Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Generated Image:</h2>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              Regenerate
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <PexelsImage
              key={`${selectedCategory}-${refreshKey}`}
              category={selectedCategory as any}
              width={1024}
              height={1024}
              provider="puter"
              className="w-full max-w-2xl mx-auto"
              priority
            />
          </div>
        </div>

        {/* Custom Prompt Section */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Custom Prompt Example:</h2>
          <PexelsImage
            prompt="A peaceful zen garden with cherry blossoms, soft morning light, photorealistic, 4K"
            width={1024}
            height={576}
            provider="puter"
            className="w-full max-w-3xl mx-auto"
          />
        </div>

        {/* Info */}
        <div className="mt-12 p-6 bg-dark-800 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">How it works:</h3>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Uses Puter.js for client-side AI image generation</li>
            <li>No API key required - runs directly in the browser</li>
            <li>Supports 8 predefined categories with optimized prompts</li>
            <li>Custom prompts can be provided for specific images</li>
            <li>Images are generated using multiple AI providers (OpenAI, Gemini, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
