import { STATUS_META, DL_COLORS } from '../tokens.js';

export default function ValueDisplay({ value, unit, status = 'normal' }) {
  const meta = STATUS_META[status] || STATUS_META.info;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', color: meta.color }}>
        {value}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted }}>
        {unit}
      </span>
    </div>
  );
}
