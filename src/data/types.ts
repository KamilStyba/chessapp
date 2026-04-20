export interface AnnotatedMove {
  san: string;
  comment: string;
  keyIdea?: string;
  alternatives?: { san: string; why: string }[];
}

export interface Variation {
  id: string;
  name: string;
  eco?: string;
  summary: string;
  line: AnnotatedMove[];
  subVariations?: Variation[];
}

export interface PawnStructure {
  name: string;
  description: string;
  fen?: string;
}

export interface Trap {
  name: string;
  line: string[];
  comment: string;
}

export interface Lesson {
  id: string;
  parent: 'queens-gambit' | 'sicilian';
  title: string;
  intro: string;
  themes: string[];
  pawnStructures: PawnStructure[];
  typicalPlans: { white: string[]; black: string[] };
  mainLine: Variation;
  variations: Variation[];
  commonTraps?: Trap[];
}

export interface OpeningOverview {
  id: 'queens-gambit' | 'sicilian';
  title: string;
  subtitle: string;
  intro: string;
  coreIdeas: string[];
  lessons: { id: string; title: string; blurb: string }[];
}

export interface MasterGame {
  id: string;
  opening: 'queens-gambit' | 'sicilian';
  lessonId?: string;
  white: string;
  black: string;
  event: string;
  year: number;
  result: string;
  intro: string;
  pgn: string;
  annotations: Record<number, string>;
}
