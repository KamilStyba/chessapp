import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { openings, puzzles } from '../data/registry';
import { ProgressDonut } from '../components/ProgressDonut';
import { LastStudied, mostRecent, mostRecentForOpening } from '../data/lastStudied';
import { loadSolved } from '../data/puzzleProgress';
import { ALL_ACHIEVEMENTS, getUnlocked } from '../data/achievements';

function dailyPuzzleIndex(): number {
  const today = new Date();
  const key = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  let h = 2166136261;
  const s = String(key);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h % puzzles.length;
}

const OPENING_TAGS: Record<string, string[]> = {
  'queens-gambit': ['d4', 'closed', 'positional'],
  sicilian: ['e4', 'open', 'sharp'],
};

function countVariations(op: typeof openings[number]): number {
  return op.lessons.reduce(
    (acc, l) =>
      acc +
      1 +
      l.variations.length +
      l.variations.reduce((a, v) => a + (v.subVariations?.length ?? 0), 0),
    0,
  );
}

function estimateProgress(openingId: string, solvedIds: Set<string>): number {
  const op = openings.find((o) => o.id === openingId);
  if (!op) return 0;
  const openingPuzzles = puzzles.filter((p) => p.opening === openingId);
  if (openingPuzzles.length === 0) return 0;
  const done = openingPuzzles.filter((p) => solvedIds.has(p.id)).length;
  return Math.round((done / openingPuzzles.length) * 100);
}

export function Home() {
  const [recent, setRecent] = useState<LastStudied | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [unlocked, setUnlocked] = useState<Record<string, number>>({});

  useEffect(() => {
    setRecent(mostRecent());
    setSolved(loadSolved());
    setUnlocked(getUnlocked());
  }, []);

  const dailyPuzzle = puzzles[dailyPuzzleIndex()];

  const resumeHref = recent
    ? `/lesson/${recent.openingId}/${recent.lessonId}${recent.variationId ? `/${recent.variationId}` : ''}`
    : '/opening/queens-gambit';

  const heroTitle = recent
    ? recent.variationName ?? recent.lessonTitle
    : 'the Carlsbad minority attack';

  const heroLede = recent
    ? `You're in ${recent.lessonTitle}${recent.variationName ? ` → ${recent.variationName}` : ''}. Resume the annotated walkthrough, or quiz yourself on the line.`
    : "Two openings, taught like a book. Start with either the Queen's Gambit or the Sicilian Defense — every major variation is annotated move-by-move at grandmaster level.";

  return (
    <div className="home">
      <section className="editorial-hero">
        <div className="kicker">
          <span>Chapter</span><span className="dot">·</span><span>{recent ? 'Continue' : 'Start here'}</span>
        </div>
        <h1>
          {recent ? 'Pick up where you left off — ' : 'Start reading — '}
          <em>{heroTitle}.</em>
        </h1>
        <p className="hero-lede">{heroLede}</p>
        <div className="hero-cta">
          <Link className="btn-primary-dark" to={resumeHref}>
            {recent ? 'Resume lesson →' : 'Begin →'}
          </Link>
          {recent && (
            <Link
              className="btn-ghost"
              to={`/quiz/${recent.openingId}/${recent.lessonId}${recent.variationId ? `/${recent.variationId}` : ''}`}
            >
              Quiz this line
            </Link>
          )}
          <span className="hero-meta">
            ~8 min · {openings.reduce((a, o) => a + o.lessons.length, 0)} lessons
          </span>
        </div>
      </section>

      <div className="section-title-row">
        <h2>The two books</h2>
        <span className="section-hint">Deep, annotated, grandmaster-level.</span>
      </div>

      <section className="books-grid">
        {openings.map((op) => {
          const pct = estimateProgress(op.id, solved);
          const last = mostRecentForOpening(op.id);
          const tags = OPENING_TAGS[op.id] ?? [];
          return (
            <Link key={op.id} to={`/opening/${op.id}`} className="book-card">
              <div className="book-card-head">
                <div className="book-icon" aria-hidden>
                  {op.id === 'queens-gambit' ? '♛' : '♚'}
                </div>
                <ProgressDonut value={pct} size={46} />
              </div>
              <h3>{op.title}</h3>
              <p className="book-lede">{op.subtitle}</p>
              <div className="book-tags">
                {tags.map((t) => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
              <div className="book-stats">
                <div className="stat">
                  <div className="stat-num">{op.lessons.length}</div>
                  <div className="stat-label">Lessons</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{countVariations(op)}</div>
                  <div className="stat-label">Variations</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{op.games.length}</div>
                  <div className="stat-label">Master games</div>
                </div>
              </div>
              {last && (
                <div className="book-last-studied">
                  <span className="label">Last studied</span>
                  <span className="value">
                    {last.lessonTitle}{last.variationName ? ` — ${last.variationName}` : ''}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </section>

      <section className="daily-row">
        <Link to={`/puzzle/${dailyPuzzle.id}`} className="daily-card">
          <span className="kicker"><span>Puzzle of the day</span><span className="dot">·</span><span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></span>
          <h3>{dailyPuzzle.title}</h3>
          <p>{dailyPuzzle.description}</p>
          <button className="daily-cta">Solve it →</button>
        </Link>
        <div className="achievements-card">
          <h3>Achievements</h3>
          <p>{Object.keys(unlocked).length} of {ALL_ACHIEVEMENTS.length} unlocked — keep going.</p>
          <div className="badges-row">
            {ALL_ACHIEVEMENTS.map((a) => (
              <span
                key={a.id}
                className={`badge ${unlocked[a.id] ? 'unlocked' : 'locked'}`}
                title={a.description}
              >
                <span className="badge-icon">{a.icon}</span>
                {a.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="section-title-row">
        <h2>Practice</h2>
        <span className="section-hint">Sharpen what you've read.</span>
      </div>

      <section className="practice-grid">
        <Link to="/puzzles" className="practice-card">
          <div className="practice-head">
            <span className="practice-icon">🧩</span>
            <h3>Tactical puzzles</h3>
          </div>
          <p>{puzzles.length} signature positions from every variation. Drag the key move, read the grandmaster explanation.</p>
        </Link>
        <Link to="/drills" className="practice-card">
          <div className="practice-head">
            <span className="practice-icon">🎯</span>
            <h3>Drills</h3>
          </div>
          <p>Shuffle-deck flashcards across every theory line. Streak and accuracy tracked across sessions.</p>
        </Link>
        <Link to="/play" className="practice-card">
          <div className="practice-head">
            <span className="practice-icon">⚔️</span>
            <h3>Play vs Stockfish</h3>
          </div>
          <p>Pick a variation, walk the theory, then continue the game against a Stockfish opponent at your level.</p>
        </Link>
        <Link to="/explore" className="practice-card">
          <div className="practice-head">
            <span className="practice-icon">🧭</span>
            <h3>Explore</h3>
          </div>
          <p>Free board with live opening detection and book-move suggestions straight from your theory repertoire.</p>
        </Link>
      </section>
    </div>
  );
}
