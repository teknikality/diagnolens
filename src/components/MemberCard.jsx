import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';

const AGE_BADGE_COLORS = {
  child:  { bg: 'rgba(99,179,237,0.15)', text: '#63b3ed' },
  adult:  { bg: 'rgba(0,201,167,0.15)',   text: DL_COLORS.accent },
  senior: { bg: 'rgba(237,179,99,0.15)',  text: '#edb363' },
};

export default function MemberCard({ member, onClick }) {
  const { t } = useLang();
  const badge = AGE_BADGE_COLORS[member.age_group] || AGE_BADGE_COLORS.adult;
  const initials = (member.name || '?').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        background: DL_COLORS.bgSurface,
        border: `1px solid ${DL_COLORS.border}`,
        borderRadius: 12, padding: '18px 16px',
        cursor: 'pointer', transition: 'border-color 150ms',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = DL_COLORS.accentBorder}
      onMouseLeave={e => e.currentTarget.style.borderColor = DL_COLORS.border}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: DL_COLORS.accentDim,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: DL_COLORS.accent,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{member.name}</div>
          <div style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>
            {member.age ? `${member.age} yrs` : ''}
            {member.relationship !== 'self' && member.relationship ? ` · ${member.relationship}` : ''}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          padding: '3px 8px', borderRadius: 6,
          background: badge.bg, color: badge.text,
        }}>
          {t(`family.ageGroups.${member.age_group}`) || member.age_group}
        </span>
        <Icon name="chevron-right" size={14} style={{ color: DL_COLORS.fgMuted }} />
      </div>
    </div>
  );
}
