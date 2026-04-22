import { useEffect, useRef, useState } from 'react';
import { evaluate, stopEngine, EngineEval, EngineLine } from '../engine/stockfish';

interface EvalBarProps {
  fen: string;
  depth?: number;
  multiPv?: number;
  enabled: boolean;
  onToggle: () => void;
}

function formatCpOrMate(line: EngineLine | Pick<EngineEval, 'cp' | 'mate'> | null): string {
  if (!line) return '…';
  if (line.mate !== undefined) {
    const sign = line.mate > 0 ? '+' : '-';
    return `#${sign}${Math.abs(line.mate)}`;
  }
  if (line.cp === undefined) return '…';
  const pawns = line.cp / 100;
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

export function EvalBar({ fen, depth = 14, multiPv = 3, enabled, onToggle }: EvalBarProps) {
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
    evaluate(fen, depth, multiPv, (e) => {
      setLoading(false);
      setEvalData(e);
    }).catch((err) => {
      setError(String(err));
      setLoading(false);
    });
    return () => {
      stopEngine();
    };
  }, [fen, depth, multiPv, enabled]);

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
  const label = error ? '—' : loading && !evalData ? '…' : formatCpOrMate(evalData);

  return (
    <div className="eval-bar-wrap">
      <div className="eval-bar" title="White advantage above, Black below">
        <div className="eval-bar-white" style={{ height: `${pct}%` }} />
        <div className="eval-bar-black" style={{ height: `${100 - pct}%` }} />
        <span className="eval-bar-label">{label}</span>
      </div>
    </div>
  );
}

interface MultiPvPanelProps {
  fen: string;
  depth?: number;
  multiPv?: number;
  enabled: boolean;
}

export function MultiPvPanel({ fen, depth = 16, multiPv = 3, enabled }: MultiPvPanelProps) {
  const [evalData, setEvalData] = useState<EngineEval | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastFenRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      setEvalData(null);
      return;
    }
    if (lastFenRef.current === fen) return;
    lastFenRef.current = fen;
    setError(null);
    evaluate(fen, depth, multiPv, (e) => setEvalData(e)).catch((err) => setError(String(err)));
  }, [fen, depth, multiPv, enabled]);

  if (!enabled) return null;
  if (error) {
    return (
      <section className="multipv-panel">
        <h3>Engine analysis</h3>
        <p className="eval-error">Engine failed to load: {error}</p>
      </section>
    );
  }
  if (!evalData) {
    return (
      <section className="multipv-panel">
        <h3>Engine analysis</h3>
        <p className="muted">Analyzing…</p>
      </section>
    );
  }

  return (
    <section className="multipv-panel">
      <h3>Engine analysis <span className="depth-tag">d{evalData.depth}</span></h3>
      {evalData.lines.length === 0 ? (
        <p className="muted">Waiting for engine…</p>
      ) : (
        <ol className="multipv-list">
          {evalData.lines.map((l) => (
            <li key={l.multipv}>
              <span className="pv-eval">{formatCpOrMate(l)}</span>
              <code className="pv-moves">{l.pv ?? l.bestMove ?? '—'}</code>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
