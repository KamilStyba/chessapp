import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';
import { detectOpening } from '../engine/detectOpening';

export function Explore() {
  const [moves, setMoves] = useState<string[]>([]);
  const [ply, setPly] = useState(0);

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
  const detection = useMemo(() => detectOpening(moves.slice(0, ply)), [moves, ply]);

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

  return (
    <div className="explore-page">
      <header className="page-hero small">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Explore Mode</h1>
        <p className="hero-sub">
          Play any moves on the board. The trainer matches them against its database of
          Queen&apos;s Gambit and Sicilian variations and tells you which opening you&apos;re in.
        </p>
      </header>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <Board fen={fen} onPieceDrop={onPieceDrop} arePiecesDraggable />
          <div className="board-controls">
            <button onClick={() => setPly(0)} aria-label="Reset">⏮</button>
            <button onClick={() => setPly(Math.max(0, ply - 1))} aria-label="Back">◀</button>
            <button onClick={() => setPly(Math.min(moves.length, ply + 1))} aria-label="Next">▶</button>
            <button onClick={() => setPly(moves.length)} aria-label="End">⏭</button>
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
                  Play a move on the board (drag a piece). The trainer only knows the
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
        </div>
      </div>
    </div>
  );
}
