import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';

export default function ChipSelect({ options, value, onChange }) {
  const getId    = opt => (typeof opt === 'string' ? opt : opt.id);
  const getLabel = opt => (typeof opt === 'string' ? opt : opt.label);

  const toggle = (opt) => {
    const id  = getId(opt);
    const cur = value || [];
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const id       = getId(opt);
        const label    = getLabel(opt);
        const selected = (value || []).includes(id);
        return (
          <button
            key={id}
            onClick={() => toggle(opt)}
            style={{
              padding: '10px 16px', borderRadius: 100, cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
              border: `1px solid ${selected ? DL_COLORS.accent : DL_COLORS.border}`,
              background: selected ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
              color: selected ? DL_COLORS.accent : DL_COLORS.fgSecondary,
              transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {selected && <Icon name="check" size={14} style={{ color: DL_COLORS.accent }} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
