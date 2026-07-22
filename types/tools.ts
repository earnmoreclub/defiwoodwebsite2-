export type RitualStep = 'present' | 'where' | 'time' | 'support';

export interface Option<T extends string = string> {
  id: T;
  label: string;
  description?: string;
  icon?: string;
}

export type PresentOption =
  | 'overwhelmed'
  | 'scattered'
  | 'low-energy'
  | 'sleep'
  | 'tense-body';

export type WhereOption =
  | 'desk'
  | 'transit'
  | 'home'
  | 'in-bed'
  | 'outdoors';

export type TimeOption = '1-min' | '5-min' | '15-min';

export type SupportOption =
  | 'somatic'
  | 'breathwork'
  | 'reflection'
  | 'sensory';

export interface CheckInState {
  present?: PresentOption;
  where?: WhereOption;
  time?: TimeOption;
  support?: SupportOption;
}

export interface RitualRecommendation {
  title: string;
  guidance: string;
  durationSeconds: number;
  productName: string;
  productNote: string;
}

export interface CartItem {
  id: string;
  name: string;
  note: string;
  price: number;
  qty: number;
}
