import { useEffect, useMemo, useState, CSSProperties } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { BOARD_PALETTES, usePrefs } from '../prefs';
import { playCaptureSound, playMoveSound, playCheckSound } from '../engine/sound';

interface Props {
  fen: string;
  onPieceDrop?: (from: string, to: string, piece: string) => boolean;
  boardOrientation?: 'white' | 'black';
  arePiecesDraggable?: boolean;
  customSquareStyles?: Record<string, CSSProperties>;
  customArrows?: [string, string, string?][];
  lastMove?: { from: string; to: string } | null;
}

function computeWidth(): number {
  if (typeof window === 'undefined') return 360;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Reserve vertical space: topbar ~60, controls/movelist ~150, bottom-tabs ~64, eval bar ~40, padding
  const verticalChrome = w < 760 ? 280 : 200;
  const maxH = Math.max(220, h - verticalChrome);

  if (w < 760) {
    // Mobile: fill width minus 12px gutters
    return Math.max(220, Math.min(w - 24, maxH, 560));
  }
  if (w < 1020) {
    // Tablet: stacked, but board centered with comfortable size
    return Math.max(320, Math.min(w - 56, maxH, 560));
  }
  // Desktop: fit in the left column with eval bar
  const colWidth = Math.min(w * 0.5, 600);
  return Math.max(360, Math.min(colWidth - 36, maxH - 80, 560));
}

function findKingSquare(chess: Chess, color: 'w' | 'b'): string | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece && piece.type === 'k' && piece.color === color) {
        const file = 'abcdefgh'[f];
        const rank = 8 - r;
        return `${file}${rank}`;
      }
    }
  }
  return null;
}

export function Board({
  fen,
  onPieceDrop,
  boardOrientation = 'white',
  arePiecesDraggable = true,
  customSquareStyles,
  customArrows,
  lastMove,
}: Props) {
  const [width, setWidth] = useState<number>(computeWidth());
  const [selected, setSelected] = useState<string | null>(null);
  const { prefs } = usePrefs();
  const palette = BOARD_PALETTES[prefs.boardStyle];

  useEffect(() => {
    const onResize = () => setWidth(computeWidth());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  useEffect(() => {
    setSelected(null);
  }, [fen]);

  const chess = useMemo(() => {
    try { return new Chess(fen); } catch { return new Chess(); }
  }, [fen]);

  const inCheck = chess.inCheck();
  const turn = chess.turn();

  const legalFromSelected: { to: string; captured: boolean }[] = useMemo(() => {
    if (!selected) return [];
    try {
      const moves = chess.moves({ square: selected as Square, verbose: true });
      return moves.map((m: any) => ({ to: m.to, captured: !!m.captured }));
    } catch {
      return [];
    }
  }, [chess, selected]);

  const handleDrop = onPieceDrop
    ? (from: string, to: string, piece: string) => {
        const capture = !!chess.get(to as Square);
        const ok = onPieceDrop(from, to, piece);
        if (ok && prefs.sound) {
          const nextFen = (() => {
            try {
              const c = new Chess(fen);
              c.move({ from, to, promotion: 'q' });
              return c.fen();
            } catch { return null; }
          })();
          const nowInCheck = nextFen ? new Chess(nextFen).inCheck() : false;
          if (nowInCheck) playCheckSound();
          else if (capture) playCaptureSound();
          else playMoveSound();
        }
        setSelected(null);
        return ok;
      }
    : undefined;

  const onSquareClick = (square: string) => {
    if (!onPieceDrop) return;
    // Tap again to deselect
    if (selected === square) {
      setSelected(null);
      return;
    }
    // If clicking a legal destination, play it
    if (selected) {
      const legal = legalFromSelected.find((m) => m.to === square);
      if (legal) {
        handleDrop?.(selected, square, '');
        return;
      }
    }
    // Otherwise try selecting a piece of the side to move
    const piece = chess.get(square as Square);
    if (piece && piece.color === turn) {
      setSelected(square);
    } else {
      setSelected(null);
    }
  };

  // Build styles: merge last-move → selected → legal-dots → check → user-provided
  const computedSquareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};

    if (lastMove) {
      const hl: CSSProperties = { background: 'rgba(242, 179, 61, 0.28)' };
      styles[lastMove.from] = hl;
      styles[lastMove.to] = hl;
    }

    if (selected) {
      styles[selected] = {
        ...styles[selected],
        background: 'rgba(106, 176, 76, 0.38)',
      };
    }

    for (const m of legalFromSelected) {
      const base = styles[m.to] ?? {};
      styles[m.to] = {
        ...base,
        background: m.captured
          ? `radial-gradient(circle, transparent 60%, rgba(231, 76, 60, 0.55) 62%)`
          : `radial-gradient(circle, rgba(50, 50, 50, 0.45) 18%, transparent 22%)`,
      };
    }

    if (inCheck) {
      const kingSq = findKingSquare(chess, turn);
      if (kingSq) {
        styles[kingSq] = {
          ...styles[kingSq],
          background: 'radial-gradient(circle, rgba(231, 76, 60, 0.7) 40%, rgba(231,76,60,0.18) 70%)',
        };
      }
    }

    if (customSquareStyles) {
      for (const [sq, s] of Object.entries(customSquareStyles)) {
        styles[sq] = { ...styles[sq], ...s };
      }
    }

    return styles;
  }, [lastMove, selected, legalFromSelected, inCheck, chess, turn, customSquareStyles]);

  return (
    <div className="board-wrap" style={{ width, maxWidth: '100%' }}>
      <Chessboard
        position={fen}
        onPieceDrop={handleDrop}
        onSquareClick={onSquareClick}
        arePiecesDraggable={arePiecesDraggable && !!onPieceDrop}
        boardOrientation={boardOrientation}
        boardWidth={width}
        customSquareStyles={computedSquareStyles}
        customArrows={prefs.showArrows ? (customArrows as any) : undefined}
        customBoardStyle={{
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
        customDarkSquareStyle={{ backgroundColor: palette.dark }}
        customLightSquareStyle={{ backgroundColor: palette.light }}
        animationDuration={180}
      />
    </div>
  );
}
