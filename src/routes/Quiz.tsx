import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { findLesson, findOpening } from '../data/registry';
import { AnnotatedMove, Variation } from '../data/types';
import { Board } from '../components/Board';
import { lastMoveFromSans } from '../engine/lastMove';

function resolveLine(
  lesson: ReturnType<typeof findLesson>,
  variationId?: string,
): { title: string; line: AnnotatedMove[] } | null {
  if (!lesson) return null;
  if (!variationId) return { title: lesson.mainLine.name, line: lesson.mainLine.line };
  const v: Variation | undefined = lesson.variations.find((v) => v.id === variationId);
  if (!v) return null;
  return { title: v.name, line: v.line };
}

type Status = 'idle' | 'your-turn' | 'opponent-thinking' | 'correct' | 'wrong' | 'done';

export function Quiz() {
  const { openingId, lessonId, variationId } = useParams();
  const opening = findOpening(openingId ?? '');
  const lesson = findLesson(openingId ?? '', lessonId ?? '');
  const data = resolveLine(lesson, variationId);

  const sanList = useMemo(() => data?.line.map((m) => m.san) ?? [], [data]);
  const [quizSide, setQuizSide] = useState<'white' | 'black'>('black');
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [wrongTry, setWrongTry] = useState<string | null>(null);

  const chess = useMemo(() => {
    const c = new Chess();
    for (let i = 0; i < ply && i < sanList.length; i++) {
      try {
        c.move(sanList[i]);
      } catch {
        break;
      }
    }
    return c;
  }, [sanList, ply]);

  const fen = chess.fen();

  const isUserTurn = useMemo(() => {
    if (ply >= sanList.length) return false;
    const sideToMove = ply % 2 === 0 ? 'white' : 'black';
    return sideToMove === quizSide;
  }, [ply, sanList.length, quizSide]);

  useEffect(() => {
    setPly(0);
    setStatus('idle');
    setWrongTry(null);
  }, [openingId, lessonId, variationId, quizSide]);

  useEffect(() => {
    if (ply >= sanList.length) {
      setStatus('done');
      return;
    }
    if (isUserTurn) {
      setStatus('your-turn');
    } else {
      setStatus('opponent-thinking');
      const t = setTimeout(() => {
        setPly((p) => p + 1);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [ply, isUserTurn, sanList.length]);

  const onPieceDrop = (from: string, to: string): boolean => {
    if (!isUserTurn || status === 'done' || !data) return false;

    const testChess = new Chess(fen);
    let move;
    try {
      move = testChess.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!move) return false;

    const expected = sanList[ply];
    if (move.san === expected) {
      setStatus('correct');
      setWrongTry(null);
      setTimeout(() => {
        setPly((p) => p + 1);
      }, 400);
      return true;
    }
    setWrongTry(move.san);
    setStatus('wrong');
    return false;
  };

  if (!opening || !lesson || !data) {
    return (
      <div className="error">
        Quiz not found. <Link to="/">Home</Link>
      </div>
    );
  }

  const expectedMove = ply < sanList.length ? data.line[ply] : null;

  return (
    <div className="quiz-page">
      <header className="page-hero small">
        <Link to={`/lesson/${opening.id}/${lesson.id}${variationId ? `/${variationId}` : ''}`} className="back-link">
          ← Lesson
        </Link>
        <h1>
          Quiz — {lesson.title}
          {' — '}
          <span className="variation-tag">{data.title}</span>
        </h1>
      </header>

      <div className="quiz-controls">
        <label>
          Play as:{' '}
          <select value={quizSide} onChange={(e) => setQuizSide(e.target.value as 'white' | 'black')}>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </label>
        <button
          className="btn"
          onClick={() => {
            setPly(0);
            setStatus('idle');
            setWrongTry(null);
          }}
        >
          Restart
        </button>
      </div>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <Board
            fen={fen}
            boardOrientation={quizSide}
            arePiecesDraggable={isUserTurn && status !== 'done'}
            onPieceDrop={onPieceDrop}
            lastMove={lastMoveFromSans(sanList, ply)}
          />
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            {status === 'done' && (
              <>
                <h2>🏁 Quiz complete!</h2>
                <p>You&apos;ve walked the full line. Try another variation or go back to the lesson.</p>
              </>
            )}
            {status === 'your-turn' && expectedMove && (
              <>
                <h2>Your move ({quizSide === 'white' ? 'White' : 'Black'})</h2>
                <p>
                  Find the theory move. {ply === 0
                    ? 'This is the opening move.'
                    : `The previous move was ${data.line[ply - 1].san}.`}
                </p>
              </>
            )}
            {status === 'wrong' && wrongTry && expectedMove && (
              <>
                <h2>❌ Not the book move</h2>
                <p>
                  You played <code>{wrongTry}</code>. The theory move is{' '}
                  <code>{expectedMove.san}</code>.
                </p>
                <p>{expectedMove.comment}</p>
                <button
                  className="btn primary"
                  onClick={() => {
                    setStatus('your-turn');
                    setWrongTry(null);
                  }}
                >
                  Try again
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setStatus('idle');
                    setWrongTry(null);
                    setPly(ply + 1);
                  }}
                >
                  Skip ahead
                </button>
              </>
            )}
            {status === 'correct' && expectedMove && (
              <>
                <h2>✅ Correct!</h2>
                <p>
                  <code>{expectedMove.san}</code> — {expectedMove.comment}
                </p>
              </>
            )}
            {status === 'opponent-thinking' && (
              <>
                <h2>Opponent is thinking…</h2>
              </>
            )}
            {status === 'idle' && (
              <>
                <h2>Loading…</h2>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
