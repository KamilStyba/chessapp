import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'sepia';
export type BoardStyle = 'classic' | 'blue' | 'green' | 'rose' | 'mono';

export interface Prefs {
  theme: Theme;
  boardStyle: BoardStyle;
  showArrows: boolean;
  sound: boolean;
}

const DEFAULTS: Prefs = {
  theme: 'dark',
  boardStyle: 'classic',
  showArrows: true,
  sound: true,
};

const KEY = 'chess-trainer-prefs-v1';

function load(): Prefs {
  if (typeof localStorage === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function save(p: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

interface Ctx {
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
}

const PrefsCtx = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(() => load());

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  const setPrefs = (patch: Partial<Prefs>) => {
    setPrefsState((cur) => {
      const next = { ...cur, ...patch };
      save(next);
      return next;
    });
  };

  return <PrefsCtx.Provider value={{ prefs, setPrefs }}>{children}</PrefsCtx.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsCtx);
  if (!ctx) throw new Error('usePrefs outside PrefsProvider');
  return ctx;
}

export const BOARD_PALETTES: Record<BoardStyle, { light: string; dark: string; label: string }> = {
  classic: { light: '#eef1f6', dark: '#6b7a99', label: 'Classic' },
  blue: { light: '#dee3ee', dark: '#5d7fb4', label: 'Blue' },
  green: { light: '#eeeed2', dark: '#769656', label: 'Green (lichess)' },
  rose: { light: '#f1dfe2', dark: '#b47891', label: 'Rose' },
  mono: { light: '#d9d9d9', dark: '#555555', label: 'Monochrome' },
};
