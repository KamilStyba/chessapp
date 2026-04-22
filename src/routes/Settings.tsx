import { Link } from 'react-router-dom';
import { BOARD_PALETTES, BoardStyle, Theme, usePrefs } from '../prefs';
import { Board } from '../components/Board';

const THEMES: { id: Theme; label: string; description: string }[] = [
  { id: 'dark', label: 'Dark', description: 'Default. Easier on the eyes at night.' },
  { id: 'light', label: 'Light', description: 'High-contrast for bright rooms.' },
  { id: 'sepia', label: 'Sepia', description: 'Warm paper tone for long reading.' },
];

const DEMO_FEN = 'r1bqkb1r/pp3ppp/2np1n2/4p3/4P3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6';

export function Settings() {
  const { prefs, setPrefs } = usePrefs();

  return (
    <div className="settings-page">
      <header className="page-hero small">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Settings</h1>
      </header>

      <section className="settings-section">
        <h2>Theme</h2>
        <div className="radio-grid">
          {THEMES.map((t) => (
            <label key={t.id} className={`radio-card ${prefs.theme === t.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="theme"
                value={t.id}
                checked={prefs.theme === t.id}
                onChange={() => setPrefs({ theme: t.id })}
              />
              <div className="radio-title">{t.label}</div>
              <div className="radio-desc">{t.description}</div>
            </label>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2>Board colors</h2>
        <div className="board-style-grid">
          {(Object.keys(BOARD_PALETTES) as BoardStyle[]).map((key) => {
            const p = BOARD_PALETTES[key];
            return (
              <label
                key={key}
                className={`board-swatch ${prefs.boardStyle === key ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="boardStyle"
                  value={key}
                  checked={prefs.boardStyle === key}
                  onChange={() => setPrefs({ boardStyle: key })}
                />
                <div
                  className="swatch-preview"
                  style={{
                    background: `linear-gradient(
                      to right,
                      ${p.light} 0 25%,
                      ${p.dark} 25% 50%,
                      ${p.light} 50% 75%,
                      ${p.dark} 75% 100%
                    )`,
                  }}
                />
                <div className="swatch-label">{p.label}</div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="settings-section">
        <h2>Arrows</h2>
        <label className="toggle">
          <input
            type="checkbox"
            checked={prefs.showArrows}
            onChange={(e) => setPrefs({ showArrows: e.target.checked })}
          />
          <span>Show arrows for key ideas and alternatives on lesson boards</span>
        </label>
      </section>

      <section className="settings-section">
        <h2>Preview</h2>
        <div style={{ maxWidth: 520 }}>
          <Board fen={DEMO_FEN} arePiecesDraggable={false} />
        </div>
      </section>
    </div>
  );
}
