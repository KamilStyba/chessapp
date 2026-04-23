const KEY = 'chess-trainer-last-studied-v1';

export interface LastStudied {
  openingId: string;
  openingTitle: string;
  lessonId: string;
  lessonTitle: string;
  variationId?: string;
  variationName?: string;
  timestamp: number;
}

export function recordLastStudied(entry: Omit<LastStudied, 'timestamp'>) {
  try {
    const all = loadAll();
    const existing = all.findIndex(
      (e) => e.openingId === entry.openingId && e.lessonId === entry.lessonId && e.variationId === entry.variationId,
    );
    const next: LastStudied = { ...entry, timestamp: Date.now() };
    if (existing >= 0) all[existing] = next;
    else all.unshift(next);
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)));
  } catch {}
}

export function loadAll(): LastStudied[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LastStudied[];
  } catch {
    return [];
  }
}

export function mostRecent(): LastStudied | null {
  const all = loadAll();
  return all[0] ?? null;
}

export function mostRecentForOpening(openingId: string): LastStudied | null {
  const all = loadAll();
  return all.find((e) => e.openingId === openingId) ?? null;
}
