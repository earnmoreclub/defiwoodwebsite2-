'use client';

import { CartProvider } from './CartProvider';
import StickyNav from './StickyNav';
import ToolsHero from './ToolsHero';
import CheckInWizard from './CheckInWizard';
import BreathingTool from './BreathingTool';
import MeetTheMoment from './MeetTheMoment';

export default function ToolsPageClient() {
  return (
    <CartProvider>
      <div
        style={{
          background: '#FDFBF7',
          color: '#1C1917',
          minHeight: '100vh',
        }}
      >
        <StickyNav />
        <main>
          <ToolsHero />
          <CheckInWizard />
          <BreathingTool />
          <MeetTheMoment />
          <ToolsFooter />
        </main>
      </div>
    </CartProvider>
  );
}

function ToolsFooter() {
  return (
    <footer className="border-t border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="font-serif text-[14px] tracking-[0.18em] text-stone-900">
          AWARENESS&nbsp;BE
          <span className="ml-3 text-[11px] text-stone-400 tracking-[0.2em]">
            · 2026
          </span>
        </div>
        <p className="text-[12px] text-stone-500 max-w-[40ch] leading-relaxed">
          A quiet practice of small, considered things. Made for browsers. No
          accounts. No tracking.
        </p>
      </div>
    </footer>
  );
}