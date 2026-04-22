// DiagnoLens — App Shell

function AppShell({ currentView, onNavigate, children }) {
  const [collapsed, setCollapsed] = React.useState(true);

  const navItems = [
    { id: 'dashboard', icon: 'activity',      label: 'Dashboard' },
    { id: 'reports',   icon: 'file-text',      label: 'My reports' },
    { id: 'trends',    icon: 'trending-up',    label: 'Trends' },
    { id: 'ask',       icon: 'message-circle', label: 'Ask DiagnoLens' },
  ];

  const titleMap = {
    dashboard: 'Dashboard', reports: 'My reports',
    trends: 'Trends', ask: 'Ask DiagnoLens', detail: 'Biomarker detail',
  };

  const sidebarW = collapsed ? 56 : 220;

  return React.createElement('div', {
    style: {
      display: 'flex', height: 'calc(var(--vh, 1vh) * 100)', overflow: 'hidden',
      background: DL_COLORS.bgBase, fontFamily: "'DM Sans', sans-serif",
    }
  },
    // ── Sidebar ──────────────────────────────────────────────
    React.createElement('div', {
      style: {
        width: sidebarW, flexShrink: 0,
        background: DL_COLORS.bgBase,
        borderRight: `1px solid ${DL_COLORS.border}`,
        display: 'flex', flexDirection: 'column',
        padding: collapsed ? '0 8px' : '0 10px',
        transition: 'width 220ms cubic-bezier(0.16,1,0.3,1), padding 220ms',
        overflow: 'hidden',
      }
    },
      // Logo row
      React.createElement('div', {
        style: {
          padding: collapsed ? '16px 0' : '18px 10px 16px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          borderBottom: `1px solid ${DL_COLORS.border}`, marginBottom: 8,
          transition: 'padding 220ms, justify-content 220ms',
        }
      },
        React.createElement(DLLogo, { size: 28 }),
        !collapsed && React.createElement('span', {
          style: {
            fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }
        }, 'DiagnoLens')
      ),

      // Nav items
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 } },
        navItems.map(item =>
          React.createElement(SideNavItem, {
            key: item.id, icon: item.icon, label: item.label,
            active: currentView === item.id || (currentView === 'detail' && item.id === 'dashboard'),
            collapsed,
            onClick: () => onNavigate(item.id),
          })
        )
      ),

      // Upload dashed button
      React.createElement('div', { style: { padding: collapsed ? '12px 0' : '12px 2px' } },
        React.createElement(UploadNavBtn, { onClick: () => onNavigate('upload'), collapsed })
      ),

      // Profile row
      React.createElement('div', {
        style: {
          borderTop: `1px solid ${DL_COLORS.border}`,
          padding: collapsed ? '12px 0' : '12px 4px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 10,
          overflow: 'hidden',
        }
      },
        React.createElement('div', {
          style: {
            width: 28, height: 28, borderRadius: '50%',
            background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: DL_COLORS.accent, fontSize: 11, fontWeight: 600, flexShrink: 0,
          }
        }, 'JD'),
        !collapsed && React.createElement(React.Fragment, null,
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 12, fontWeight: 500, color: DL_COLORS.fgPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, 'Jane Doe'),
            React.createElement('div', { style: { fontSize: 10, color: DL_COLORS.fgMuted } }, '3 reports')
          ),
          React.createElement(Icon, { name: 'settings', size: 14, style: { color: DL_COLORS.fgMuted, cursor: 'pointer', flexShrink: 0 } })
        )
      )
    ),

    // ── Main content area ─────────────────────────────────────
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 } },
      // Topbar
      React.createElement('div', {
        style: {
          height: 52, flexShrink: 0, borderBottom: `1px solid ${DL_COLORS.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px 0 16px',
        }
      },
        // Left: toggle + title
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('button', {
            onClick: () => setCollapsed(c => !c),
            title: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
            style: {
              background: 'none', border: 'none', cursor: 'pointer', padding: 6,
              borderRadius: 7, color: DL_COLORS.fgMuted,
              display: 'flex', alignItems: 'center',
              transition: 'background 150ms, color 150ms',
            },
            onMouseEnter: e => { e.currentTarget.style.background = DL_COLORS.bgRaised; e.currentTarget.style.color = DL_COLORS.fgPrimary; },
            onMouseLeave: e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DL_COLORS.fgMuted; },
          },
            React.createElement(Icon, { name: collapsed ? 'panel-left-open' : 'panel-left-close', size: 16 })
          ),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: DL_COLORS.fgPrimary } },
            titleMap[currentView] || currentView
          )
        ),

        // Right: search + bell
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('div', {
            style: {
              display: 'flex', alignItems: 'center', gap: 8,
              background: DL_COLORS.bgRaised, borderRadius: 8,
              padding: '6px 12px', border: `1px solid ${DL_COLORS.border}`, cursor: 'text',
            }
          },
            React.createElement(Icon, { name: 'search', size: 13, style: { color: DL_COLORS.fgMuted } }),
            React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.fgMuted } }, 'Search biomarkers…')
          ),
          React.createElement('div', {
            style: {
              display: 'flex', alignItems: 'center', padding: '5px 10px',
              background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
              borderRadius: 8, cursor: 'pointer',
            }
          },
            React.createElement(Icon, { name: 'bell', size: 13, style: { color: DL_COLORS.fgMuted } })
          )
        )
      ),

      // Scrollable content
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 28px' } },
        children
      )
    )
  );
}

// ── Sidebar nav item (collapse-aware) ─────────────────────────

function SideNavItem({ icon, label, active, collapsed, onClick }) {
  const [hov, setHov] = React.useState(false);
  const col = active ? DL_COLORS.accent : hov ? DL_COLORS.fgPrimary : DL_COLORS.fgSecondary;

  return React.createElement('div', {
    onClick,
    title: collapsed ? label : undefined,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'flex', alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      gap: collapsed ? 0 : 10,
      padding: collapsed ? '9px 0' : '8px 12px',
      borderRadius: 8, cursor: 'pointer',
      background: active ? DL_COLORS.accentDim : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
      color: col,
      fontSize: 13, fontWeight: active ? 500 : 400,
      transition: 'all 150ms',
      userSelect: 'none',
      overflow: 'hidden', whiteSpace: 'nowrap',
    }
  },
    React.createElement(Icon, { name: icon, size: 16, style: { color: col, flexShrink: 0 } }),
    !collapsed && React.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, label)
  );
}

// ── Upload button (collapse-aware) ────────────────────────────

function UploadNavBtn({ onClick, collapsed }) {
  const [hov, setHov] = React.useState(false);
  return React.createElement('div', {
    onClick,
    title: collapsed ? 'Upload report' : undefined,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'flex', alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      gap: collapsed ? 0 : 9,
      padding: collapsed ? '9px 0' : '9px 12px',
      borderRadius: 8, cursor: 'pointer',
      border: `1px dashed ${hov ? DL_COLORS.accent : DL_COLORS.borderDefault}`,
      color: hov ? DL_COLORS.accent : DL_COLORS.fgMuted, fontSize: 13,
      background: hov ? DL_COLORS.accentDim : 'transparent',
      transition: 'all 150ms',
      overflow: 'hidden', whiteSpace: 'nowrap',
    }
  },
    React.createElement(Icon, { name: 'upload-cloud', size: 15, style: { color: hov ? DL_COLORS.accent : DL_COLORS.fgMuted, flexShrink: 0 } }),
    !collapsed && 'Upload report'
  );
}

Object.assign(window, { AppShell });
