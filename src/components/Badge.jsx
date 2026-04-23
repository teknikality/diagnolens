import { STATUS_META } from '../tokens.js';
import { useLang } from '../i18n/LangContext.jsx';

export default function Badge({ status = 'normal', children }) {
  const { t } = useLang();
  const meta = STATUS_META[status] || STATUS_META.info;
  const label = children || t(`badge.${status}`) || meta.label;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
      background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
      {label}
    </span>
  );
}
