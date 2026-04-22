import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { findPuzzle, puzzles, findOpening } from '../data/registry';
import { Board } from '../components/Board';

export function PuzzlesIndex() {
  const byOpening = useMemo(() => {
    return {
      'queens-gambit': puzzles.filter((p) => p.opening === 'queens-gambit'),
      sicilian: puzzles.filter((p) => p.opening === 'sicilian'),
    };
  }, []);

  return (
    <div className="puzzles-index">
      <header className="page-hero">
        <h1>Tactical puzzles</h1>
        <p className="hero-sub">
          Real positions from the opening lessons. Each puzzle tests one of the
          signature motifs of that variation — find the key move and see the
          grandmaster explanation.
        </p>
      </header>

      {(['queens-gambit', 'sicilian'] as const).map((oid) => {
        const op = findOpening(oid);
        const list = byOpening[oid];
        if (!op || list.length === 0) return null;
        return (
          <section key={oid} className="puzzle-section">
            <h2>{op.title}</h2>
            <div className="puzzle-grid">
              {list.map((p) => (
                <Link key={p.id} to={`/puzzle/${p.id}`} className="puzzle-card">
                  <div className="puzzle-difficulty">
                    {'★'.repeat(p.difficulty)}
                    <span className="muted">{'★'.repeat(3 - p.difficulty)}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <div className="puzzle-theme">{p.theme}</div>
                  <p>{p.description}</p>
                </Link>
              ))}
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
  };

  const opening = findOpening(puzzle.opening);

  return (
    <div className="puzzle-page">
      <header className="page-hero small">
        <Link to="/puzzles" className="back-link">
          ← All puzzles
        </Link>
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
          />
          <div className="board-controls">
            <button className="btn" onClick={reset}>
              Restart puzzle
            </button>
          </div>
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            {status === 'solving' && (
              <>
                <h2>Your move</h2>
                <p>Find the key move for {userSide}.</p>
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
                <p>
                  Solution:{' '}
                  <code>{puzzle.solution.join(' ')}</code>
                </p>
                <p>{puzzle.explanation}</p>
                {puzzle.lessonId && (
                  <div className="action-row">
                    <Link
                      className="btn primary"
                      to={`/lesson/${puzzle.opening}/${puzzle.lessonId}`}
                    >
                      Full lesson →
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
