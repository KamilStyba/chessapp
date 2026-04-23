import { Link, useLocation } from 'react-router-dom';
import { CommandPalette, useCommandPalette } from './CommandPalette';
import { useEffect, useState } from 'react';

const STREAK_KEY = 'chess-trainer-drills-session-v1';

function loadStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return parsed.streak ?? 0;
  } catch {
    return 0;
  }
}

export function NavBar() {
  const { open, setOpen } = useCommandPalette();
  const [streak, setStreak] = useState(0);
  const loc = useLocation();

  useEffect(() => { setStreak(loadStreak()); }, [loc.pathname]);

  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand-block">
          <span className="brand-mark-circle" aria-hidden>♞</span>
          <span>Gambit</span>
          <span className="brand-divider">|</span>
          <span className="brand-sub">Openings Trainer</span>
        </Link>
        <button className="search-btn" onClick={() => setOpen(true)} aria-label="Open command palette">
          <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          <span style={{ marginLeft: '0.5rem' }}>Search lessons, variations, puzzles…</span>
        </button>
        <div className="topbar-right">
          {streak > 0 && (
            <span className="streak-pill" title={`Drill streak: ${streak}`}>
              🔥 Streak · {streak}
            </span>
          )}
          <Link to="/settings" className="avatar-chip" aria-label="Settings">⚙</Link>
        </div>
      </header>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

interface BottomNavItem {
  to: string;
  label: string;
  icon: string;
  matches: string[];
}

export function BottomTabs() {
  const loc = useLocation();
  const tabs: BottomNavItem[] = [
    { to: '/', label: 'Home', icon: '⌂', matches: ['/'] },
    { to: '/puzzles', label: 'Puzzles', icon: '◆', matches: ['/puzzles', '/puzzle'] },
    { to: '/drills', label: 'Drills', icon: '◇', matches: ['/drills'] },
    { to: '/play', label: 'Play', icon: '♟', matches: ['/play'] },
    { to: '/explore', label: 'Explore', icon: '⌕', matches: ['/explore'] },
    { to: '/settings', label: 'Me', icon: '●', matches: ['/settings'] },
  ];
  const isActive = (item: BottomNavItem) =>
    item.to === '/'
      ? loc.pathname === '/'
      : item.matches.some((p) => loc.pathname === p || loc.pathname.startsWith(p + '/'));

  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} className={isActive(t) ? 'tab active' : 'tab'}>
          <span className="tab-icon" aria-hidden>{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
