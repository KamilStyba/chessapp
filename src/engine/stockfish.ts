const CDN_URL = 'https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js';

export interface EngineLine {
  multipv: number;
  cp?: number;
  mate?: number;
  bestMove?: string;
  pv?: string;
}

export interface EngineEval {
  depth: number;
  lines: EngineLine[];
  bestMove?: string;
  cp?: number;
  mate?: number;
  pv?: string;
}

type Listener = (e: EngineEval) => void;

let worker: Worker | null = null;
let loading = false;
let loadPromise: Promise<void> | null = null;
let currentListener: Listener | null = null;
let currentMultiPv = 1;
let currentDepth = 0;
let currentLines: Map<number, EngineLine> = new Map();
let currentBest: string | undefined;
let sideToMove: 'w' | 'b' = 'w';

async function loadEngine(multiPv: number): Promise<void> {
  if (!worker) {
    if (loadPromise) {
      await loadPromise;
    } else {
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
      await loadPromise;
    }
  }
  if (currentMultiPv !== multiPv) {
    currentMultiPv = multiPv;
    send(`setoption name MultiPV value ${multiPv}`);
  }
}

function send(cmd: string) {
  if (worker) worker.postMessage(cmd);
}

function flipIfBlack(raw: number): number {
  return sideToMove === 'w' ? raw : -raw;
}

function buildEval(): EngineEval {
  const sorted = Array.from(currentLines.values()).sort((a, b) => a.multipv - b.multipv);
  const first = sorted[0];
  return {
    depth: currentDepth,
    lines: sorted,
    bestMove: first?.bestMove ?? currentBest,
    cp: first?.cp,
    mate: first?.mate,
    pv: first?.pv,
  };
}

function handleMessage(line: string) {
  if (line.startsWith('info') && line.includes(' depth ')) {
    const depthMatch = line.match(/ depth (\d+)/);
    if (depthMatch) currentDepth = Number(depthMatch[1]);
    const multipvMatch = line.match(/ multipv (\d+)/);
    const multipv = multipvMatch ? Number(multipvMatch[1]) : 1;
    const cpMatch = line.match(/ score cp (-?\d+)/);
    const mateMatch = line.match(/ score mate (-?\d+)/);
    const pvMatch = line.match(/ pv (.+?)(?:\s+(?:bmc|string)\s|$)/);
    const entry: EngineLine = currentLines.get(multipv) ?? { multipv };
    if (cpMatch) {
      entry.cp = flipIfBlack(Number(cpMatch[1]));
      entry.mate = undefined;
    }
    if (mateMatch) {
      entry.mate = flipIfBlack(Number(mateMatch[1]));
      entry.cp = undefined;
    }
    if (pvMatch) {
      entry.pv = pvMatch[1].trim();
      entry.bestMove = entry.pv.split(' ')[0];
    }
    currentLines.set(multipv, entry);
    if (currentListener) currentListener(buildEval());
  } else if (line.startsWith('bestmove')) {
    const best = line.split(' ')[1];
    if (best) currentBest = best;
    if (currentListener) currentListener(buildEval());
  }
}

export async function evaluate(
  fen: string,
  depth: number,
  multiPv: number,
  listener: Listener,
): Promise<void> {
  await loadEngine(multiPv);
  sideToMove = fen.split(' ')[1] === 'w' ? 'w' : 'b';
  currentListener = listener;
  currentDepth = 0;
  currentLines = new Map();
  currentBest = undefined;
  send('stop');
  send(`position fen ${fen}`);
  send(`go depth ${depth}`);
}

export function stopEngine() {
  if (worker) send('stop');
  currentListener = null;
}

let bestMoveResolver: ((move: string) => void) | null = null;
let bestMoveHooked = false;

function hookBestMove() {
  if (bestMoveHooked || !worker) return;
  const prev = worker.onmessage;
  worker.onmessage = (ev) => {
    const data = String(ev.data);
    if (data.startsWith('bestmove')) {
      const tok = data.split(' ')[1];
      if (bestMoveResolver && tok) {
        const r = bestMoveResolver;
        bestMoveResolver = null;
        r(tok);
      }
    }
    if (prev) (prev as any).call(worker, ev);
  };
  bestMoveHooked = true;
}

export async function getBestMove(
  fen: string,
  moveTimeMs: number,
): Promise<string> {
  await loadEngine(1);
  hookBestMove();
  currentListener = null;
  currentDepth = 0;
  currentLines = new Map();
  currentBest = undefined;
  sideToMove = fen.split(' ')[1] === 'w' ? 'w' : 'b';
  return new Promise<string>((resolve) => {
    bestMoveResolver = resolve;
    send('stop');
    send(`position fen ${fen}`);
    send(`go movetime ${moveTimeMs}`);
  });
}
