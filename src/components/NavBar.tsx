import { Link, useLocation } from 'react-router-dom';

export function NavBar() {
  const loc = useLocation();
  const is = (prefix: string) => loc.pathname === prefix || loc.pathname.startsWith(prefix + '/');
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">♞</span>
        <span className="brand-name">Openings Trainer</span>
      </Link>
      <div className="nav-links">
        <Link className={is('/opening/queens-gambit') ? 'active' : ''} to="/opening/queens-gambit">Queen's Gambit</Link>
        <Link className={is('/opening/sicilian') ? 'active' : ''} to="/opening/sicilian">Sicilian</Link>
        <Link className={is('/puzzles') || is('/puzzle') ? 'active' : ''} to="/puzzles">Puzzles</Link>
        <Link className={is('/explore') ? 'active' : ''} to="/explore">Explore</Link>
      </div>
    </nav>
  );
}
