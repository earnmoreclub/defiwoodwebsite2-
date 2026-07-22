import type {
  PresentOption,
  WhereOption,
  TimeOption,
  SupportOption,
  RitualRecommendation,
} from '@/types/tools';

export const PRESENT_OPTIONS: Array<{
  id: PresentOption;
  label: string;
  description: string;
}> = [
  { id: 'overwhelmed', label: 'Overwhelmed', description: 'Too much, too loud, too fast.' },
  { id: 'scattered', label: 'Scattered focus', description: 'Attention slipping away from the task at hand.' },
  { id: 'low-energy', label: 'Low energy', description: 'Drained, heavy, wanting to soften.' },
  { id: 'sleep', label: 'Seeking sleep', description: 'Body awake but mind still circling.' },
  { id: 'tense-body', label: 'Tense body', description: 'Shoulders, jaw or stomach holding the day.' },
];

export const WHERE_OPTIONS: Array<{
  id: WhereOption;
  label: string;
  description: string;
}> = [
  { id: 'desk', label: 'At my desk', description: 'A screen, a chair, a closed door.' },
  { id: 'transit', label: 'In transit', description: 'Between two places.' },
  { id: 'home', label: 'At home', description: 'Somewhere quiet and familiar.' },
  { id: 'in-bed', label: 'In bed', description: 'Already horizontal.' },
  { id: 'outdoors', label: 'Outdoors', description: 'Open air and changing light.' },
];

export const TIME_OPTIONS: Array<{ id: TimeOption; label: string; seconds: number }> = [
  { id: '1-min', label: '1 minute', seconds: 60 },
  { id: '5-min', label: '5 minutes', seconds: 300 },
  { id: '15-min', label: '15 minutes', seconds: 900 },
];

export const SUPPORT_OPTIONS: Array<{
  id: SupportOption;
  label: string;
  description: string;
}> = [
  { id: 'somatic', label: 'Somatic reset', description: 'Move, release, settle through the body.' },
  { id: 'breathwork', label: 'Breathwork', description: 'A small change in how you breathe.' },
  { id: 'reflection', label: 'Quiet reflection', description: 'A few sentences, written slowly.' },
  { id: 'sensory', label: 'Sensory pause', description: 'Listen, look, taste — arrive.' },
];

export const MEET_MOMENT_CARDS = [
  {
    index: '01',
    title: 'After too much screen time',
    note: 'A 60-second visual rest — eyes soft, blink long, look at the farthest thing you can see.',
  },
  {
    index: '02',
    title: 'Before a difficult conversation',
    note: 'Three slow exhales, twice as long as your inhale. The body leads, the words follow.',
  },
  {
    index: '03',
    title: 'When focus feels far away',
    note: 'Name five things you can hear. One thing you can feel against your skin. Begin again.',
  },
  {
    index: '04',
    title: 'At the edge of sleep',
    note: 'Place both hands on the lower ribs. Let the breath grow shallow and unforced.',
  },
];

/**
 * Build one tailored ritual from a CheckInState.
 * Order of priority: support → present → where → time.
 */
export function buildRitual(input: {
  present?: PresentOption;
  where?: WhereOption;
  time?: TimeOption;
  support?: SupportOption;
}): RitualRecommendation {
  const { present, time, support } = input;
  const seconds =
    time === '1-min' ? 60 : time === '5-min' ? 300 : 900;

  if (support === 'breathwork') {
    return {
      title: present === 'sleep' ? 'Bedtime 4-7-8 Breath' : 'Box Breath, Slowly',
      guidance:
        present === 'sleep'
          ? 'Inhale quietly through the nose for 4. Hold for 7. Exhale through pursed lips for 8. Repeat four times. The longer exhale tells the nervous system it is safe to rest.'
          : 'Inhale for 4, hold for 4, exhale for 4, hold for 4. Five rounds is enough to change the temperature of a room.',
      durationSeconds: seconds,
      productName: 'Pocket Breath — Travel Cedar Inhaler',
      productNote: 'A small cedar wick to keep the breath pointed and slow.',
    };
  }

  if (support === 'somatic') {
    return {
      title: present === 'tense-body' ? 'Jaw, Shoulders, Belly Release' : 'Slow Standing Reset',
      guidance:
        present === 'tense-body'
          ? 'Unclench the jaw. Roll the shoulders once. Place a hand on the belly and feel it rise and fall three times. That is the whole practice.'
          : 'Stand tall, soften the knees, lengthen the spine. Reach up, sigh out. Repeat five times with the eyes closed if you can.',
      durationSeconds: seconds,
      productName: 'Warming Muscle Salve',
      productNote: 'A small tin for shoulders, feet and temples.',
    };
  }

  if (support === 'reflection') {
    return {
      title: 'Three Sentences, Slowly Written',
      guidance:
        'Open a notebook. Write: What is here right now. What does it ask of me. One small thing I can do in the next ten minutes. Stop there.',
      durationSeconds: seconds,
      productName: 'Quiet Linen Notebook',
      productNote: 'A small notebook for small, important thoughts.',
    };
  }

  // sensory
  return {
    title: 'A Sensory Pause',
    guidance:
      'Choose one sense and stay with it for the next minute. The hum of a room, the weight of a cup, the cool of air on skin. The aim is not to think — only to arrive.',
    durationSeconds: seconds,
    productName: 'House Blend Tea — Morning Quiet',
    productNote: 'A loose-leaf tea to anchor sensory attention.',
  };
}

export const formatDuration = (s: number) => {
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  return `${m} min`;
};