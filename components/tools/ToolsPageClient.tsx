'use client';

import { useEffect } from 'react';
import { CartProvider } from './CartProvider';
import StickyNav from './StickyNav';
import ToolsHero from './ToolsHero';
import CheckInWizard from './CheckInWizard';
import BreathingTool from './BreathingTool';
import MeetTheMoment from './MeetTheMoment';

const TOOLS_BG = '#FDFBF7';
const TOOLS_FG = '#1C1917';

export default function ToolsPageClient() {
  // Hide global dark-theme chrome (Navbar / Footer / LeadMagnetModal)
  // so the tools page renders with its own light-theme chrome.
  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor;
    const prevBodyColor = document.body.style.color;
    document.body.style.backgroundColor = TOOLS_BG;
    document.body.style.color = TOOLS_FG;

    const styleId = 'tools-hide-chrome';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      header[class*="fixed"][class*="z-50"]:not([data-tools-nav]),
      footer:not([data-tools-footer]) {
        display: none !important;
      }
      [data-lead-magnet-root] { display: none !important; }
    `;

    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.body.style.color = prevBodyColor;
      style?.remove();
    };
  }, []);

  return (
    <CartProvider>
      <div
        data-tools-root
        style={{
          background: TOOLS_BG,
          color: TOOLS_FG,
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div data-tools-nav>
          <StickyNav />
        </div>
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
    <footer
      data-tools-footer
      className="border-t border-stone-200 py-12"
    >
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