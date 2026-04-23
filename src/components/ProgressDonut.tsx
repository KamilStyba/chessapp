interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
}

export function ProgressDonut({ value, size = 44, stroke = 3 }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (clamped / 100) * circ;
  return (
    <svg className="donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${clamped}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        fontSize={size * 0.28}
        fill="var(--text-dim)"
      >
        {clamped}%
      </text>
    </svg>
  );
}
