// Types for Awareness Be platform

// Re-export Pexels types for convenience
export type { PexelsPhoto, PexelsSearchResponse, PexelsSearchOptions, ImageCategory } from '@/lib/pexels';

// PexelsImage component types
export type ImageQuality = 'tiny' | 'small' | 'medium' | 'large' | 'large2x';
export type RoundedClass = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

// Valid image categories (strict allowlist)
export type ImageCategoryValid = 'hero' | 'about' | 'booking' | 'meditation' | 'nature' | 'wellness' | 'philosophy' | 'journal' | 'mbti';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  cachedAt: string;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

export interface PhotoResponse {
  photo: import('@/lib/pexels').PexelsPhoto;
  cachedAt: string;
}

export interface CategoryResponse {
  images: import('@/lib/pexels').PexelsPhoto[];
  category: ImageCategoryValid;
  count: number;
  cachedAt: string;
}

// Image Loading State
export type ImageLoadState = 'loading' | 'loaded' | 'error' | 'empty';

// Image component common props
export interface ImageComponentBaseProps {
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: RoundedClass;
  quality?: ImageQuality;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentMarkdown?: string;
  coverImage?: string;
  category: Category;
  tags: string[];
  author: Author;
  readingTime: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  title?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  price?: string;
}

export interface ConsultationBooking {
  name: string;
  email: string;
  phone?: string;
  healthGoals: string[];
  preferredTime: string;
  notes?: string;
  date?: string;
  time?: string;
}

export interface DeepSeekPostResponse {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface BookingFormData {
  name: string;
  email: string;
  primaryHealthGoals: string;
  preferredTime: string;
  message?: string;
}