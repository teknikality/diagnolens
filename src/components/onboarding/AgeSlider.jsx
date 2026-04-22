import { DL_COLORS } from '../../tokens.js';

export default function AgeSlider({ value, onChange, min, max }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 72, fontWeight: 700, color: DL_COLORS.accent,
          letterSpacing: '-0.04em', lineHeight: 1,
        }}>{value}</span>
        <span style={{ fontSize: 18, color: DL_COLORS.fgMuted, marginLeft: 6 }}>years</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: DL_COLORS.accent, height: 6, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: DL_COLORS.fgMuted }}>{min}</span>
        <span style={{ fontSize: 11, color: DL_COLORS.fgMuted }}>{max}</span>
      </div>
    </div>
  );
}
