import { Chess } from 'chess.js';

export function lastMoveFromSans(
  sans: string[],
  ply: number,
): { from: string; to: string } | null {
  if (ply <= 0) return null;
  const c = new Chess();
  for (let i = 0; i < Math.min(ply - 1, sans.length); i++) {
    try { c.move(sans[i]); } catch { return null; }
  }
  try {
    const m = c.move(sans[ply - 1]);
    if (!m) return null;
    return { from: m.from, to: m.to };
  } catch {
    return null;
  }
}
