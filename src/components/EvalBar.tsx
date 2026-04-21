import { useEffect, useRef, useState } from 'react';
import { evaluate, stopEngine, EngineEval } from '../engine/stockfish';

interface EvalBarProps {
  fen: string;
  depth?: number;
  enabled: boolean;
  onToggle: () => void;
}

function formatEval(e: EngineEval | null): string {
  if (!e) return '…';
  if (e.mate !== undefined) {
    const sign = e.mate > 0 ? '+' : '-';
    return `#${sign}${Math.abs(e.mate)}`;
  }
  if (e.cp === undefined) return '…';
  const pawns = e.cp / 100;
  const sign = pawns >= 0 ? '+' : '';
  return `${sign}${pawns.toFixed(2)}`;
}

function percentFromEval(e: EngineEval | null): number {
  if (!e) return 50;
  if (e.mate !== undefined) {
    return e.mate > 0 ? 95 : 5;
  }
  if (e.cp === undefined) return 50;
  const winProb = 50 + 50 * (2 / (1 + Math.exp(-0.004 * e.cp)) - 1);
  return Math.max(3, Math.min(97, winProb));
}

export function EvalBar({ fen, depth = 14, enabled, onToggle }: EvalBarProps) {
  const [evalData, setEvalData] = useState<EngineEval | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const lastFenRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      stopEngine();
      setEvalData(null);
      return;
    }
    if (lastFenRef.current === fen) return;
    lastFenRef.current = fen;
    setLoading(true);
    setError(null);
    evaluate(fen, depth, (e) => {
      setLoading(false);
      setEvalData(e);
    }).catch((err) => {
      setError(String(err));
      setLoading(false);
    });
    return () => {
      stopEngine();
    };
  }, [fen, depth, enabled]);

  if (!enabled) {
    return (
      <div className="eval-bar-off">
        <button className="btn-subtle" onClick={onToggle}>
          🔍 Enable engine eval
        </button>
      </div>
    );
  }

  const pct = percentFromEval(evalData);
  const label = error ? '—' : loading && !evalData ? '…' : formatEval(evalData);

  return (
    <div className="eval-bar-wrap">
      <div className="eval-bar" title="White advantage above, Black below">
        <div className="eval-bar-white" style={{ height: `${pct}%` }} />
        <div className="eval-bar-black" style={{ height: `${100 - pct}%` }} />
        <span className="eval-bar-label">{label}</span>
      </div>
      <div className="eval-bar-info">
        {error ? (
          <span className="eval-error">Engine failed to load.</span>
        ) : (
          <>
            <span>depth {evalData?.depth ?? 0}</span>
            {evalData?.bestMove && (
              <span className="eval-best">best: <code>{evalData.bestMove}</code></span>
            )}
          </>
        )}
        <button className="btn-subtle" onClick={onToggle}>turn off</button>
      </div>
    </div>
  );
}
