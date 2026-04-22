import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { openings, findLesson, findOpening } from '../data/registry';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';
import { EvalBar } from '../components/EvalBar';
import { getBestMove } from '../engine/stockfish';
import { lastMoveFromSans } from '../engine/lastMove';

export function PlayIndex() {
  return (
    <div className="play-index">
      <header className="page-hero">
        <h1>Play vs Stockfish</h1>
        <p className="hero-sub">
          Pick a variation. You&apos;ll play the theory moves (guided by the
          trainer) until the line ends — then Stockfish takes over with the
          same position, and the rest of the game is yours.
        </p>
      </header>

      {openings.map((op) => (
        <section key={op.id} className="play-section">
          <h2>{op.title}</h2>
          <div className="play-grid">
            {op.lessons.map((l) => (
              <div key={l.id} className="play-card">
                <h3>{l.title}</h3>
                <div className="play-links">
                  <Link className="btn" to={`/play/${op.id}/${l.id}`}>Main line →</Link>
                  {l.variations.slice(0, 6).map((v) => (
                    <Link key={v.id} className="btn small" to={`/play/${op.id}/${l.id}/${v.id}`}>
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

type Phase = 'theory' | 'engine' | 'user' | 'game-over';

export function PlayRunner() {
  const { openingId, lessonId, variationId } = useParams();
  const navigate = useNavigate();
  const opening = findOpening(openingId ?? '');
  const lesson = findLesson(openingId ?? '', lessonId ?? '');
  const variation = variationId ? lesson?.variations.find((v) => v.id === variationId) : null;
  const lineData = variation ?? lesson?.mainLine;

  const theorySans = useMemo(
    () => (lineData?.line.map((m) => m.san) ?? []),
    [lineData],
  );

  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('theory');
  const [userSide, setUserSide] = useState<'white' | 'black'>('white');
  const [theoryIdx, setTheoryIdx] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [engineStrength, setEngineStrength] = useState(1500);
  const [showEval, setShowEval] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const reset = () => {
    chess.reset();
    setFen(chess.fen());
    setHistory([]);
    setPhase('theory');
    setTheoryIdx(0);
    setEngineError(null);
  };

  useEffect(() => {
    reset();
  }, [openingId, lessonId, variationId, userSide]);

  const advanceTheory = () => {
    if (theoryIdx >= theorySans.length) return;
    const san = theorySans[theoryIdx];
    try {
      chess.move(san);
    } catch {
      setPhase('user');
      return;
    }
    setFen(chess.fen());
    setHistory([...history, san]);
    const newIdx = theoryIdx + 1;
    setTheoryIdx(newIdx);
    if (newIdx >= theorySans.length) {
      setPhase(chess.turn() === (userSide === 'white' ? 'w' : 'b') ? 'user' : 'engine');
    }
  };

  useEffect(() => {
    if (phase !== 'theory') return;
    const sideToMove: 'white' | 'black' = chess.turn() === 'w' ? 'white' : 'black';
    if (sideToMove !== userSide && theoryIdx < theorySans.length) {
      const t = setTimeout(advanceTheory, 500);
      return () => clearTimeout(t);
    }
  }, [phase, theoryIdx, userSide, fen]);

  useEffect(() => {
    if (phase !== 'engine') return;
    if (chess.isGameOver()) {
      setPhase('game-over');
      return;
    }
    setThinking(true);
    setEngineError(null);
    const thinkTime = Math.max(100, Math.min(2000, Math.round((engineStrength - 500) * 2)));
    getBestMove(chess.fen(), thinkTime)
      .then((uci) => {
        if (!mounted.current) return;
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci.length > 4 ? uci[4] : undefined;
        try {
          const m = chess.move({ from, to, promotion });
          if (!m) throw new Error(`bad move ${uci}`);
          setFen(chess.fen());
          setHistory((h) => [...h, m.san]);
          if (chess.isGameOver()) setPhase('game-over');
          else setPhase('user');
        } catch (e: any) {
          setEngineError(`Engine returned illegal move: ${uci}`);
          setPhase('user');
        }
      })
      .catch((e) => {
        if (!mounted.current) return;
        setEngineError(e.message || 'Engine error');
        setPhase('user');
      })
      .finally(() => mounted.current && setThinking(false));
  }, [phase, engineStrength]);

  const onPieceDrop = (from: string, to: string): boolean => {
    if (chess.isGameOver()) return false;
    const sideToMove: 'white' | 'black' = chess.turn() === 'w' ? 'white' : 'black';
    if (sideToMove !== userSide) return false;
    let m;
    try { m = chess.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;

    setFen(chess.fen());
    setHistory((h) => [...h, m.san]);

    if (chess.isGameOver()) {
      setPhase('game-over');
      return true;
    }

    if (phase === 'theory' && theoryIdx < theorySans.length) {
      const expected = theorySans[theoryIdx];
      if (m.san === expected) {
        const newIdx = theoryIdx + 1;
        setTheoryIdx(newIdx);
        if (newIdx >= theorySans.length) {
          setPhase('engine');
        } else {
          // opponent's theory reply next
          setPhase('theory');
        }
      } else {
        // user deviated: jump straight to engine play
        setTheoryIdx(theorySans.length);
        setPhase('engine');
      }
    } else {
      setPhase('engine');
    }
    return true;
  };

  if (!opening || !lesson || !lineData) {
    return (
      <div className="error">
        Lesson not found. <Link to="/play">Play index</Link>
      </div>
    );
  }

  const gameResult = (() => {
    if (!chess.isGameOver()) return '';
    if (chess.isCheckmate()) return chess.turn() === 'w' ? '0–1' : '1–0';
    return '½–½';
  })();

  const nextTheoryMove =
    phase === 'theory' && theoryIdx < theorySans.length ? theorySans[theoryIdx] : null;

  const sideToMove: 'white' | 'black' = chess.turn() === 'w' ? 'white' : 'black';
  const userTurn = sideToMove === userSide && !chess.isGameOver();

  return (
    <div className="play-page">
      <header className="page-hero small">
        <Link to="/play" className="back-link">← Play index</Link>
        <h1>
          {lesson.title} — <span className="variation-tag">{lineData.name}</span>
        </h1>
        <div className="eco-tag">
          You play as {userSide} · phase: {phase}
        </div>
      </header>

      <section className="play-toolbar">
        <label>
          Side:{' '}
          <select value={userSide} onChange={(e) => setUserSide(e.target.value as 'white' | 'black')}>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </label>
        <label>
          Strength:{' '}
          <select
            value={engineStrength}
            onChange={(e) => setEngineStrength(Number(e.target.value))}
          >
            <option value={800}>Beginner</option>
            <option value={1200}>Casual</option>
            <option value={1500}>Club</option>
            <option value={1800}>Expert</option>
            <option value={2200}>Master</option>
          </select>
        </label>
        <button className="btn" onClick={reset}>Restart</button>
        <button className="btn" onClick={() => navigate(`/lesson/${opening.id}/${lesson.id}`)}>
          Open lesson
        </button>
      </section>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <div className="board-with-eval">
            <Board
              fen={fen}
              boardOrientation={userSide}
              arePiecesDraggable={userTurn && phase !== 'engine'}
              onPieceDrop={onPieceDrop}
              lastMove={lastMoveFromSans(history, history.length)}
            />
            <EvalBar fen={fen} enabled={showEval} onToggle={() => setShowEval((v) => !v)} />
          </div>
          <MoveList moves={history} currentPly={history.length} onJump={() => {}} />
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            {phase === 'theory' && nextTheoryMove && (
              <>
                <h2>Theory phase</h2>
                <p>
                  Play the book move:{' '}
                  {userTurn ? <code>{nextTheoryMove}</code> : <em>opponent replies…</em>}
                </p>
                <p className="muted">
                  Play something else and the engine will take over early.
                </p>
              </>
            )}
            {phase === 'engine' && (
              <>
                <h2>Engine is thinking…</h2>
                {thinking && <p className="muted">Stockfish is calculating its move.</p>}
              </>
            )}
            {phase === 'user' && !chess.isGameOver() && (
              <>
                <h2>Your move</h2>
                <p>Theory line exhausted — you&apos;re out of book. Good luck!</p>
              </>
            )}
            {phase === 'game-over' && (
              <>
                <h2>Game over — {gameResult}</h2>
                <p>
                  {chess.isCheckmate() && 'Checkmate.'}
                  {chess.isStalemate() && 'Stalemate.'}
                  {chess.isDraw() && !chess.isStalemate() && 'Draw.'}
                </p>
                <button className="btn primary" onClick={reset}>Play again</button>
              </>
            )}
            {engineError && (
              <p className="eval-error">{engineError}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
