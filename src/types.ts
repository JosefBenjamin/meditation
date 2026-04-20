export type Phase = 'intro' | 'reflection' | 'question' | 'result';
export type AccentId = 'sage' | 'lavender' | 'dawn';
export type MotifKind = 'orb' | 'rings' | 'wave' | 'lotus';
export type ViewMode = 'host' | 'standalone';
export type FadeState = 'in' | 'out';

export type QuizOption = {
  text: string;
  correct: boolean;
};

export type Question = {
  eyebrow: string;
  prompt: string;
  options: QuizOption[];
  gentle: string;
};

export type Practice = {
  name: string;
  italic: string;
  duration: string;
  teacher: string;
  description: string;
};

export type Lesson = {
  id: number;
  topic: string;
  questions: Question[];
  practice: Practice;
};

export type Tweaks = {
  accent: AccentId;
  motif: MotifKind;
  dusk: boolean;
  transition: number;
  view: ViewMode;
  language: 'en' | 'da';
};

export type SavedProgress = {
  v: 1;
  lesson: number;
  phase: Phase;
  qIdx: number;
  score: number;
  picked: number | null;
  revealed: boolean;
  ts: number;
};
