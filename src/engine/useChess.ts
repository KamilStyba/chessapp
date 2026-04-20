import { useCallback, useMemo, useRef, useState } from 'react';
import { Chess, Move } from 'chess.js';

export interface UseChessResult {
  fen: string;
  history: Move[];
  ply: number;
  turn: 'w' | 'b';
  isGameOver: boolean;
  makeMove: (san: string) => Move | null;
  makeMoveObj: (from: string, to: string, promotion?: string) => Move | null;
  undo: () => void;
  reset: (fen?: string) => void;
  goto: (ply: number) => void;
}

export function useChess(initialFen?: string): UseChessResult {
  const chessRef = useRef<Chess>(new Chess(initialFen));
  const fullHistoryRef = useRef<Move[]>([]);
  const [, setTick] = useState(0);
  const [ply, setPly] = useState(0);

  const bump = () => setTick((t) => t + 1);

  const rebuildTo = useCallback((targetPly: number) => {
    const fresh = new Chess(initialFen);
    for (let i = 0; i < targetPly; i++) {
      const m = fullHistoryRef.current[i];
      if (!m) break;
      fresh.move({ from: m.from, to: m.to, promotion: m.promotion });
    }
    chessRef.current = fresh;
  }, [initialFen]);

  const makeMove = useCallback((san: string): Move | null => {
    if (ply < fullHistoryRef.current.length) {
      fullHistoryRef.current = fullHistoryRef.current.slice(0, ply);
    }
    try {
      const move = chessRef.current.move(san);
      if (!move) return null;
      fullHistoryRef.current.push(move);
      setPly(fullHistoryRef.current.length);
      bump();
      return move;
    } catch {
      return null;
    }
  }, [ply]);

  const makeMoveObj = useCallback((from: string, to: string, promotion?: string): Move | null => {
    if (ply < fullHistoryRef.current.length) {
      fullHistoryRef.current = fullHistoryRef.current.slice(0, ply);
    }
    try {
      const move = chessRef.current.move({ from, to, promotion: promotion as any });
      if (!move) return null;
      fullHistoryRef.current.push(move);
      setPly(fullHistoryRef.current.length);
      bump();
      return move;
    } catch {
      return null;
    }
  }, [ply]);

  const undo = useCallback(() => {
    if (ply === 0) return;
    const newPly = ply - 1;
    rebuildTo(newPly);
    setPly(newPly);
    bump();
  }, [ply, rebuildTo]);

  const reset = useCallback((fen?: string) => {
    chessRef.current = new Chess(fen);
    fullHistoryRef.current = [];
    setPly(0);
    bump();
  }, []);

  const goto = useCallback((target: number) => {
    const clamped = Math.max(0, Math.min(target, fullHistoryRef.current.length));
    rebuildTo(clamped);
    setPly(clamped);
    bump();
  }, [rebuildTo]);

  const fen = chessRef.current.fen();
  const turn = chessRef.current.turn();
  const isGameOver = chessRef.current.isGameOver();

  const history = useMemo(() => fullHistoryRef.current.slice(0, ply), [ply]);

  return { fen, history, ply, turn, isGameOver, makeMove, makeMoveObj, undo, reset, goto };
}
