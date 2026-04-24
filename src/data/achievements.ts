const KEY = 'chess-trainer-achievements-v1';

export type AchievementId =
  | 'first-lesson'
  | 'finish-lesson'
  | 'five-lessons'
  | 'first-puzzle'
  | 'ten-puzzles'
  | 'all-puzzles'
  | 'streak-5'
  | 'streak-10'
  | 'off-book-explorer';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First step', description: 'Open your first lesson.', icon: '📖' },
  { id: 'finish-lesson', title: 'Through the line', description: 'Finish a lesson main line.', icon: '🎓' },
  { id: 'five-lessons', title: 'Well-read', description: 'Finish five lesson main lines.', icon: '📚' },
  { id: 'first-puzzle', title: 'Tactician', description: 'Solve your first puzzle.', icon: '🧩' },
  { id: 'ten-puzzles', title: 'Sharp eye', description: 'Solve ten puzzles.', icon: '🎯' },
  { id: 'all-puzzles', title: 'Puzzle master', description: 'Solve every puzzle.', icon: '👑' },
  { id: 'streak-5', title: 'Hot hand', description: '5-answer drill streak.', icon: '🔥' },
  { id: 'streak-10', title: 'On fire', description: '10-answer drill streak.', icon: '🔥🔥' },
  { id: 'off-book-explorer', title: 'Curious mind', description: 'Go off-book in a lesson.', icon: '🧭' },
];

interface Stored {
  unlocked: Record<string, number>; // achievementId -> timestamp
  finishedLessons: Record<string, number>; // lessonId -> timestamp
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { unlocked: {}, finishedLessons: {} };
}

function save(s: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

type Listener = (a: Achievement) => void;
const listeners = new Set<Listener>();

export function onUnlock(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function fire(id: AchievementId) {
  const meta = ALL_ACHIEVEMENTS.find((x) => x.id === id);
  if (!meta) return;
  listeners.forEach((cb) => cb(meta));
}

function unlock(id: AchievementId) {
  const s = load();
  if (s.unlocked[id]) return false;
  s.unlocked[id] = Date.now();
  save(s);
  fire(id);
  return true;
}

export function recordAchievement(
  kind: 'finish-lesson' | 'solve-puzzle' | 'streak' | 'off-book',
  payload?: Record<string, any>,
) {
  const s = load();

  if (kind === 'finish-lesson' && payload?.lessonId) {
    if (!s.finishedLessons[payload.lessonId]) {
      s.finishedLessons[payload.lessonId] = Date.now();
      save(s);
      unlock('finish-lesson');
      if (Object.keys(s.finishedLessons).length >= 5) unlock('five-lessons');
    }
  } else if (kind === 'solve-puzzle') {
    unlock('first-puzzle');
    if (payload?.totalSolved && payload.totalSolved >= 10) unlock('ten-puzzles');
    if (payload?.totalSolved && payload?.totalPuzzles && payload.totalSolved >= payload.totalPuzzles) {
      unlock('all-puzzles');
    }
  } else if (kind === 'streak') {
    const streak = payload?.streak ?? 0;
    if (streak >= 5) unlock('streak-5');
    if (streak >= 10) unlock('streak-10');
  } else if (kind === 'off-book') {
    unlock('off-book-explorer');
  }
}

export function recordFirstLesson() {
  unlock('first-lesson');
}

export function getUnlocked(): Record<string, number> {
  return load().unlocked;
}

export function countFinishedLessons(): number {
  return Object.keys(load().finishedLessons).length;
}

const XP_KEY = 'chess-trainer-xp-v1';

export interface XpState {
  xp: number;
  level: number;
}

function xpFor(level: number): number {
  return Math.round(50 * Math.pow(1.5, level - 1));
}

export function xpState(): XpState {
  try {
    const raw = localStorage.getItem(XP_KEY);
    if (!raw) return { xp: 0, level: 1 };
    return JSON.parse(raw);
  } catch {
    return { xp: 0, level: 1 };
  }
}

export function xpForNextLevel(level: number): number {
  return xpFor(level);
}

export function addXp(amount: number): XpState {
  let s = xpState();
  s.xp += amount;
  while (s.xp >= xpFor(s.level)) {
    s.xp -= xpFor(s.level);
    s.level += 1;
  }
  try { localStorage.setItem(XP_KEY, JSON.stringify(s)); } catch {}
  return s;
}
