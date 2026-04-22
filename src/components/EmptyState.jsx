import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';

export default function EmptyState({ message = 'No data available.' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px',
      color: DL_COLORS.fgMuted, textAlign: 'center', gap: 12,
    }}>
      <Icon name="file-x" size={32} style={{ color: DL_COLORS.fgMuted, opacity: 0.4 }} />
      <div style={{ fontSize: 14 }}>{message}</div>
    </div>
  );
}
