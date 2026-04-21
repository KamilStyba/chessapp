const CDN_URL = 'https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js';

export interface EngineEval {
  cp?: number;
  mate?: number;
  depth: number;
  bestMove?: string;
  pv?: string;
}

type Listener = (e: EngineEval) => void;

let worker: Worker | null = null;
let loading = false;
let loadPromise: Promise<void> | null = null;
let currentListener: Listener | null = null;
let currentDepth = 0;
let currentCp: number | undefined;
let currentMate: number | undefined;
let currentPv: string | undefined;
let currentBest: string | undefined;
let sideToMove: 'w' | 'b' = 'w';

async function loadEngine(): Promise<void> {
  if (worker) return;
  if (loadPromise) return loadPromise;
  loading = true;
  loadPromise = (async () => {
    const res = await fetch(CDN_URL);
    if (!res.ok) throw new Error(`Failed to fetch Stockfish (${res.status})`);
    const code = await res.text();
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    worker = new Worker(url);
    worker.onmessage = (ev) => handleMessage(String(ev.data));
    send('uci');
    send('isready');
    loading = false;
  })();
  return loadPromise;
}

function send(cmd: string) {
  if (worker) worker.postMessage(cmd);
}

function handleMessage(line: string) {
  if (line.startsWith('info') && line.includes(' depth ')) {
    const depthMatch = line.match(/ depth (\d+)/);
    if (depthMatch) currentDepth = Number(depthMatch[1]);
    const cpMatch = line.match(/ score cp (-?\d+)/);
    const mateMatch = line.match(/ score mate (-?\d+)/);
    if (cpMatch) {
      currentCp = Number(cpMatch[1]) * (sideToMove === 'w' ? 1 : -1);
      currentMate = undefined;
    }
    if (mateMatch) {
      currentMate = Number(mateMatch[1]) * (sideToMove === 'w' ? 1 : -1);
      currentCp = undefined;
    }
    const pvMatch = line.match(/ pv (.+)$/);
    if (pvMatch) {
      currentPv = pvMatch[1];
      currentBest = currentPv.split(' ')[0];
    }
    if (currentListener) {
      currentListener({
        cp: currentCp,
        mate: currentMate,
        depth: currentDepth,
        bestMove: currentBest,
        pv: currentPv,
      });
    }
  } else if (line.startsWith('bestmove')) {
    const best = line.split(' ')[1];
    if (best) {
      currentBest = best;
      if (currentListener) {
        currentListener({
          cp: currentCp,
          mate: currentMate,
          depth: currentDepth,
          bestMove: currentBest,
          pv: currentPv,
        });
      }
    }
  }
}

export async function evaluate(
  fen: string,
  depth: number,
  listener: Listener,
): Promise<void> {
  await loadEngine();
  sideToMove = fen.split(' ')[1] === 'w' ? 'w' : 'b';
  currentListener = listener;
  currentDepth = 0;
  currentCp = undefined;
  currentMate = undefined;
  currentPv = undefined;
  currentBest = undefined;
  send('stop');
  send(`position fen ${fen}`);
  send(`go depth ${depth}`);
}

export function stopEngine() {
  if (worker) send('stop');
  currentListener = null;
}

export function isEngineLoading(): boolean {
  return loading;
}

export function isEngineReady(): boolean {
  return worker !== null && !loading;
}
