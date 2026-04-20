import { Variation } from '../data/types';
import { Link } from 'react-router-dom';

interface Props {
  openingId: string;
  lessonId: string;
  variations: Variation[];
}

export function VariationTree({ openingId, lessonId, variations }: Props) {
  if (!variations || variations.length === 0) return null;
  return (
    <div className="var-tree">
      <h3>Variations</h3>
      <ul>
        {variations.map((v) => (
          <li key={v.id}>
            <Link to={`/lesson/${openingId}/${lessonId}/${v.id}`}>
              <strong>{v.name}</strong>
              {v.eco && <span className="eco">{v.eco}</span>}
            </Link>
            <p>{v.summary}</p>
            {v.subVariations && v.subVariations.length > 0 && (
              <ul className="subvar">
                {v.subVariations.map((sv) => (
                  <li key={sv.id}>
                    <Link to={`/lesson/${openingId}/${lessonId}/${v.id}/${sv.id}`}>
                      {sv.name}
                    </Link>
                    <span className="subvar-summary"> — {sv.summary}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
