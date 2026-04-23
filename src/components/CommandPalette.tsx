import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openings, puzzles } from '../data/registry';

type Kind = 'lesson' | 'variation' | 'puzzle' | 'game' | 'setting';

interface Item {
  kind: Kind;
  title: string;
  desc: string;
  to: string;
  searchable: string;
}

function buildIndex(): Item[] {
  const out: Item[] = [];
  for (const op of openings) {
    for (const lesson of op.lessons) {
      out.push({
        kind: 'lesson',
        title: lesson.title,
        desc: `${op.title} · lesson`,
        to: `/lesson/${op.id}/${lesson.id}`,
        searchable: `${lesson.title} ${op.title} lesson ${lesson.themes.join(' ')}`.toLowerCase(),
      });
      for (const v of lesson.variations) {
        out.push({
          kind: 'variation',
          title: v.name,
          desc: `${lesson.title} · ${op.title}`,
          to: `/lesson/${op.id}/${lesson.id}/${v.id}`,
          searchable: `${v.name} ${lesson.title} ${op.title} ${v.eco ?? ''}`.toLowerCase(),
        });
      }
    }
    for (const g of op.games) {
      out.push({
        kind: 'game',
        title: `${g.white} – ${g.black}`,
        desc: `Game · ${op.title} · ${g.year}`,
        to: `/game/${g.id}`,
        searchable: `${g.white} ${g.black} ${g.event} ${g.year}`.toLowerCase(),
      });
    }
  }
  for (const p of puzzles) {
    out.push({
      kind: 'puzzle',
      title: p.title,
      desc: `Puzzle · ${p.theme} · ★${p.difficulty}`,
      to: `/puzzle/${p.id}`,
      searchable: `${p.title} ${p.theme} ${p.description}`.toLowerCase(),
    });
  }
  out.push(
    { kind: 'setting', title: 'Switch theme', desc: 'Settings', to: '/settings', searchable: 'settings theme dark light sepia' },
    { kind: 'setting', title: 'Board colors', desc: 'Settings', to: '/settings', searchable: 'settings board colors wood' },
    { kind: 'setting', title: 'Sound effects', desc: 'Settings', to: '/settings', searchable: 'settings sound audio' },
  );
  return out;
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);
  return { open, setOpen };
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = useMemo(() => buildIndex(), []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return allItems.slice(0, 10);
    return allItems
      .filter((it) => it.searchable.includes(term))
      .slice(0, 30);
  }, [q, allItems]);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  const go = (it: Item) => {
    navigate(it.to);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      const it = filtered[idx];
      if (it) go(it);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose} role="dialog" aria-label="Command palette">
      <div className="cmd-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-row">
          <span aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, variations, puzzles, games…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <span className="cmd-esc">esc to close</span>
        </div>
        <div className="cmd-section-label">
          {q ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'Quick actions'}
        </div>
        <ul className="cmd-list">
          {filtered.map((it, i) => (
            <li key={`${it.to}-${i}`}>
              <a
                className={`cmd-item ${i === idx ? 'selected' : ''}`}
                onMouseEnter={() => setIdx(i)}
                onClick={(e) => { e.preventDefault(); go(it); }}
                href={it.to}
              >
                <span className={`cmd-type-badge ${it.kind}`}>{it.kind}</span>
                <span className="cmd-item-title">{it.title}</span>
                <span className="cmd-item-desc">{it.desc}</span>
              </a>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="cmd-item" style={{ opacity: 0.6 }}>No matches.</li>
          )}
        </ul>
        <div className="cmd-hint-row">
          <span><kbd>↑↓</kbd>navigate</span>
          <span><kbd>↵</kbd>open</span>
          <span><kbd>esc</kbd>close</span>
        </div>
      </div>
    </div>
  );
}
