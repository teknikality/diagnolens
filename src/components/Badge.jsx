import { STATUS_META } from '../tokens.js';

export default function Badge({ status = 'normal', children }) {
  const meta = STATUS_META[status] || STATUS_META.info;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
      background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`,
      fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
      {children || meta.label}
    </span>
  );
}
