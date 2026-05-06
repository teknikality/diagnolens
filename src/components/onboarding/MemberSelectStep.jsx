import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';
import { useLang } from '../../i18n/LangContext.jsx';

const AGE_BADGE_COLORS = {
  child:  { bg: 'rgba(99,179,237,0.15)', text: '#63b3ed' },
  adult:  { bg: 'rgba(0,201,167,0.15)',   text: DL_COLORS.accent },
  senior: { bg: 'rgba(237,179,99,0.15)',  text: '#edb363' },
};

export default function MemberSelectStep({ members, activeMember, onSelect }) {
  const { t } = useLang();

  return (
    <div style={{
      minHeight: 'calc(var(--vh, 1vh) * 100)',
      background: DL_COLORS.bgBase, color: DL_COLORS.fgPrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
          {t('onboarding.forWhom') || 'Who is this report for?'}
        </h2>
        <p style={{ fontSize: 14, color: DL_COLORS.fgMuted, textAlign: 'center', marginBottom: 28 }}>
          {t('onboarding.forWhomSub') || 'Select a family member'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {members.map(m => {
            const badge = AGE_BADGE_COLORS[m.age_group] || AGE_BADGE_COLORS.adult;
            const initials = (m.name || '?').slice(0, 2).toUpperCase();
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  width: '100%', padding: '14px 16px',
                  background: DL_COLORS.bgSurface,
                  border: `1px solid ${m.id === activeMember?.id ? DL_COLORS.accent : DL_COLORS.border}`,
                  borderRadius: 12, cursor: 'pointer',
                  color: DL_COLORS.fgPrimary, textAlign: 'left',
                  transition: 'border-color 150ms',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: DL_COLORS.accentDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: DL_COLORS.accent,
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>
                    {m.age ? `${m.age} yrs` : ''}
                    {m.relationship !== 'self' && m.relationship ? ` · ${m.relationship}` : ''}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 6,
                  background: badge.bg, color: badge.text,
                }}>
                  {m.age_group}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
