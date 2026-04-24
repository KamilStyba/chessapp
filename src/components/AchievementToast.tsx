import { useEffect, useState } from 'react';
import { Achievement, onUnlock } from '../data/achievements';

interface ToastItem {
  id: number;
  ach: Achievement;
}

export function AchievementToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const off = onUnlock((ach) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, ach }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 4500);
    });
    return () => { off(); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-card">
          <div className="toast-icon">{t.ach.icon}</div>
          <div className="toast-body">
            <div className="toast-kicker">Achievement unlocked</div>
            <div className="toast-title">{t.ach.title}</div>
            <div className="toast-desc">{t.ach.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
