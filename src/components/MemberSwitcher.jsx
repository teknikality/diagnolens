import { useState, useRef, useEffect } from 'react';
import { useFamily } from '../family/FamilyContext.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';

export default function MemberSwitcher({ collapsed }) {
  const { t } = useLang();
  const { members, activeMember, switchMember } = useFamily();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!activeMember) return null;

  const initials = (activeMember.name || '?').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          width: '100%', padding: collapsed ? '8px' : '8px 12px',
          background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
          borderRadius: 10, cursor: 'pointer', color: DL_COLORS.fgPrimary,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: DL_COLORS.accentMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: DL_COLORS.accent,
        }}>
          {initials}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeMember.name}
              </div>
              <div style={{ fontSize: 11, color: DL_COLORS.fgMuted }}>
                {t('memberSwitcher.label') || 'Viewing as'}
              </div>
            </div>
            <Icon name="chevrons-up-down" size={14} style={{ color: DL_COLORS.fgMuted, flexShrink: 0 }} />
          </>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0,
          marginBottom: 6, background: DL_COLORS.bgSurface,
          border: `1px solid ${DL_COLORS.border}`, borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)', zIndex: 50,
          maxHeight: 240, overflowY: 'auto',
          minWidth: collapsed ? 180 : undefined,
        }}>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => { switchMember(m); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px',
                background: m.id === activeMember.id ? DL_COLORS.bgRaised : 'transparent',
                border: 'none', cursor: 'pointer', color: DL_COLORS.fgPrimary,
                fontSize: 13, textAlign: 'left',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: DL_COLORS.accentMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: DL_COLORS.accent,
              }}>
                {(m.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <span style={{ flex: 1 }}>{m.name}</span>
              {m.id === activeMember.id && <Icon name="check" size={14} style={{ color: DL_COLORS.accent }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
