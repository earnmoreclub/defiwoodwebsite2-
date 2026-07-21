// Cal.com Calendar Integration for Awareness Be
import type { BookingFormData } from '@/types';

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com';

// Types for Cal.com booking
export interface CalComEventType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  duration: number;
  price?: number;
  currency?: string;
}

export interface CalComBookingPayload {
  eventTypeSlug: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  guests?: string[];
  notes?: string;
  responses?: {
    customInputs?: Record<string, string>;
  };
}

// Get the Cal.com URL for embedding
export function getCalComEmbedUrl(eventSlug: string = 'consultation'): string {
  return `${CALCOM_URL}/${eventSlug}`;
}

// Build booking link for Cal.com
export function buildBookingLink(
  eventSlug: string,
  options?: {
    name?: string;
    email?: string;
    date?: string;
  }
): string {
  const params = new URLSearchParams();
  if (options?.name) params.set('name', options.name);
  if (options?.email) params.set('email', options.email);
  if (options?.date) params.set('date', options.date);
  
  const queryString = params.toString();
  return `${CALCOM_URL}/${eventSlug}${queryString ? `?${queryString}` : ''}`;
}

// Validate booking form data
export function validateBookingForm(data: BookingFormData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Please enter your full name');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.primaryHealthGoals || data.primaryHealthGoals.trim().length < 10) {
    errors.push('Please describe your primary health goals');
  }

  if (!data.preferredTime) {
    errors.push('Please select a preferred time for your consultation');
  }

  return errors;
}

// Format booking data for API submission
export function formatBookingPayload(data: BookingFormData): {
  name: string;
  email: string;
  notes: string;
} {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    notes: `Health Goals: ${data.primaryHealthGoals}\n\nPreferred Time: ${data.preferredTime}${data.message ? `\n\nAdditional Notes: ${data.message}` : ''}`,
  };
}

// Get time slots (placeholder - in production, fetch from Cal.com API)
export async function getAvailableSlots(date: string): Promise<string[]> {
  // This would be replaced with actual Cal.com API calls
  const slots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];
  
  return slots;
}

// Health goals options for the booking form
export const HEALTH_GOALS_OPTIONS = [
  'Metabolic Health & Weight Management',
  'Gut Health & Digestive Issues',
  'Stress & Anxiety Management',
  'Sleep Optimization',
  'Hair & Skin Health',
  'Hormonal Balance',
  'Energy & Vitality',
  'Longevity & Prevention',
  'Other (will specify below)',
];

// Preferred time options
export const PREFERRED_TIME_OPTIONS = [
  'Morning (9 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 7 PM)',
  'Flexible / Any time',
];