'use client';

import { useCopy } from './PhilosophyExperience';

export default function PhilosophyFooter() {
  const copy = useCopy();
  return (
    <footer className="border-t border-charcoal/10 bg-cream-100">
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="font-serif text-2xl text-charcoal">{copy.brand}</div>
          <div className="mt-2 text-sm text-charcoal/60 italic">{copy.footer.tagline}</div>
          <div className="mt-6 text-xs uppercase tracking-editorial text-charcoal/40">
            {copy.footer.note}
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-editorial text-charcoal/60 hover:text-charcoal transition-colors"
          >
            ↑ {copy.footer.back}
          </a>
          <div className="text-xs text-charcoal/40">© 2026 Awareness Be</div>
        </div>
      </div>
    </footer>
  );
}
