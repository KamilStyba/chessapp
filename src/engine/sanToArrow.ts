import { Chess } from 'chess.js';

export function sanToSquares(fen: string, san: string): [string, string] | null {
  const c = new Chess(fen);
  try {
    const m = c.move(san);
    if (!m) return null;
    return [m.from, m.to];
  } catch {
    return null;
  }
}

export function buildArrows(
  fen: string,
  mainSan: string | undefined,
  alternatives: { san: string }[] | undefined,
): [string, string, string?][] {
  const arrows: [string, string, string?][] = [];
  if (mainSan) {
    const s = sanToSquares(fen, mainSan);
    if (s) arrows.push([s[0], s[1], '#f2b33d']);
  }
  if (alternatives) {
    for (const alt of alternatives) {
      const s = sanToSquares(fen, alt.san);
      if (s) arrows.push([s[0], s[1], '#7aa9ff']);
    }
  }
  return arrows;
}
