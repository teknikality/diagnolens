import { DL_COLORS } from '../tokens.js';

export default function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: DL_COLORS.fgMuted, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}
