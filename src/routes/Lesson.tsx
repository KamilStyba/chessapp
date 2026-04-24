import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { findLesson, findOpening } from '../data/registry';
import { AnnotatedMove, Variation } from '../data/types';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';
import { VariationTree } from '../components/VariationTree';
import { EvalBar, MultiPvPanel } from '../components/EvalBar';
import { useKeyboardNavigation } from '../engine/useKeyboardNavigation';
import { buildArrows } from '../engine/sanToArrow';
import { lastMoveFromSans } from '../engine/lastMove';
import { recordLastStudied } from '../data/lastStudied';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getBestMove } from '../engine/stockfish';
import { recordAchievement, addXp } from '../data/achievements';

function resolveLine(
  lesson: ReturnType<typeof findLesson>,
  variationId?: string,
  subVariationId?: string,
): { title: string; summary: string; line: AnnotatedMove[]; eco?: string } | null {
  if (!lesson) return null;
  if (!variationId) {
    return {
      title: lesson.mainLine.name,
      summary: lesson.mainLine.summary,
      line: lesson.mainLine.line,
      eco: lesson.mainLine.eco,
    };
  }
  const v: Variation | undefined = lesson.variations.find((v) => v.id === variationId);
  if (!v) return null;
  if (!subVariationId) {
    return { title: v.name, summary: v.summary, line: v.line, eco: v.eco };
  }
  const sv = v.subVariations?.find((s) => s.id === subVariationId);
  if (!sv) return null;
  return { title: sv.name, summary: sv.summary, line: sv.line, eco: sv.eco };
}

function replay(sans: string[]): { fen: string; last?: { from: string; to: string } } {
  const c = new Chess();
  let last: { from: string; to: string } | undefined;
  for (const s of sans) {
    try {
      const m = c.move(s);
      if (m) last = { from: m.from, to: m.to };
    } catch {
      break;
    }
  }
  return { fen: c.fen(), last };
}

export function Lesson() {
  const { openingId, lessonId, variationId, subVariationId } = useParams();
  const opening = findOpening(openingId ?? '');
  const lesson = findLesson(openingId ?? '', lessonId ?? '');
  const data = resolveLine(lesson, variationId, subVariationId);

  const sanList = useMemo(() => data?.line.map((m) => m.san) ?? [], [data]);
  const [ply, setPly] = useState(0);
  const [forkMoves, setForkMoves] = useState<string[]>([]);
  const [engineOn, setEngineOn] = useState(false);
  const [engineThinking, setEngineThinking] = useState(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [celebratePly, setCelebratePly] = useState<number | null>(null);
  const [interactive, setInteractive] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    setPly(0);
    setForkMoves([]);
    setShowComplete(false);
  }, [openingId, lessonId, variationId, subVariationId]);

  useEffect(() => {
    if (!autoplay) return;
    if (ply >= sanList.length) {
      setAutoplay(false);
      return;
    }
    const t = setTimeout(() => {
      if (!mounted.current) return;
      setPly((p) => {
        const next = Math.min(sanList.length, p + 1);
        if (next === sanList.length) setShowComplete(true);
        return next;
      });
    }, 1400);
    return () => clearTimeout(t);
  }, [autoplay, ply, sanList.length]);

  useEffect(() => {
    if (opening && lesson) {
      recordLastStudied({
        openingId: opening.id,
        openingTitle: opening.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        variationId,
        variationName: data?.title,
      });
    }
  }, [opening?.id, lesson?.id, variationId, data?.title]);

  const offBook = forkMoves.length > 0;
  const allSans = useMemo(
    () => (offBook ? [...sanList.slice(0, ply), ...forkMoves] : sanList.slice(0, ply)),
    [sanList, ply, forkMoves, offBook],
  );
  const replayed = useMemo(() => replay(allSans), [allSans]);
  const fen = replayed.fen;
  const lastMove = replayed.last ?? null;

  if (!opening || !lesson || !data) {
    return (
      <div className="error">
        Lesson not found. <Link to="/">Home</Link>
      </div>
    );
  }

  const goto = (p: number) => {
    setForkMoves([]);
    setPly(Math.max(0, Math.min(p, sanList.length)));
  };

  useKeyboardNavigation({
    onPrev: () => {
      if (offBook) setForkMoves((f) => f.slice(0, -1));
      else setPly((p) => Math.max(0, p - 1));
    },
    onNext: () => !offBook && setPly((p) => Math.min(sanList.length, p + 1)),
    onHome: () => { setForkMoves([]); setPly(0); },
    onEnd: () => { setForkMoves([]); setPly(sanList.length); },
    onFlip: () => setOrientation((o) => (o === 'white' ? 'black' : 'white')),
  });

  const currentAnnotation = !offBook && ply > 0 ? data.line[ply - 1] : null;
  const nextMove = !offBook && ply < data.line.length ? data.line[ply] : null;

  const arrows = useMemo(() => {
    if (!nextMove) return [];
    return buildArrows(fen, nextMove.san, nextMove.alternatives);
  }, [fen, nextMove]);

  const onPieceDrop = (from: string, to: string): boolean => {
    if (!interactive) return false;
    const c = new Chess(fen);
    let m;
    try {
      m = c.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!m) return false;

    if (!offBook && ply < sanList.length && m.san === sanList[ply]) {
      const next = ply + 1;
      setPly(next);
      setCelebratePly(next);
      addXp(5);
      setXpGain(5);
      setTimeout(() => mounted.current && setXpGain(null), 1000);
      setTimeout(() => mounted.current && setCelebratePly(null), 900);
      if (next === sanList.length) {
        recordAchievement('finish-lesson', { lessonId: lesson.id, title: lesson.title });
        addXp(50);
        setShowComplete(true);
      }
      return true;
    }
    recordAchievement('off-book');
    setForkMoves((f) => [...f, m.san]);
    return true;
  };

  const returnToTheory = () => {
    setForkMoves([]);
  };

  const playEngineMove = async () => {
    setEngineThinking(true);
    try {
      const uci = await getBestMove(fen, 1200);
      if (!mounted.current) return;
      const c = new Chess(fen);
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const m = c.move({ from, to, promotion });
      if (m) setForkMoves((f) => [...f, m.san]);
    } catch {
      // ignore
    } finally {
      if (mounted.current) setEngineThinking(false);
    }
  };

  const historySans = allSans;
  const currentPly = historySans.length;

  return (
    <div className="lesson-page">
      <Breadcrumbs
        crumbs={[
          { label: 'Library', to: '/' },
          { label: opening.title, to: `/opening/${opening.id}` },
          { label: lesson.title, to: `/lesson/${opening.id}/${lesson.id}` },
          ...(variationId ? [{ label: data.title }] : []),
        ]}
      />
      <header className="page-hero small">
        <h1>
          {lesson.title}{' — '}
          <em className="accent-italic">{data.title}</em>
        </h1>
        {data.eco && <div className="eco-tag">ECO {data.eco}</div>}
      </header>

      {!variationId && !offBook && ply === 0 && (
        <section className="intro-essay">
          <p>{lesson.intro}</p>
        </section>
      )}

      <div className="lesson-grid-2col">
        <div className="board-col">
          <div className="board-with-eval">
            <Board
              fen={fen}
              arePiecesDraggable={interactive}
              onPieceDrop={interactive ? onPieceDrop : undefined}
              boardOrientation={orientation}
              customArrows={arrows}
              lastMove={lastMove}
            />
            <EvalBar fen={fen} enabled={engineOn} onToggle={() => setEngineOn((v) => !v)} />
            {celebratePly !== null && <div className="celebrate-pop" aria-hidden>✓</div>}
          </div>
          <div className="board-controls">
            <button onClick={() => { setForkMoves([]); setPly(0); }} aria-label="Reset" title="Home">⏮</button>
            <button
              onClick={() => {
                if (offBook) setForkMoves((f) => f.slice(0, -1));
                else setPly((p) => Math.max(0, p - 1));
              }}
              aria-label="Back"
              title="← / k"
            >◀</button>
            <button
              onClick={() => setPly((p) => Math.min(sanList.length, p + 1))}
              aria-label="Next"
              className="primary"
              title="→ / j / space"
              disabled={offBook}
            >▶</button>
            <button onClick={() => { setForkMoves([]); setPly(sanList.length); }} aria-label="End" title="End">⏭</button>
            <button onClick={() => setOrientation((o) => o === 'white' ? 'black' : 'white')} aria-label="Flip" title="f">⇅</button>
            <button
              className={interactive ? 'active' : ''}
              onClick={() => setInteractive((v) => !v)}
              title="Toggle: drag pieces to try moves"
            >
              {interactive ? '🎮 Interactive' : '🔒 Locked'}
            </button>
            <button
              className={autoplay ? 'active' : ''}
              onClick={() => setAutoplay((v) => !v)}
              title="Study mode — auto-play the whole line"
              disabled={offBook || ply >= sanList.length}
            >
              {autoplay ? '⏸ Studying…' : '▶ Study'}
            </button>
          </div>
          {xpGain !== null && <div className="xp-float">+{xpGain} XP</div>}
          <MoveList moves={historySans} currentPly={currentPly} onJump={goto} />
        </div>

        <div className="info-col">
          <MultiPvPanel fen={fen} enabled={engineOn} />

          {offBook ? (
            <section className="annotation-panel off-book">
              <div className="off-book-badge">⚠ Off-book</div>
              <h2>You've left the theory line</h2>
              <p>
                You're <strong>{forkMoves.length}</strong> {forkMoves.length === 1 ? 'move' : 'moves'} into your own exploration from this position.
                The annotated theory resumes the moment you come back.
              </p>
              <div className="action-row" style={{ flexWrap: 'wrap' }}>
                <button className="btn primary" onClick={returnToTheory}>↩ Return to theory</button>
                <button className="btn" onClick={playEngineMove} disabled={engineThinking}>
                  {engineThinking ? 'Engine thinking…' : '🤖 Let engine reply'}
                </button>
                <Link
                  className="btn"
                  to="/explore"
                  state={{ prefillFen: fen }}
                >
                  Open in Explore →
                </Link>
              </div>
              <p className="muted" style={{ fontSize: '0.85rem', marginTop: '0.6rem' }}>
                Tip: "Let engine reply" plays Stockfish's best response so you can see where your idea leads.
              </p>
            </section>
          ) : (
            <section className="annotation-panel">
              <h2>
                {currentAnnotation
                  ? `${Math.ceil(ply / 2)}${ply % 2 === 1 ? '.' : '…'} ${currentAnnotation.san}`
                  : 'Starting position'}
              </h2>
              {!currentAnnotation && <p className="summary">{data.summary}</p>}
              {currentAnnotation && (
                <>
                  <p>{currentAnnotation.comment || '—'}</p>
                  {currentAnnotation.keyIdea && (
                    <div className="key-idea">🔑 {currentAnnotation.keyIdea}</div>
                  )}
                  {currentAnnotation.alternatives && currentAnnotation.alternatives.length > 0 && (
                    <div className="alternatives">
                      <h4>Alternatives</h4>
                      <ul>
                        {currentAnnotation.alternatives.map((a, i) => (
                          <li key={i}>
                            <code>{a.san}</code> — {a.why}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
              {nextMove && (
                <div className="next-hint">
                  {interactive
                    ? <>Try to play the theory move — drag any piece. Hint: <code>{nextMove.san}</code></>
                    : <>Next: <code>{nextMove.san}</code></>}
                </div>
              )}
              {!nextMove && ply > 0 && ply === sanList.length && (
                <div className="lesson-complete">
                  <strong>🏁 Main line complete.</strong>
                  <span className="muted"> Try the quiz, study a variation, or play it out vs Stockfish.</span>
                </div>
              )}
            </section>
          )}

          {!variationId && !offBook && (
            <>
              <section className="themes">
                <h3>Strategic themes</h3>
                <ul>
                  {lesson.themes.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </section>

              <section className="plans">
                <h3>Typical plans</h3>
                <div className="plan-cols">
                  <div>
                    <h4>White</h4>
                    <ul>
                      {lesson.typicalPlans.white.map((p, i) => (<li key={i}>{p}</li>))}
                    </ul>
                  </div>
                  <div>
                    <h4>Black</h4>
                    <ul>
                      {lesson.typicalPlans.black.map((p, i) => (<li key={i}>{p}</li>))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="structures">
                <h3>Pawn structures</h3>
                {lesson.pawnStructures.map((ps, i) => (
                  <div className="structure" key={i}>
                    <h4>{ps.name}</h4>
                    <p>{ps.description}</p>
                  </div>
                ))}
              </section>

              <VariationTree
                openingId={opening.id}
                lessonId={lesson.id}
                variations={lesson.variations}
              />

              {lesson.commonTraps && lesson.commonTraps.length > 0 && (
                <section className="traps">
                  <h3>Common traps</h3>
                  {lesson.commonTraps.map((t, i) => (
                    <div key={i} className="trap">
                      <h4>{t.name}</h4>
                      <div className="trap-moves">{t.line.join(' ')}</div>
                      <p>{t.comment}</p>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}

          <div className="action-row">
            <Link
              className="btn primary"
              to={
                variationId
                  ? `/quiz/${opening.id}/${lesson.id}/${variationId}`
                  : `/quiz/${opening.id}/${lesson.id}`
              }
            >
              Take the quiz →
            </Link>
            <Link
              className="btn"
              to={
                variationId
                  ? `/play/${opening.id}/${lesson.id}/${variationId}`
                  : `/play/${opening.id}/${lesson.id}`
              }
            >
              Play this vs Stockfish →
            </Link>
          </div>
        </div>
      </div>

      {showComplete && (
        <div className="complete-overlay" onClick={() => setShowComplete(false)}>
          <div className="complete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confetti" aria-hidden>
              {Array.from({ length: 30 }).map((_, i) => (
                <span key={i} className="confetti-piece" style={{ ['--i' as any]: i }} />
              ))}
            </div>
            <div className="kicker"><span>Line complete</span></div>
            <h2 className="complete-title">{data.title}</h2>
            <p className="complete-lede">
              You walked the full {sanList.length}-move line. +50 XP banked.
            </p>
            <div className="action-row" style={{ justifyContent: 'center' }}>
              <button className="btn-primary-dark" onClick={() => { setShowComplete(false); setPly(0); }}>
                Replay
              </button>
              <Link
                className="btn"
                to={variationId ? `/quiz/${opening.id}/${lesson.id}/${variationId}` : `/quiz/${opening.id}/${lesson.id}`}
                onClick={() => setShowComplete(false)}
              >
                Quiz this line →
              </Link>
              <Link className="btn" to="/" onClick={() => setShowComplete(false)}>
                Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
