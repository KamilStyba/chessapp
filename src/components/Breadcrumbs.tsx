import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            {c.to && !last ? <Link to={c.to}>{c.label}</Link> : <span className={last ? 'current' : ''}>{c.label}</span>}
            {!last && <span className="sep" aria-hidden>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
