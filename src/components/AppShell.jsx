import { useState } from 'react';
import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';
import DLLogo from './DLLogo.jsx';
import { useLang, LanguageSwitcher } from '../i18n/LangContext.jsx';

function SideNavItem({ icon, label, active, collapsed, onClick }) {
  const [hov, setHov] = useState(false);
  const col = active ? DL_COLORS.accent : hov ? DL_COLORS.fgPrimary : DL_COLORS.fgSecondary;

  return (
    <div
      onClick={onClick}
      title={collapsed ? label : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? '9px 0' : '8px 12px',
        borderRadius: 8, cursor: 'pointer',
        background: active ? DL_COLORS.accentDim : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: col, fontSize: 13, fontWeight: active ? 500 : 400,
        transition: 'all 150ms', userSelect: 'none',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={16} style={{ color: col, flexShrink: 0 }} />
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
    </div>
  );
}

function UploadNavBtn({ label, onClick, collapsed }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      title={collapsed ? label : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 9,
        padding: collapsed ? '9px 0' : '9px 12px',
        borderRadius: 8, cursor: 'pointer',
        border: `1px dashed ${hov ? DL_COLORS.accent : DL_COLORS.borderDefault}`,
        color: hov ? DL_COLORS.accent : DL_COLORS.fgMuted, fontSize: 13,
        background: hov ? DL_COLORS.accentDim : 'transparent',
        transition: 'all 150ms', overflow: 'hidden', whiteSpace: 'nowrap',
      }}
    >
      <Icon name="upload-cloud" size={15} style={{ color: hov ? DL_COLORS.accent : DL_COLORS.fgMuted, flexShrink: 0 }} />
      {!collapsed && label}
    </div>
  );
}

export default function AppShell({ currentView, onNavigate, onLogout, children }) {
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { id: 'dashboard', icon: 'activity',      label: t('nav.dashboard') },
    { id: 'reports',   icon: 'file-text',      label: t('nav.reports') },
    { id: 'trends',    icon: 'trending-up',    label: t('nav.trends') },
    { id: 'ask',       icon: 'message-circle', label: t('nav.ask') },
  ];

  const titleMap = {
    dashboard: t('nav.dashboard'),
    reports:   t('nav.reports'),
    trends:    t('nav.trends'),
    ask:       t('nav.ask'),
    detail:    t('nav.detail'),
  };

  const sidebarW = collapsed ? 56 : 220;

  return (
    <div style={{
      display: 'flex', height: 'calc(var(--vh, 1vh) * 100)', overflow: 'hidden',
      background: DL_COLORS.bgBase,
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarW, flexShrink: 0,
        background: DL_COLORS.bgBase,
        borderRight: `1px solid ${DL_COLORS.border}`,
        display: 'flex', flexDirection: 'column',
        padding: collapsed ? '0 8px' : '0 10px',
        transition: 'width 220ms cubic-bezier(0.16,1,0.3,1), padding 220ms',
        overflow: 'hidden',
      }}>
        {/* Logo row */}
        <div style={{
          padding: collapsed ? '16px 0' : '18px 10px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          borderBottom: `1px solid ${DL_COLORS.border}`, marginBottom: 8,
          transition: 'padding 220ms',
        }}>
          <DLLogo size={28} />
          {!collapsed && (
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              DiagnoLens
            </span>
          )}
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
          {navItems.map(item => (
            <SideNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentView === item.id || (currentView === 'detail' && item.id === 'dashboard')}
              collapsed={collapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        {/* Upload button */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 2px' }}>
          <UploadNavBtn label={t('nav.upload')} onClick={() => onNavigate('upload')} collapsed={collapsed} />
        </div>

        {/* Language switcher (expanded only) */}
        {!collapsed && (
          <div style={{ padding: '0 2px 10px', display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </div>
        )}

        {/* Profile row */}
        <div style={{
          borderTop: `1px solid ${DL_COLORS.border}`,
          padding: collapsed ? '12px 0' : '12px 4px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 10, overflow: 'hidden',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: DL_COLORS.accent, fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>JD</div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: DL_COLORS.fgPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Jane Doe</div>
                <div style={{ fontSize: 10, color: DL_COLORS.fgMuted }}>{t('nav.reportsCount', { n: 3 })}</div>
              </div>
              <button
                onClick={onLogout}
                title={t('nav.signOut')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                  color: DL_COLORS.fgMuted, display: 'flex', alignItems: 'center', flexShrink: 0,
                  transition: 'color 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.color = DL_COLORS.warning}
                onMouseLeave={e => e.currentTarget.style.color = DL_COLORS.fgMuted}
              >
                <Icon name="log-out" size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          height: 52, flexShrink: 0, borderBottom: `1px solid ${DL_COLORS.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px 0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                borderRadius: 7, color: DL_COLORS.fgMuted,
                display: 'flex', alignItems: 'center', transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = DL_COLORS.bgRaised; e.currentTarget.style.color = DL_COLORS.fgPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DL_COLORS.fgMuted; }}
            >
              <Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} size={16} />
            </button>
            <div style={{ fontSize: 14, fontWeight: 500, color: DL_COLORS.fgPrimary }}>
              {titleMap[currentView] || currentView}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: DL_COLORS.bgRaised, borderRadius: 8,
              padding: '6px 12px', border: `1px solid ${DL_COLORS.border}`, cursor: 'text',
            }}>
              <Icon name="search" size={13} style={{ color: DL_COLORS.fgMuted }} />
              <span style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>{t('nav.searchPlaceholder')}</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', padding: '5px 10px',
              background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
              borderRadius: 8, cursor: 'pointer',
            }}>
              <Icon name="bell" size={13} style={{ color: DL_COLORS.fgMuted }} />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 28px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
