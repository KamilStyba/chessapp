import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';
import { EvalBar } from '../components/EvalBar';
import { detectOpening, nextBookMoves } from '../engine/detectOpening';
import { sanToSquares } from '../engine/sanToArrow';

function sansFromPgn(pgn: string): string[] {
  try {
    const c = new Chess();
    c.loadPgn(pgn);
    return c.history();
  } catch {
    return [];
  }
}

export function Explore() {
  const [moves, setMoves] = useState<string[]>([]);
  const [ply, setPly] = useState(0);
  const [engineOn, setEngineOn] = useState(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [pasteValue, setPasteValue] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const chess = useMemo(() => {
    const c = new Chess();
    for (let i = 0; i < ply; i++) {
      try {
        c.move(moves[i]);
      } catch {
        break;
      }
    }
    return c;
  }, [moves, ply]);

  const fen = chess.fen();
  const played = moves.slice(0, ply);
  const detection = useMemo(() => detectOpening(played), [moves, ply]);
  const suggestions = useMemo(() => nextBookMoves(played), [moves, ply]);

  const onPieceDrop = (from: string, to: string): boolean => {
    const c = new Chess(fen);
    let m;
    try {
      m = c.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!m) return false;
    const truncated = moves.slice(0, ply);
    const newMoves = [...truncated, m.san];
    setMoves(newMoves);
    setPly(newMoves.length);
    return true;
  };

  const reset = () => {
    setMoves([]);
    setPly(0);
  };

  const loadPgn = () => {
    const v = pasteValue.trim();
    if (!v) {
      setPasteError('Paste a PGN move list (e.g. "1. e4 c5 2. Nf3 d6") first.');
      return;
    }
    const sans = sansFromPgn(v);
    if (sans.length === 0) {
      setPasteError('Could not parse — expected a PGN move list.');
      return;
    }
    setMoves(sans);
    setPly(sans.length);
    setPasteError(null);
    setPasteValue('');
  };

  const arrows = useMemo(() => {
    return suggestions
      .slice(0, 3)
      .map((s) => {
        const sq = sanToSquares(fen, s.san);
        if (!sq) return null;
        return [sq[0], sq[1], '#7aa9ff'] as [string, string, string];
      })
      .filter((x): x is [string, string, string] => !!x);
  }, [fen, suggestions]);

  return (
    <div className="explore-page">
      <header className="page-hero small">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Explore Mode</h1>
        <p className="hero-sub">
          Play any moves on the board. The trainer matches them against every
          variation and tells you which opening you&apos;re in — plus the next
          book moves from here.
        </p>
      </header>

      <section className="explore-paste">
        <label htmlFor="pgn-input">Paste PGN or move list:</label>
        <div className="paste-row">
          <input
            id="pgn-input"
            type="text"
            placeholder='e.g. 1. e4 c5 2. Nf3 d6 3. d4 cxd4'
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') loadPgn(); }}
          />
          <button className="btn primary" onClick={loadPgn}>Load</button>
        </div>
        {pasteError && <div className="eval-error">{pasteError}</div>}
      </section>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <div className="board-with-eval">
            <Board
              fen={fen}
              onPieceDrop={onPieceDrop}
              arePiecesDraggable
              boardOrientation={orientation}
              customArrows={arrows}
            />
            <EvalBar fen={fen} enabled={engineOn} onToggle={() => setEngineOn((v) => !v)} />
          </div>
          <div className="board-controls">
            <button onClick={() => setPly(0)} aria-label="Reset">⏮</button>
            <button onClick={() => setPly(Math.max(0, ply - 1))} aria-label="Back">◀</button>
            <button onClick={() => setPly(Math.min(moves.length, ply + 1))} aria-label="Next">▶</button>
            <button onClick={() => setPly(moves.length)} aria-label="End">⏭</button>
            <button onClick={() => setOrientation((o) => o === 'white' ? 'black' : 'white')} aria-label="Flip">⇅</button>
            <button className="btn" onClick={reset}>Clear</button>
          </div>
          <MoveList moves={moves.slice(0, ply)} currentPly={ply} onJump={setPly} />
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            {!detection && (
              <>
                <h2>No opening detected yet</h2>
                <p>
                  Play a move (or paste a PGN above). The trainer covers the
                  Queen&apos;s Gambit and the Sicilian Defense — start with 1.d4 or 1.e4 c5.
                </p>
              </>
            )}
            {detection && (
              <>
                <h2>
                  You&apos;re in: {detection.openingTitle}
                  {detection.variation && ` — ${detection.variation.name}`}
                  {detection.subVariation && ` → ${detection.subVariation.name}`}
                </h2>
                <p>
                  Matched <strong>{detection.matchedPlies}</strong> half-moves of theory
                  from <strong>{detection.lesson.title}</strong>.
                </p>
                <div className="action-row">
                  <Link className="btn primary" to={`/lesson/${detection.openingId}/${detection.lesson.id}${detection.variation ? `/${detection.variation.id}` : ''}${detection.subVariation ? `/${detection.subVariation.id}` : ''}`}>
                    Open this lesson →
                  </Link>
                </div>
              </>
            )}
          </section>

          {suggestions.length > 0 && (
            <section className="annotation-panel">
              <h3>Book moves from here</h3>
              <ul className="suggest-list">
                {suggestions.slice(0, 8).map((s, i) => (
                  <li key={i}>
                    <code>{s.san}</code> —{' '}
                    <Link to={`/lesson/${s.openingId}/${s.lessonId}`}>
                      {s.lessonTitle}
                    </Link>
                    {s.variationName && <span className="muted"> · {s.variationName}</span>}
                  </li>
                ))}
              </ul>
              <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>
                Blue arrows on the board show the first few candidate moves.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
