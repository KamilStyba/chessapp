import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { findPuzzle, puzzles, findOpening } from '../data/registry';
import { Board } from '../components/Board';
import { loadSolved, markSolved, clearSolved } from '../data/puzzleProgress';
import { recordAchievement } from '../data/achievements';
import { sanToSquares } from '../engine/sanToArrow';
import { lastMoveFromSans } from '../engine/lastMove';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function PuzzlesIndex() {
  const navigate = useNavigate();
  const [solved, setSolved] = useState<Set<string>>(() => loadSolved());

  const byOpening = useMemo(() => {
    return {
      'queens-gambit': puzzles.filter((p) => p.opening === 'queens-gambit'),
      sicilian: puzzles.filter((p) => p.opening === 'sicilian'),
    };
  }, []);

  const totalSolved = solved.size;
  const total = puzzles.length;
  const pct = total > 0 ? Math.round((totalSolved / total) * 100) : 0;

  const randomUnsolved = () => {
    const unsolved = puzzles.filter((p) => !solved.has(p.id));
    if (unsolved.length === 0) {
      const p = puzzles[Math.floor(Math.random() * puzzles.length)];
      navigate(`/puzzle/${p.id}`);
      return;
    }
    const p = unsolved[Math.floor(Math.random() * unsolved.length)];
    navigate(`/puzzle/${p.id}`);
  };

  const reset = () => {
    if (confirm('Clear all puzzle progress?')) {
      clearSolved();
      setSolved(new Set());
    }
  };

  return (
    <div className="puzzles-index">
      <Breadcrumbs
        crumbs={[
          { label: 'Library', to: '/' },
          { label: 'Tactical puzzles' },
        ]}
      />
      <header className="page-hero">
        <h1>Tactical puzzles</h1>
        <p className="hero-sub">
          Real positions from the opening lessons. Each puzzle tests one of the
          signature motifs of that variation — find the key move and see the
          grandmaster explanation.
        </p>
        <div className="puzzle-progress-bar">
          <div className="progress-row">
            <strong>{totalSolved}</strong> / {total} solved ({pct}%)
            <div className="progress-rail" aria-hidden>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <button className="btn" onClick={randomUnsolved}>🎲 Random unsolved</button>
            <button className="btn" onClick={reset}>Reset</button>
          </div>
        </div>
      </header>

      {(['queens-gambit', 'sicilian'] as const).map((oid) => {
        const op = findOpening(oid);
        const list = byOpening[oid];
        if (!op || list.length === 0) return null;
        return (
          <section key={oid} className="puzzle-section">
            <h2>{op.title}</h2>
            <div className="puzzle-grid">
              {list.map((p) => {
                const done = solved.has(p.id);
                return (
                  <Link
                    key={p.id}
                    to={`/puzzle/${p.id}`}
                    className={`puzzle-card ${done ? 'solved' : ''}`}
                  >
                    <div className="puzzle-card-head">
                      <span className="puzzle-difficulty">
                        {'★'.repeat(p.difficulty)}
                        <span className="muted">{'★'.repeat(3 - p.difficulty)}</span>
                      </span>
                      {done && <span className="badge-solved">✓ solved</span>}
                    </div>
                    <h3>{p.title}</h3>
                    <div className="puzzle-theme">{p.theme}</div>
                    <p>{p.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

type Status = 'solving' | 'wrong' | 'solved' | 'opponent';

function chessFromPgn(pgn: string): Chess {
  const c = new Chess();
  c.loadPgn(pgn);
  return c;
}

export function PuzzleRunner() {
  const { puzzleId } = useParams();
  const puzzle = findPuzzle(puzzleId ?? '');
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [status, setStatus] = useState<Status>('solving');
  const [wrongTry, setWrongTry] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);

  const baseChess = useMemo(() => {
    if (!puzzle) return new Chess();
    return chessFromPgn(puzzle.pgnPrefix);
  }, [puzzle]);

  const liveChess = useMemo(() => {
    const c = chessFromPgn(puzzle?.pgnPrefix ?? '');
    if (!puzzle) return c;
    for (let i = 0; i < solutionIndex; i++) {
      try {
        c.move(puzzle.solution[i]);
      } catch {
        break;
      }
    }
    return c;
  }, [puzzle, solutionIndex]);

  const fen = liveChess.fen();

  const userSide: 'white' | 'black' = useMemo(() => {
    return baseChess.turn() === 'w' ? 'white' : 'black';
  }, [baseChess]);

  useEffect(() => {
    setSolutionIndex(0);
    setStatus('solving');
    setWrongTry(null);
    setHintLevel(0);
  }, [puzzleId]);

  if (!puzzle) {
    return (
      <div className="error">
        Puzzle not found. <Link to="/puzzles">Puzzles</Link>
      </div>
    );
  }

  const isUserTurn =
    status === 'solving' &&
    solutionIndex < puzzle.solution.length &&
    (liveChess.turn() === 'w' ? 'white' : 'black') === userSide;

  const onPieceDrop = (from: string, to: string): boolean => {
    if (!isUserTurn) return false;
    const test = new Chess(fen);
    let m;
    try {
      m = test.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!m) return false;

    const expected = puzzle.solution[solutionIndex];
    if (m.san === expected) {
      const nextIndex = solutionIndex + 1;
      setWrongTry(null);
      if (nextIndex >= puzzle.solution.length) {
        setSolutionIndex(nextIndex);
        setStatus('solved');
        if (hintLevel === 0) {
          markSolved(puzzle.id);
          const solved = loadSolved();
          recordAchievement('solve-puzzle', {
            totalSolved: solved.size,
            totalPuzzles: puzzles.length,
          });
        }
      } else {
        setSolutionIndex(nextIndex);
        setStatus('opponent');
        setTimeout(() => {
          setSolutionIndex((i) => i + 1);
          setStatus('solving');
        }, 500);
      }
      return true;
    }
    setWrongTry(m.san);
    setStatus('wrong');
    return false;
  };

  const reset = () => {
    setSolutionIndex(0);
    setStatus('solving');
    setWrongTry(null);
    setHintLevel(0);
  };

  const opening = findOpening(puzzle.opening);

  const nextSolutionMove =
    status === 'solving' && solutionIndex < puzzle.solution.length
      ? puzzle.solution[solutionIndex]
      : null;

  const hintSquares = useMemo(() => {
    if (hintLevel === 0 || !nextSolutionMove) return undefined;
    const sq = sanToSquares(fen, nextSolutionMove);
    if (!sq) return undefined;
    const out: Record<string, React.CSSProperties> = {};
    if (hintLevel >= 1) {
      out[sq[0]] = { background: 'radial-gradient(circle, rgba(242,179,61,0.55) 36%, transparent 40%)' };
    }
    if (hintLevel >= 2) {
      out[sq[1]] = { background: 'radial-gradient(circle, rgba(242,179,61,0.55) 36%, transparent 40%)' };
    }
    return out;
  }, [fen, hintLevel, nextSolutionMove]);

  const giveHint = () => {
    setHintLevel((l) => Math.min(2, l + 1));
  };

  return (
    <div className="puzzle-page">
      <Breadcrumbs
        crumbs={[
          { label: 'Library', to: '/' },
          { label: 'Tactical puzzles', to: '/puzzles' },
          { label: puzzle.title },
        ]}
      />
      <header className="page-hero small">
        <h1>
          {puzzle.title}{' '}
          <span className="variation-tag">
            {'★'.repeat(puzzle.difficulty)}
          </span>
        </h1>
        <div className="eco-tag">
          {opening?.title} — {puzzle.theme}
        </div>
      </header>

      <section className="intro-essay">
        <p>{puzzle.description}</p>
        <p className="muted">
          <strong>{userSide === 'white' ? 'White' : 'Black'} to move.</strong>{' '}
          Drag the piece to play your move.
        </p>
      </section>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <Board
            fen={fen}
            boardOrientation={userSide}
            arePiecesDraggable={isUserTurn}
            onPieceDrop={onPieceDrop}
            customSquareStyles={hintSquares}
            lastMove={(() => {
              if (solutionIndex === 0) return null;
              const hist = liveChess.history({ verbose: true }) as any[];
              const m = hist[hist.length - 1];
              return m ? { from: m.from, to: m.to } : null;
            })()}
          />
          <div className="board-controls">
            <button className="btn" onClick={reset}>Restart puzzle</button>
            <button
              className="btn"
              onClick={giveHint}
              disabled={hintLevel >= 2 || status !== 'solving'}
              title="Solving unaided increases your streak — use hints sparingly"
            >
              {hintLevel === 0 && '💡 Hint (from-square)'}
              {hintLevel === 1 && '💡 More hint (to-square)'}
              {hintLevel === 2 && '💡 No more hints'}
            </button>
          </div>
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            {status === 'solving' && (
              <>
                <h2>Your move</h2>
                <p>Find the key move for {userSide}.</p>
                {hintLevel > 0 && (
                  <p className="muted">
                    Hints shown on the board (solving with hints won't mark this puzzle solved).
                  </p>
                )}
              </>
            )}
            {status === 'opponent' && (
              <>
                <h2>Opponent replies…</h2>
              </>
            )}
            {status === 'wrong' && wrongTry && (
              <>
                <h2>❌ Not quite</h2>
                <p>
                  You played <code>{wrongTry}</code>. Think about the theme:{' '}
                  <em>{puzzle.theme}</em>.
                </p>
                <button className="btn primary" onClick={() => setStatus('solving')}>
                  Try again
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setStatus('solved');
                    setSolutionIndex(puzzle.solution.length);
                  }}
                >
                  Show solution
                </button>
              </>
            )}
            {status === 'solved' && (
              <>
                <h2>✅ Solved!</h2>
                {hintLevel > 0 && (
                  <p className="muted">
                    Solved with hints — not marked as completed. Retry unaided to tick it off!
                  </p>
                )}
                <p>
                  Solution:{' '}
                  <code>{puzzle.solution.join(' ')}</code>
                </p>
                <p>{puzzle.explanation}</p>
                <div className="action-row">
                  <Link className="btn primary" to="/puzzles">More puzzles →</Link>
                  {puzzle.lessonId && (
                    <Link
                      className="btn"
                      to={`/lesson/${puzzle.opening}/${puzzle.lessonId}`}
                    >
                      Full lesson
                    </Link>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
