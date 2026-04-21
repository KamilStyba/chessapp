import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { findLesson, findOpening } from '../data/registry';
import { AnnotatedMove, Variation } from '../data/types';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';
import { VariationTree } from '../components/VariationTree';
import { EvalBar } from '../components/EvalBar';

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

function fenAtPly(sanList: string[], ply: number): string {
  const chess = new Chess();
  for (let i = 0; i < ply && i < sanList.length; i++) {
    try {
      chess.move(sanList[i]);
    } catch {
      break;
    }
  }
  return chess.fen();
}

export function Lesson() {
  const { openingId, lessonId, variationId, subVariationId } = useParams();
  const opening = findOpening(openingId ?? '');
  const lesson = findLesson(openingId ?? '', lessonId ?? '');
  const data = resolveLine(lesson, variationId, subVariationId);

  const sanList = useMemo(() => data?.line.map((m) => m.san) ?? [], [data]);
  const [ply, setPly] = useState(0);
  const [engineOn, setEngineOn] = useState(false);

  useEffect(() => {
    setPly(0);
  }, [openingId, lessonId, variationId, subVariationId]);

  const fen = useMemo(() => fenAtPly(sanList, ply), [sanList, ply]);

  if (!opening || !lesson || !data) {
    return (
      <div className="error">
        Lesson not found. <Link to="/">Home</Link>
      </div>
    );
  }

  const goto = (p: number) =>
    setPly(Math.max(0, Math.min(p, sanList.length)));

  const currentAnnotation = ply > 0 ? data.line[ply - 1] : null;
  const nextMove = ply < data.line.length ? data.line[ply] : null;

  return (
    <div className="lesson-page">
      <header className="page-hero small">
        <Link to={`/opening/${opening.id}`} className="back-link">
          ← {opening.title}
        </Link>
        <h1>
          {lesson.title}
          {' — '}
          <span className="variation-tag">{data.title}</span>
        </h1>
        {data.eco && <div className="eco-tag">ECO {data.eco}</div>}
      </header>

      {!variationId && (
        <section className="intro-essay">
          <p>{lesson.intro}</p>
        </section>
      )}

      <div className="lesson-grid-2col">
        <div className="board-col">
          <div className="board-with-eval">
            <Board fen={fen} arePiecesDraggable={false} />
            <EvalBar fen={fen} enabled={engineOn} onToggle={() => setEngineOn((v) => !v)} />
          </div>
          <div className="board-controls">
            <button onClick={() => goto(0)} aria-label="Reset">⏮</button>
            <button onClick={() => goto(ply - 1)} aria-label="Back">◀</button>
            <button onClick={() => goto(ply + 1)} aria-label="Next" className="primary">▶</button>
            <button onClick={() => goto(sanList.length)} aria-label="End">⏭</button>
          </div>
          <MoveList moves={sanList} currentPly={ply} onJump={goto} />
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            <h2>
              {currentAnnotation
                ? `Move ${Math.ceil(ply / 2)}${ply % 2 === 1 ? '.' : '...'} ${currentAnnotation.san}`
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
                Next: <code>{nextMove.san}</code>
              </div>
            )}
          </section>

          {!variationId && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
