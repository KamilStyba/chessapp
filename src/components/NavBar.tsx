import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function NavBar() {
  const loc = useLocation();
  const is = (prefix: string) => loc.pathname === prefix || loc.pathname.startsWith(prefix + '/');
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={close}>
        <span className="brand-mark">♞</span>
        <span className="brand-name">Openings Trainer</span>
      </Link>
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        <Link onClick={close} className={is('/opening/queens-gambit') ? 'active' : ''} to="/opening/queens-gambit">Queen's Gambit</Link>
        <Link onClick={close} className={is('/opening/sicilian') ? 'active' : ''} to="/opening/sicilian">Sicilian</Link>
        <Link onClick={close} className={is('/puzzles') || is('/puzzle') ? 'active' : ''} to="/puzzles">Puzzles</Link>
        <Link onClick={close} className={is('/drills') ? 'active' : ''} to="/drills">Drills</Link>
        <Link onClick={close} className={is('/play') ? 'active' : ''} to="/play">Play</Link>
        <Link onClick={close} className={is('/explore') ? 'active' : ''} to="/explore">Explore</Link>
        <Link onClick={close} className={is('/settings') ? 'active' : ''} to="/settings">⚙</Link>
      </div>
    </nav>
  );
}
