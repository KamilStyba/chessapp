import { useEffect, useRef } from 'react';

interface Props {
  moves: string[];
  currentPly: number;
  onJump: (ply: number) => void;
}

export function MoveList({ moves, currentPly, onJump }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows: { num: number; white?: string; black?: string; whitePly: number; blackPly: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      num: i / 2 + 1,
      white: moves[i],
      black: moves[i + 1],
      whitePly: i + 1,
      blackPly: i + 2,
    });
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLButtonElement>('.move.active');
    if (active) {
      active.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [currentPly]);

  return (
    <div className="movelist" ref={containerRef}>
      {rows.length === 0 && <div className="movelist-empty">No moves yet.</div>}
      {rows.map((r) => (
        <div className="movelist-row" key={r.num}>
          <span className="movenum">{r.num}.</span>
          {r.white && (
            <button
              className={`move ${currentPly === r.whitePly ? 'active' : ''}`}
              onClick={() => onJump(r.whitePly)}
            >
              {r.white}
            </button>
          )}
          {r.black && (
            <button
              className={`move ${currentPly === r.blackPly ? 'active' : ''}`}
              onClick={() => onJump(r.blackPly)}
            >
              {r.black}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
