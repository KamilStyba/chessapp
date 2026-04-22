import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  matches: string[];
}

const ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: '♞', matches: ['/'] },
  { to: '/opening/queens-gambit', label: "QG", icon: '♛', matches: ['/opening/queens-gambit'] },
  { to: '/opening/sicilian', label: 'Sicilian', icon: '♚', matches: ['/opening/sicilian'] },
  { to: '/puzzles', label: 'Puzzles', icon: '🧩', matches: ['/puzzles', '/puzzle'] },
  { to: '/drills', label: 'Drills', icon: '🎯', matches: ['/drills'] },
  { to: '/play', label: 'Play', icon: '⚔️', matches: ['/play'] },
  { to: '/explore', label: 'Explore', icon: '🧭', matches: ['/explore'] },
];

export function NavBar() {
  const loc = useLocation();
  const isActive = (item: NavItem) =>
    item.to === '/'
      ? loc.pathname === '/'
      : item.matches.some((p) => loc.pathname === p || loc.pathname.startsWith(p + '/'));

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">♞</span>
        <span className="brand-name">Openings Trainer</span>
      </Link>
      <div className="nav-links">
        {ITEMS.slice(1).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={isActive(item) ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/settings"
          className={loc.pathname === '/settings' ? 'active' : ''}
          title="Settings"
        >
          ⚙
        </Link>
      </div>
    </nav>
  );
}

export function BottomTabs() {
  const loc = useLocation();
  const isActive = (item: NavItem) =>
    item.to === '/'
      ? loc.pathname === '/'
      : item.matches.some((p) => loc.pathname === p || loc.pathname.startsWith(p + '/'));

  const tabs = [
    { to: '/', label: 'Home', icon: '⌂', matches: ['/'] },
    { to: '/puzzles', label: 'Puzzles', icon: '🧩', matches: ['/puzzles', '/puzzle'] },
    { to: '/drills', label: 'Drills', icon: '🎯', matches: ['/drills'] },
    { to: '/play', label: 'Play', icon: '⚔️', matches: ['/play'] },
    { to: '/explore', label: 'Explore', icon: '🧭', matches: ['/explore'] },
    { to: '/settings', label: 'Settings', icon: '⚙', matches: ['/settings'] },
  ];

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
