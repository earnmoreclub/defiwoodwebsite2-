import { Metadata } from 'next';
import BookingSection from '@/components/booking/BookingSection';

export const metadata: Metadata = {
  title: 'Book Your Consultation | Awareness Be',
  description: 'Schedule your 1-on-1 holistic health intake consultation. Begin your wellness journey today.',
};

export default function BookPage() {
  return (
    <main className="pt-20">
      <BookingSection />
    </main>
  );
}