// Types for Awareness Be platform

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