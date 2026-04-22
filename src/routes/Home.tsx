import { Link } from 'react-router-dom';
import { openings } from '../data/registry';

export function Home() {
  return (
    <div className="home">
      <header className="hero">
        <h1>Chess Openings Trainer</h1>
        <p className="hero-sub">
          A grandmaster-level walkthrough of the two deepest openings in chess —
          the <strong>Queen&apos;s Gambit</strong> and the <strong>Sicilian Defense</strong>.
          Move-by-move commentary, variation trees, quizzes, free exploration,
          and annotated master games.
        </p>
      </header>

      <section className="cards">
        {openings.map((op) => (
          <Link key={op.id} to={`/opening/${op.id}`} className="card">
            <div className="card-icon" aria-hidden>
              {op.id === 'queens-gambit' ? '♛' : '♚'}
            </div>
            <h2>{op.title}</h2>
            <p className="card-sub">{op.subtitle}</p>
            <ul className="card-stats">
              <li>
                <strong>{op.lessons.length}</strong> lessons
              </li>
              <li>
                <strong>
                  {op.lessons.reduce(
                    (acc, l) =>
                      acc +
                      1 +
                      l.variations.length +
                      l.variations.reduce(
                        (a, v) => a + (v.subVariations?.length ?? 0),
                        0,
                      ),
                    0,
                  )}
                </strong>{' '}
                variations
              </li>
              <li>
                <strong>{op.games.length}</strong> master games
              </li>
            </ul>
          </Link>
        ))}
      </section>

      <section className="feature-row">
        <Link to="/puzzles" className="feature">
          <h3>🧩 Tactical Puzzles</h3>
          <p>
            Solve signature positions from each variation — Nd5 outposts,
            Dragon exchange sacs, IQP breaks, minority attacks.
          </p>
        </Link>
        <Link to="/drills" className="feature">
          <h3>🎯 Drills</h3>
          <p>
            Shuffle-deck flashcards — see a position, play the book move. Session
            streak &amp; accuracy tracked in your browser.
          </p>
        </Link>
        <Link to="/play" className="feature">
          <h3>⚔️ Play vs Stockfish</h3>
          <p>
            Pick a variation; play through the theory moves then continue the
            game against Stockfish at your chosen strength.
          </p>
        </Link>
        <Link to="/explore" className="feature">
          <h3>🧭 Explore Mode</h3>
          <p>
            Play any moves on a board; the trainer identifies the opening and
            variation you&apos;re in and links to the relevant lesson.
          </p>
        </Link>
      </section>

      <section className="intro-blurb">
        <h2>How to use this trainer</h2>
        <ol>
          <li>
            <strong>Pick an opening</strong> and read the strategic overview
            (themes, pawn structures, typical plans).
          </li>
          <li>
            <strong>Walk through a lesson</strong> move by move. Each move
            carries GM-level commentary: concrete ideas, piece coordination,
            pawn levers, typical tactics.
          </li>
          <li>
            <strong>Take the quiz</strong> for that lesson — the trainer plays
            the opponent&apos;s moves; you must find the theory move.
          </li>
          <li>
            <strong>Explore freely</strong> to test your recognition of
            variations, or study <strong>annotated master games</strong>.
          </li>
        </ol>
      </section>
    </div>
  );
}
