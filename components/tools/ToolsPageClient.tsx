'use client';

import { CartProvider } from './CartProvider';
import StickyNav from './StickyNav';
import ToolsHero from './ToolsHero';
import CheckInWizard from './CheckInWizard';
import BreathingTool from './BreathingTool';
import MeetTheMoment from './MeetTheMoment';

const TOOLS_BG = '#FDFBF7';
const TOOLS_FG = '#1C1917';

export default function ToolsPageClient() {
  return (
    // full-viewport overlay above the global chrome (Navbar / Footer / LeadMagnet)
    <div
      data-tools-root
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: TOOLS_BG,
        color: TOOLS_FG,
        overflowY: 'auto',
        overflowX: 'hidden',
        // CSS variable overrides for any inherited dark theme tokens
        ['--tw-bg-opacity' as any]: '1',
      }}
    >
      <style>{`
        /* Scope any Tailwind dark: variants to ignore us — we're always light here */
        [data-tools-root] .dark\\:text-slate-300 { color: #1C1917 !important; }
        [data-tools-root] .dark\\:bg-dark-950   { background-color: #FDFBF7 !important; }
        [data-tools-root] .dark\\:bg-dark-900   { background-color: #FDFBF7 !important; }
        [data-tools-root] .dark\\:bg-dark-800   { background-color: #FFFFFF !important; }
        [data-tools-root] .dark\\:border-white\\/10 { border-color: rgba(0,0,0,0.08) !important; }
        [data-tools-root] .dark\\:text-white    { color: #1C1917 !important; }
        [data-tools-root] .dark\\:text-slate-400 { color: #57534E !important; }
        [data-tools-root] .dark\\:text-slate-200 { color: #292524 !important; }
        [data-tools-root] .dark\\:text-slate-100 { color: #1C1917 !important; }
      `}</style>

      <CartProvider>
        <StickyNav />
        <main>
          <ToolsHero />
          <CheckInWizard />
          <BreathingTool />
          <MeetTheMoment />
          <ToolsFooter />
        </main>
      </CartProvider>
    </div>
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