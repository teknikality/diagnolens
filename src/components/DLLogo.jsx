export default function DLLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ borderRadius: 6, flexShrink: 0, display: 'block' }}>
      <rect width={32} height={32} rx={6} fill="#00C9A7" />
      <ellipse cx={16} cy={16} rx={9} ry={6} fill="none" stroke="#0a1a16" strokeWidth={2.2} />
      <circle cx={16} cy={16} r={3} fill="#0a1a16" />
    </svg>
  );
}
