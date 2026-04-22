import { openings } from '../data/registry';
import { Variation, Lesson } from '../data/types';

export interface DetectionResult {
  openingId: 'queens-gambit' | 'sicilian';
  openingTitle: string;
  lesson: Lesson;
  variation?: Variation;
  subVariation?: Variation;
  matchedPlies: number;
}

interface Candidate {
  openingId: 'queens-gambit' | 'sicilian';
  openingTitle: string;
  lesson: Lesson;
  line: string[];
  variation?: Variation;
  subVariation?: Variation;
}

function variationsToCandidates(
  openingId: 'queens-gambit' | 'sicilian',
  openingTitle: string,
  lesson: Lesson,
): Candidate[] {
  const out: Candidate[] = [];
  out.push({
    openingId,
    openingTitle,
    lesson,
    line: lesson.mainLine.line.map((m) => m.san),
  });
  for (const v of lesson.variations) {
    out.push({
      openingId,
      openingTitle,
      lesson,
      variation: v,
      line: v.line.map((m) => m.san),
    });
    if (v.subVariations) {
      for (const sv of v.subVariations) {
        out.push({
          openingId,
          openingTitle,
          lesson,
          variation: v,
          subVariation: sv,
          line: sv.line.map((m) => m.san),
        });
      }
    }
  }
  return out;
}

function allCandidates(): Candidate[] {
  const out: Candidate[] = [];
  for (const op of openings) {
    for (const lesson of op.lessons) {
      out.push(...variationsToCandidates(op.id, op.title, lesson));
    }
  }
  return out;
}

export function detectOpening(playedSans: string[]): DetectionResult | null {
  if (playedSans.length === 0) return null;
  const cands = allCandidates();
  let best: { cand: Candidate; matched: number } | null = null;
  for (const cand of cands) {
    let matched = 0;
    for (let i = 0; i < playedSans.length && i < cand.line.length; i++) {
      if (cand.line[i] !== playedSans[i]) break;
      matched++;
    }
    if (matched === 0) continue;
    if (!best || matched > best.matched) best = { cand, matched };
  }
  if (!best) return null;
  return {
    openingId: best.cand.openingId,
    openingTitle: best.cand.openingTitle,
    lesson: best.cand.lesson,
    variation: best.cand.variation,
    subVariation: best.cand.subVariation,
    matchedPlies: best.matched,
  };
}

export interface BookMoveSuggestion {
  san: string;
  openingTitle: string;
  lessonTitle: string;
  lessonId: string;
  openingId: string;
  variationName?: string;
}

export function nextBookMoves(playedSans: string[]): BookMoveSuggestion[] {
  const cands = allCandidates();
  const suggestions = new Map<string, BookMoveSuggestion>();
  for (const cand of cands) {
    if (cand.line.length <= playedSans.length) continue;
    let matchesAll = true;
    for (let i = 0; i < playedSans.length; i++) {
      if (cand.line[i] !== playedSans[i]) {
        matchesAll = false;
        break;
      }
    }
    if (!matchesAll) continue;
    const nextSan = cand.line[playedSans.length];
    if (!suggestions.has(nextSan)) {
      suggestions.set(nextSan, {
        san: nextSan,
        openingTitle: cand.openingTitle,
        lessonTitle: cand.lesson.title,
        lessonId: cand.lesson.id,
        openingId: cand.openingId,
        variationName: cand.variation?.name ?? cand.subVariation?.name,
      });
    }
  }
  return Array.from(suggestions.values());
}
