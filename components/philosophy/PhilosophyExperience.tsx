'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider, useCart } from './cart/CartContext';
import PhilosophyHeader from './PhilosophyHeader';
import PhilosophyHero from './PhilosophyHero';
import RitualsWizard from './RitualsWizard';
import BreathingTool from './BreathingTool';
import SituationalCards from './SituationalCards';
import PhilosophyFooter from './PhilosophyFooter';
import CartDrawer from './cart/CartDrawer';

type Locale = 'en' | 'zh-TW';

type Copy = {
  brand: string;
  est: string;
  nav: { rituals: string; journal: string; standard: string };
  cta: { begin: string; findRitual: string; exploreJournal: string };
  hero: { headline: string; subtitle: string };
  wizard: WizardCopy;
  breathing: BreathingCopy;
  cards: { title: string; subtitle: string; items: CardItem[] };
  footer: { tagline: string; back: string; note: string };
};

export type WizardCopy = {
  title: string;
  subtitle: string;
  steps: Array<{ title: string; subtitle: string; options: string[] }>;
  next: string;
  back: string;
  restart: string;
  resultTitle: string;
  resultSubtitle: string;
  start: string;
  match: string;
  paired: string;
};

export type BreathingCopy = {
  title: string;
  subtitle: string;
  start: string;
  pause: string;
  reset: string;
  inhale: string;
  hold: string;
  exhale: string;
  pauseWord: string;
  cycles: string;
};

export type CardItem = { tag: string; title: string; description: string; ritual: string };

const COPY: Record<Locale, Copy> = {
  en: {
    brand: 'AWARENESS BE',
    est: 'EST. 2026',
    nav: { rituals: 'Rituals', journal: 'The Journal', standard: 'Our Standard' },
    cta: { begin: 'Begin', findRitual: 'Find my ritual ↘', exploreJournal: 'Explore the journal' },
    hero: {
      headline: 'A quieter next step.',
      subtitle:
        'Tell us what feels present, where you are, and how much time you have. Receive one considered ritual — without adding more noise.',
    },
    wizard: {
      title: 'Find your ritual',
      subtitle: 'Four short questions. One tailored practice, kept private to your browser.',
      steps: [
        {
          title: 'What feels most present?',
          subtitle: 'Choose the sensation that most describes this moment.',
          options: ['Overwhelmed', 'Scattered focus', 'Low energy', 'Seeking sleep', 'Tense body'],
        },
        {
          title: 'Where are you right now?',
          subtitle: 'A context, not a location.',
          options: ['At my desk', 'In transit', 'At home', 'In bed', 'Outdoors'],
        },
        {
          title: 'How much time do you have?',
          subtitle: 'Honest time, not aspirational time.',
          options: ['1 minute', '5 minutes', '15 minutes'],
        },
        {
          title: 'What kind of support do you need?',
          subtitle: 'A texture of support.',
          options: ['Somatic reset', 'Breathwork', 'Quiet reflection', 'Sensory pause'],
        },
      ],
      next: 'Continue',
      back: 'Back',
      restart: 'Begin again',
      resultTitle: 'Your considered ritual',
      resultSubtitle: 'A single practice, offered for the moment you described.',
      start: 'Begin now',
      match: 'Why this matches',
      paired: 'Paired with',
    },
    breathing: {
      title: '60-second reset',
      subtitle: 'A box of breath. Inhale 4 · Hold 4 · Exhale 4 · Pause 4.',
      start: 'Begin',
      pause: 'Pause',
      reset: 'Reset',
      inhale: 'Inhale',
      hold: 'Hold',
      exhale: 'Exhale',
      pauseWord: 'Settle',
      cycles: 'Cycles',
    },
    cards: {
      title: 'Meet the moment',
      subtitle: 'A few quiet shortcuts when you do not want to choose.',
      items: [
        {
          tag: '01',
          title: 'After too much screen time',
          description: 'Soften the eyes, drop the shoulders, lengthen the exhale.',
          ritual: 'Soft gaze · 90s',
        },
        {
          tag: '02',
          title: 'Before a difficult conversation',
          description: 'Find your feet. Three slow breaths. A single true sentence.',
          ritual: 'Grounding · 2 min',
        },
        {
          tag: '03',
          title: 'When focus feels far away',
          description: 'A single object. A single breath. Begin again from there.',
          ritual: 'Single-point · 60s',
        },
        {
          tag: '04',
          title: 'At the edge of sleep',
          description: 'Dim the room within. Let the body lead.',
          ritual: 'Downshift · 4 min',
        },
      ],
    },
    footer: {
      tagline: 'Considered rituals for a quieter life.',
      back: 'Return to the beginning',
      note: 'Private by design. Your answers stay in your browser.',
    },
  },
  'zh-TW': {
    brand: 'AWARENESS BE',
    est: '成立於 2026',
    nav: { rituals: '儀式', journal: '日誌', standard: '我們的標準' },
    cta: { begin: '開始', findRitual: '為我尋一個儀式 ↘', exploreJournal: '閱讀日誌' },
    hero: {
      headline: '更安靜的下一步。',
      subtitle:
        '告訴我們此刻的感受、所在，以及擁有的時間。我們會給你一個被慎重對待的儀式 —— 而非更多雜訊。',
    },
    wizard: {
      title: '尋找你的儀式',
      subtitle: '四個簡短問題。一個為此刻設計的練習，全程留在你的瀏覽器。',
      steps: [
        {
          title: '此刻最接近的感受是？',
          subtitle: '選一個最貼近當下的形容。',
          options: ['過於負荷', '難以集中', '能量低落', '渴望入睡', '身體緊繃'],
        },
        {
          title: '你現在身在何處？',
          subtitle: '是一種處境，不只是地點。',
          options: ['桌前', '通勤中', '在家', '躺在床上', '戶外'],
        },
        {
          title: '你有多少時間？',
          subtitle: '誠實的時間，而非期待中的時間。',
          options: ['1 分鐘', '5 分鐘', '15 分鐘'],
        },
        {
          title: '你需要哪一種支持？',
          subtitle: '一種支持的質地。',
          options: ['身體重啟', '呼吸練習', '安靜反思', '感官暫歇'],
        },
      ],
      next: '繼續',
      back: '返回',
      restart: '重新開始',
      resultTitle: '為你準備的儀式',
      resultSubtitle: '一個練習，為你所描述的此刻而生。',
      start: '立即開始',
      match: '為何適合',
      paired: '搭配',
    },
    breathing: {
      title: '60 秒重置',
      subtitle: '正方形呼吸：吸 4 · 停留 4 · 吐 4 · 停留 4。',
      start: '開始',
      pause: '暫停',
      reset: '重來',
      inhale: '吸',
      hold: '停留',
      exhale: '吐',
      pauseWord: '靜',
      cycles: '循環',
    },
    cards: {
      title: '此刻的需要',
      subtitle: '幾個安靜的捷徑，當你不想選擇時。',
      items: [
        {
          tag: '01',
          title: '用太多螢幕之後',
          description: '放鬆眼神，鬆開肩膀，延長吐氣。',
          ritual: '柔視 · 90 秒',
        },
        {
          tag: '02',
          title: '困難對話之前',
          description: '找到你的雙腳。三次緩慢的呼吸。一句真實的話。',
          ritual: '接地 · 2 分鐘',
        },
        {
          tag: '03',
          title: '專注遠離時',
          description: '一個對象，一次呼吸。從那裡重新開始。',
          ritual: '單點 · 60 秒',
        },
        {
          tag: '04',
          title: '將睡未睡之際',
          description: '調暗內在的房間，讓身體先行。',
          ritual: '下調 · 4 分鐘',
        },
      ],
    },
    footer: {
      tagline: '為更安靜的生活，所挑選的儀式。',
      back: '回到頂端',
      note: '設計上保持私密。你的回答只留在你的瀏覽器。',
    },
  },
};

const LocaleContext = createContext<Copy | null>(null);

export function useCopy(): Copy {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useCopy must be used inside PhilosophyExperience');
  return ctx;
}

function ScrollLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        const el = document.querySelector(to);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </a>
  );
}

function Shell({ locale, children }: { locale: string; children: ReactNode }) {
  const copy = COPY[(locale as Locale) ?? 'en'] ?? COPY.en;
  return <LocaleContext.Provider value={copy}>{children}</LocaleContext.Provider>;
}

function CartButton() {
  const { itemCount, openDrawer } = useCart();
  const copy = useCopy();
  return (
    <button
      onClick={openDrawer}
      aria-label="Open cart"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-charcoal/15 bg-cream-50 text-charcoal hover:bg-cream-100 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-sage text-cream-50 text-[10px] font-medium">
          {itemCount}
        </span>
      )}
      <span className="sr-only">{copy.cta.begin}</span>
    </button>
  );
}

export default function PhilosophyExperience({ locale }: { locale: string }) {
  return (
    <Shell locale={locale}>
      <CartProvider>
        <div className="min-h-screen bg-cream-50 text-charcoal font-sans" style={{ backgroundColor: '#FDFBF7' }}>
          <PhilosophyHeader ctaSlot={<CartButton />} />
          <main>
            <PhilosophyHero scrollTo="#check-in" />
            <section id="check-in" className="py-24 md:py-32" style={{ backgroundColor: '#F5F2EB' }}>
              <div className="max-w-5xl mx-auto px-6">
                <RitualsWizard />
              </div>
            </section>
            <section className="py-24 md:py-32" style={{ backgroundColor: '#FDFBF7' }}>
              <div className="max-w-5xl mx-auto px-6">
                <BreathingTool />
              </div>
            </section>
            <section className="py-24 md:py-32" style={{ backgroundColor: '#F5F2EB' }}>
              <div className="max-w-6xl mx-auto px-6">
                <SituationalCards />
              </div>
            </section>
          </main>
          <PhilosophyFooter />
          <CartDrawer />
        </div>
      </CartProvider>
    </Shell>
  );
}