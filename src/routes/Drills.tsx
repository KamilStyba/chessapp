import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { openings } from '../data/registry';
import { Board } from '../components/Board';
import { AnnotatedMove } from '../data/types';
import { lastMoveFromSans } from '../engine/lastMove';
import { recordAchievement } from '../data/achievements';

interface DrillCard {
  openingId: string;
  lessonId: string;
  lessonTitle: string;
  variationName: string;
  ply: number;
  sanList: string[];
  target: AnnotatedMove;
}

function collectCards(): DrillCard[] {
  const out: DrillCard[] = [];
  for (const op of openings) {
    for (const lesson of op.lessons) {
      const lines: { name: string; line: AnnotatedMove[] }[] = [
        { name: lesson.mainLine.name, line: lesson.mainLine.line },
      ];
      for (const v of lesson.variations) {
        lines.push({ name: v.name, line: v.line });
      }
      for (const entry of lines) {
        const sans = entry.line.map((m) => m.san);
        for (let ply = 0; ply < entry.line.length; ply++) {
          if (entry.line[ply].keyIdea || ply < 8) {
            out.push({
              openingId: op.id,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              variationName: entry.name,
              ply,
              sanList: sans,
              target: entry.line[ply],
            });
          }
        }
      }
    }
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fenAt(sans: string[], ply: number): string {
  const c = new Chess();
  for (let i = 0; i < ply && i < sans.length; i++) {
    try { c.move(sans[i]); } catch { break; }
  }
  return c.fen();
}

const SESSION_KEY = 'chess-trainer-drills-session-v1';

interface SessionStats {
  correct: number;
  wrong: number;
  streak: number;
  best: number;
}

function loadStats(): SessionStats {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { correct: 0, wrong: 0, streak: 0, best: 0 };
}

function saveStats(s: SessionStats) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}

type Scope = 'all' | 'queens-gambit' | 'sicilian';

export function Drills() {
  const [scope, setScope] = useState<Scope>('all');
  const allCards = useMemo(() => collectCards(), []);
  const pool = useMemo(
    () => (scope === 'all' ? allCards : allCards.filter((c) => c.openingId === scope)),
    [allCards, scope],
  );
  const [deck, setDeck] = useState<DrillCard[]>(() => shuffle(pool));
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<'ask' | 'right' | 'wrong' | 'revealed'>('ask');
  const [wrongSan, setWrongSan] = useState<string | null>(null);
  const [stats, setStats] = useState<SessionStats>(() => loadStats());

  useEffect(() => {
    setDeck(shuffle(pool));
    setIdx(0);
    setStatus('ask');
    setWrongSan(null);
  }, [scope, pool]);

  const card = deck[idx];
  const fen = useMemo(() => (card ? fenAt(card.sanList, card.ply) : ''), [card]);

  const sideToMove: 'white' | 'black' =
    card && card.ply % 2 === 0 ? 'white' : 'black';

  const onPieceDrop = (from: string, to: string): boolean => {
    if (!card || status !== 'ask') return false;
    const test = new Chess(fen);
    let m;
    try { m = test.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;

    if (m.san === card.target.san) {
      setStatus('right');
      setStats((s) => {
        const next = {
          correct: s.correct + 1,
          wrong: s.wrong,
          streak: s.streak + 1,
          best: Math.max(s.best, s.streak + 1),
        };
        saveStats(next);
        recordAchievement('streak', { streak: next.streak });
        return next;
      });
      return true;
    }
    setWrongSan(m.san);
    setStatus('wrong');
    setStats((s) => {
      const next = { ...s, wrong: s.wrong + 1, streak: 0 };
      saveStats(next);
      return next;
    });
    return false;
  };

  const next = () => {
    setIdx((i) => {
      if (i + 1 >= deck.length) {
        setDeck(shuffle(pool));
        return 0;
      }
      return i + 1;
    });
    setStatus('ask');
    setWrongSan(null);
  };

  const reveal = () => setStatus('revealed');

  const resetStats = () => {
    const z = { correct: 0, wrong: 0, streak: 0, best: 0 };
    setStats(z);
    saveStats(z);
  };

  const total = stats.correct + stats.wrong;
  const acc = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  return (
    <div className="drills-page">
      <header className="page-hero small">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Opening drills</h1>
        <p className="hero-sub">
          Card-by-card training. A position is shown; play the book move. Order is shuffled each session. Progress stored in your browser.
        </p>
      </header>

      <section className="drills-toolbar">
        <div>
          <label>
            Scope:{' '}
            <select value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
              <option value="all">All openings</option>
              <option value="queens-gambit">Queen&apos;s Gambit</option>
              <option value="sicilian">Sicilian</option>
            </select>
          </label>
        </div>
        <div className="drill-stats">
          <span><strong>{stats.correct}</strong> ✓</span>
          <span><strong>{stats.wrong}</strong> ✗</span>
          <span>accuracy <strong>{acc}%</strong></span>
          <span>streak <strong>{stats.streak}</strong> (best {stats.best})</span>
          <button className="btn" onClick={resetStats}>Reset</button>
        </div>
      </section>

      {card ? (
        <div className="lesson-grid-2col">
          <div className="board-col">
            <Board
              fen={fen}
              boardOrientation={sideToMove}
              arePiecesDraggable={status === 'ask'}
              onPieceDrop={onPieceDrop}
              lastMove={lastMoveFromSans(card.sanList, card.ply)}
            />
            <div className="board-controls">
              <button className="btn" onClick={reveal} disabled={status !== 'ask'}>Show answer</button>
              <button className="btn primary" onClick={next}>Next ▶</button>
            </div>
          </div>
          <div className="info-col">
            <section className="annotation-panel">
              <div className="drill-tag">
                {card.lessonTitle} — <span className="muted">{card.variationName}</span>
              </div>
              <h2>
                {sideToMove === 'white' ? 'White' : 'Black'} to move — what's the book move?
              </h2>
              {status === 'ask' && (
                <p>Drag the piece to play the theory move.</p>
              )}
              {status === 'right' && (
                <>
                  <h3>✅ Correct — <code>{card.target.san}</code></h3>
                  <p>{card.target.comment}</p>
                  {card.target.keyIdea && <div className="key-idea">🔑 {card.target.keyIdea}</div>}
                </>
              )}
              {status === 'wrong' && (
                <>
                  <h3>❌ You played <code>{wrongSan}</code></h3>
                  <p>
                    The book move is <code>{card.target.san}</code> — {card.target.comment}
                  </p>
                  <button className="btn primary" onClick={() => { setStatus('ask'); setWrongSan(null); }}>Try again</button>
                </>
              )}
              {status === 'revealed' && (
                <>
                  <h3>Answer: <code>{card.target.san}</code></h3>
                  <p>{card.target.comment}</p>
                  {card.target.keyIdea && <div className="key-idea">🔑 {card.target.keyIdea}</div>}
                </>
              )}
              <div className="muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                Card {idx + 1} of {deck.length}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <p>No drills available for this scope.</p>
      )}
    </div>
  );
}
