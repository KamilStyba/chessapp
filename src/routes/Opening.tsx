import { Link, useParams } from 'react-router-dom';
import { findOpening } from '../data/registry';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Opening() {
  const { openingId } = useParams();
  const op = findOpening(openingId ?? '');
  if (!op) return <div className="error">Opening not found.</div>;

  return (
    <div className="opening-page">
      <Breadcrumbs
        crumbs={[
          { label: 'Library', to: '/' },
          { label: op.title },
        ]}
      />
      <header className="page-hero">
        <h1>{op.title}</h1>
        <p className="hero-sub">{op.subtitle}</p>
      </header>

      <section className="intro-essay">
        <p>{op.overview.intro}</p>
      </section>

      <section className="core-ideas">
        <h2>Core strategic ideas</h2>
        <ul>
          {op.overview.coreIdeas.map((idea, i) => (
            <li key={i}>{idea}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Lessons</h2>
        <div className="lesson-grid">
          {op.lessons.map((l) => (
            <div key={l.id} className="lesson-card">
              <h3>{l.title}</h3>
              <p>
                {op.overview.lessons.find((x) => x.id === l.id)?.blurb ??
                  l.intro.slice(0, 160) + '…'}
              </p>
              <div className="lesson-card-links">
                <Link
                  className="btn primary"
                  to={`/lesson/${op.id}/${l.id}`}
                >
                  Study
                </Link>
                <Link className="btn" to={`/quiz/${op.id}/${l.id}`}>
                  Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {op.games.length > 0 && (
        <section>
          <h2>Annotated master games</h2>
          <div className="game-grid">
            {op.games.map((g) => (
              <Link key={g.id} to={`/game/${g.id}`} className="game-card">
                <div className="game-header">
                  <strong>
                    {g.white} – {g.black}
                  </strong>
                  <span className="game-result">{g.result}</span>
                </div>
                <div className="game-event">
                  {g.event}, {g.year}
                </div>
                <p className="game-intro">{g.intro}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
