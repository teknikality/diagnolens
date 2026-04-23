import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';

export default function OptionSelect({ options, value, onChange }) {
  const getId    = opt => (typeof opt === 'string' ? opt : opt.id);
  const getLabel = opt => (typeof opt === 'string' ? opt : opt.label);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const id       = getId(opt);
        const label    = getLabel(opt);
        const selected = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              width: '100%', padding: '14px 18px',
              border: `1px solid ${selected ? DL_COLORS.accent : DL_COLORS.border}`,
              borderRadius: 12, cursor: 'pointer',
              background: selected ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
              color: selected ? DL_COLORS.accent : DL_COLORS.fgSecondary,
              fontSize: 15, fontWeight: 500,
              textAlign: 'left', transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            {label}
            {selected && <Icon name="check-circle" size={18} style={{ color: DL_COLORS.accent }} />}
          </button>
        );
      })}
    </div>
  );
}
