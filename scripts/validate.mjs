import { Chess } from 'chess.js';
import { openings } from '../src/data/registry.ts';
import { puzzles } from '../src/data/puzzles.ts';

let errors = 0;
let lines = 0;

function testLine(label, sans) {
  lines++;
  const c = new Chess();
  for (let i = 0; i < sans.length; i++) {
    try {
      const m = c.move(sans[i]);
      if (!m) {
        console.error(`[FAIL] ${label} — move ${i + 1} (${sans[i]}) illegal`);
        errors++;
        return;
      }
    } catch (e) {
      console.error(`[FAIL] ${label} — move ${i + 1} (${sans[i]}) ${e.message}`);
      errors++;
      return;
    }
  }
}

for (const op of openings) {
  for (const lesson of op.lessons) {
    testLine(
      `${op.id}/${lesson.id}/main`,
      lesson.mainLine.line.map((m) => m.san),
    );
    for (const v of lesson.variations) {
      testLine(
        `${op.id}/${lesson.id}/${v.id}`,
        v.line.map((m) => m.san),
      );
      if (v.subVariations) {
        for (const sv of v.subVariations) {
          testLine(
            `${op.id}/${lesson.id}/${v.id}/${sv.id}`,
            sv.line.map((m) => m.san),
          );
        }
      }
    }
    if (lesson.commonTraps) {
      for (const t of lesson.commonTraps) {
        testLine(`${op.id}/${lesson.id}/trap/${t.name}`, t.line);
      }
    }
  }
  for (const g of op.games) {
    const c = new Chess();
    try {
      c.loadPgn(g.pgn);
      lines++;
    } catch (e) {
      console.error(`[FAIL] game ${g.id}: ${e.message}`);
      errors++;
    }
  }
}

for (const p of puzzles) {
  lines++;
  const c = new Chess();
  try {
    c.loadPgn(p.pgnPrefix);
  } catch (e) {
    console.error(`[FAIL] puzzle ${p.id} prefix: ${e.message}`);
    errors++;
    continue;
  }
  let ok = true;
  for (let i = 0; i < p.solution.length; i++) {
    try {
      const m = c.move(p.solution[i]);
      if (!m) {
        console.error(`[FAIL] puzzle ${p.id} — solution move ${i + 1} (${p.solution[i]}) illegal`);
        errors++;
        ok = false;
        break;
      }
    } catch (e) {
      console.error(`[FAIL] puzzle ${p.id} — solution move ${i + 1} (${p.solution[i]}) ${e.message}`);
      errors++;
      ok = false;
      break;
    }
  }
  if (!ok) continue;
}

console.log(`\n${lines} lines checked, ${errors} errors.`);
process.exit(errors > 0 ? 1 : 0);
