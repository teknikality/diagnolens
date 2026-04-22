import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';

export default function OptionSelect({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              width: '100%', padding: '14px 18px',
              border: `1px solid ${selected ? DL_COLORS.accent : DL_COLORS.border}`,
              borderRadius: 12, cursor: 'pointer',
              background: selected ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
              color: selected ? DL_COLORS.accent : DL_COLORS.fgSecondary,
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              textAlign: 'left', transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            {opt}
            {selected && <Icon name="check-circle" size={18} style={{ color: DL_COLORS.accent }} />}
          </button>
        );
      })}
    </div>
  );
}
