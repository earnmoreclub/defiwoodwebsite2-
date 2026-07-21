import Hero from '@/components/landing/Hero';
import Pillars from '@/components/landing/Pillars';
import BookingSection from '@/components/booking/BookingSection';
import EditorialFeed from '@/components/blog/EditorialFeed';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Core Pillars / Services */}
      <Pillars />

      {/* Editorial Blog Feed */}
      <EditorialFeed />

      {/* Booking Section */}
      <BookingSection />

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-editorial text-amber-500 mb-4 block">
            Our Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-8 leading-tight">
            Born from a belief that wellness should be <br className="hidden md:block" />
            accessible, evidence-based, and deeply human.
          </h2>
          <div className="space-y-6 text-stone-600 leading-relaxed max-w-2xl mx-auto">
            <p>
              Awareness Be was founded in 2026 on a simple premise: the modern wellness 
              industry has lost its way. Too much noise, too little evidence, too many 
              quick fixes and not enough depth.
            </p>
            <p>
              We exist to bridge the gap between cutting-edge metabolic science and 
              ancient wisdom — between gut resilience and mindful living, between 
              personalized data and intuitive practice.
            </p>
            <p>
              Every article we publish, every consultation we offer, every product we 
              recommend passes through the same filter: is this evidence-backed? Is 
              this aligned with holistic health? Would this serve someone we love?
            </p>
          </div>
          <div className="mt-12 pt-12 border-t border-stone-200">
            <p className="text-sm text-stone-500 italic max-w-xl mx-auto">
              "We don't sell miracles. We cultivate clarity, restore balance, and 
              provide the tools for evidence-based wellness that lasts."
            </p>
            <p className="text-xs uppercase tracking-editorial text-amber-500 mt-4">
              — The Awareness Be Team
            </p>
          </div>
        </div>
      </section>
    </>
  );
}