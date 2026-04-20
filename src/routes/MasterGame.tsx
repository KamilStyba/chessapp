import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { findGame, findOpening } from '../data/registry';
import { Board } from '../components/Board';
import { MoveList } from '../components/MoveList';

function parsePgn(pgn: string): string[] {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
    return chess.history();
  } catch {
    return [];
  }
}

export function MasterGameView() {
  const { gameId } = useParams();
  const game = findGame(gameId ?? '');
  const sanList = useMemo(() => (game ? parsePgn(game.pgn) : []), [game]);
  const [ply, setPly] = useState(0);

  useEffect(() => {
    setPly(0);
  }, [gameId]);

  const fen = useMemo(() => {
    const c = new Chess();
    for (let i = 0; i < ply && i < sanList.length; i++) {
      try {
        c.move(sanList[i]);
      } catch {
        break;
      }
    }
    return c.fen();
  }, [sanList, ply]);

  if (!game) {
    return (
      <div className="error">
        Game not found. <Link to="/">Home</Link>
      </div>
    );
  }

  const opening = findOpening(game.opening);
  const annotation = game.annotations[ply];
  const currentSan = ply > 0 ? sanList[ply - 1] : null;

  return (
    <div className="master-game-page">
      <header className="page-hero small">
        <Link to={`/opening/${game.opening}`} className="back-link">
          ← {opening?.title}
        </Link>
        <h1>
          {game.white} – {game.black}{' '}
          <span className="variation-tag">{game.result}</span>
        </h1>
        <div className="eco-tag">
          {game.event}, {game.year}
        </div>
      </header>

      <section className="intro-essay">
        <p>{game.intro}</p>
      </section>

      <div className="lesson-grid-2col">
        <div className="board-col">
          <Board fen={fen} arePiecesDraggable={false} />
          <div className="board-controls">
            <button onClick={() => setPly(0)} aria-label="Reset">⏮</button>
            <button onClick={() => setPly(Math.max(0, ply - 1))} aria-label="Back">◀</button>
            <button onClick={() => setPly(Math.min(sanList.length, ply + 1))} aria-label="Next" className="primary">▶</button>
            <button onClick={() => setPly(sanList.length)} aria-label="End">⏭</button>
          </div>
          <MoveList moves={sanList} currentPly={ply} onJump={setPly} />
        </div>

        <div className="info-col">
          <section className="annotation-panel">
            <h2>
              {currentSan
                ? `Move ${Math.ceil(ply / 2)}${ply % 2 === 1 ? '.' : '...'} ${currentSan}`
                : 'Starting position'}
            </h2>
            {annotation && <p>{annotation}</p>}
            {!annotation && currentSan && (
              <p className="muted">No annotation for this move.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
