import { useEffect, useState, CSSProperties } from 'react';
import { Chessboard } from 'react-chessboard';
import { BOARD_PALETTES, usePrefs } from '../prefs';
import { playCaptureSound, playMoveSound } from '../engine/sound';
import { Chess } from 'chess.js';

interface Props {
  fen: string;
  onPieceDrop?: (from: string, to: string, piece: string) => boolean;
  boardOrientation?: 'white' | 'black';
  arePiecesDraggable?: boolean;
  customSquareStyles?: Record<string, CSSProperties>;
  customArrows?: [string, string, string?][];
}

function computeWidth(): number {
  if (typeof window === 'undefined') return 360;
  const padding = 32;
  const max = 560;
  const sideWidth = window.innerWidth >= 900 ? Math.min(window.innerWidth * 0.55, 640) : window.innerWidth;
  return Math.max(240, Math.min(sideWidth - padding, max));
}

function wouldCapture(fen: string, from: string, to: string): boolean {
  try {
    const c = new Chess(fen);
    const piece = c.get(to as any);
    return !!piece;
  } catch {
    return false;
  }
}

export function Board({
  fen,
  onPieceDrop,
  boardOrientation = 'white',
  arePiecesDraggable = true,
  customSquareStyles,
  customArrows,
}: Props) {
  const [width, setWidth] = useState<number>(computeWidth());
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

  const handleDrop = onPieceDrop
    ? (from: string, to: string, piece: string) => {
        const capture = wouldCapture(fen, from, to);
        const ok = onPieceDrop(from, to, piece);
        if (ok && prefs.sound) {
          capture ? playCaptureSound() : playMoveSound();
        }
        return ok;
      }
    : undefined;

  return (
    <div className="board-wrap" style={{ width, maxWidth: '100%' }}>
      <Chessboard
        position={fen}
        onPieceDrop={handleDrop}
        arePiecesDraggable={arePiecesDraggable && !!onPieceDrop}
        boardOrientation={boardOrientation}
        boardWidth={width}
        customSquareStyles={customSquareStyles}
        customArrows={prefs.showArrows ? (customArrows as any) : undefined}
        customBoardStyle={{
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}
        customDarkSquareStyle={{ backgroundColor: palette.dark }}
        customLightSquareStyle={{ backgroundColor: palette.light }}
      />
    </div>
  );
}
