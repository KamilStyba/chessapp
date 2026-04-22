let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const C = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (C) ctx = new C();
    } catch {
      return null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  const a = getCtx();
  if (!a) return;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(a.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + duration);
  osc.stop(a.currentTime + duration + 0.01);
}

export function playMoveSound() {
  tone(440, 0.07, 'triangle');
}

export function playCaptureSound() {
  tone(330, 0.1, 'sawtooth', 0.18);
  setTimeout(() => tone(250, 0.09, 'sawtooth', 0.12), 30);
}

export function playSuccessSound() {
  tone(660, 0.08, 'sine', 0.16);
  setTimeout(() => tone(880, 0.1, 'sine', 0.16), 70);
}

export function playErrorSound() {
  tone(200, 0.15, 'square', 0.12);
}
