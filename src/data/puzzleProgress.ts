const SOLVED_KEY = 'chess-trainer-puzzles-solved-v1';

export function loadSolved(): Set<string> {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function markSolved(id: string) {
  const s = loadSolved();
  s.add(id);
  try {
    localStorage.setItem(SOLVED_KEY, JSON.stringify(Array.from(s)));
  } catch {}
}

export function clearSolved() {
  try { localStorage.removeItem(SOLVED_KEY); } catch {}
}
