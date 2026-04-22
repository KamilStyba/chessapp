import { useEffect } from 'react';

interface NavOptions {
  onPrev: () => void;
  onNext: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onFlip?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onPrev,
  onNext,
  onHome,
  onEnd,
  onFlip,
  enabled = true,
}: NavOptions) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowRight':
        case 'j':
        case ' ':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
        case 'k':
          e.preventDefault();
          onPrev();
          break;
        case 'Home':
          if (onHome) {
            e.preventDefault();
            onHome();
          }
          break;
        case 'End':
          if (onEnd) {
            e.preventDefault();
            onEnd();
          }
          break;
        case 'f':
          if (onFlip) {
            e.preventDefault();
            onFlip();
          }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onHome, onEnd, onFlip, enabled]);
}
