// DiagnoLens — Shared Primitives & Design Tokens
// No hardcoded report data — all data comes from the API at runtime

// API_BASE resolution order:
//   1. dl_config.js override (edit that file to pin a URL)
//   2. Auto-detect from the hostname serving this page (works on LAN)
//   3. Fall back to localhost for file:// and local dev
const _cfg = window.DL_CONFIG?.API_BASE;
const _h   = window.location.hostname;
const API_BASE = _cfg
  ? _cfg
  : (!_h || _h === 'localhost' || _h === '127.0.0.1')
    ? 'http://localhost:8000'
    : `http://${_h}:8000`;

const DL_COLORS = {
  bgBase: '#1C1C1E', bgSurface: '#252528', bgRaised: '#2E2E32',
  border: '#3A3A3E', borderDefault: '#4A4A50',
  fgPrimary: '#F2F2F7', fgSecondary: '#A0A0AB', fgMuted: '#636369',
  accent: '#00C9A7', accentHover: '#00B396', accentDim: 'rgba(0,201,167,0.12)',
  accentBorder: 'rgba(0,201,167,0.25)',
  normal: '#34D399', normalBg: 'rgba(52,211,153,0.10)',
  caution: '#FBBF24', cautionBg: 'rgba(251,191,36,0.10)',
  warning: '#F87171', warningBg: 'rgba(248,113,113,0.10)',
  info: '#60A5FA', infoBg: 'rgba(96,165,250,0.10)',
};

const STATUS_META = {
  normal:  { label: 'In range',   color: DL_COLORS.normal,  bg: DL_COLORS.normalBg },
  caution: { label: 'Borderline', color: DL_COLORS.caution, bg: DL_COLORS.cautionBg },
  warning: { label: 'Elevated',   color: DL_COLORS.warning, bg: DL_COLORS.warningBg },
  info:    { label: 'Unknown',    color: DL_COLORS.info,    bg: DL_COLORS.infoBg },
};

// Maps API status strings (NORMAL/HIGH/LOW/BORDERLINE/UNKNOWN) to UI status keys
function mapApiStatus(apiStatus) {
  const map = {
    NORMAL: 'normal',
    HIGH: 'warning',
    LOW: 'warning',
    BORDERLINE: 'caution',
    UNKNOWN: 'info',
  };
  return map[(apiStatus || '').toUpperCase()] || 'info';
}

// Normalise a raw API biomarker into the shape the UI components expect
function normaliseBiomarker(b) {
  return {
    name:           b.name            || 'Unknown',
    value:          String(b.value    || '—'),
    unit:           b.unit            || '',
    reference_range: b.reference_range || '',
    status:         mapApiStatus(b.status),
    apiStatus:      (b.status || '').toUpperCase(),
    category:       b.category        || 'General',
    is_abnormal:    !!b.is_abnormal,
    insight: {
      meaning: b.insight?.meaning || '',
      advice:  Array.isArray(b.insight?.advice) ? b.insight.advice : [],
    },
  };
}

// ── Logo SVG ──────────────────────────────────────────────────

function DLLogo({ size = 26 }) {
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 32 32',
    style: { borderRadius: 6, flexShrink: 0, display: 'block' },
  },
    React.createElement('rect', { width: 32, height: 32, rx: 6, fill: '#00C9A7' }),
    React.createElement('ellipse', { cx: 16, cy: 16, rx: 9, ry: 6, fill: 'none', stroke: '#0a1a16', strokeWidth: 2.2 }),
    React.createElement('circle', { cx: 16, cy: 16, r: 3, fill: '#0a1a16' })
  );
}

// ── Icon Component ────────────────────────────────────────────

function Icon({ name, size = 16, color = 'currentColor', style: extraStyle }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
    try { window.lucide.createIcons({ el: ref.current }); } catch(e) {}
    const svg = ref.current.querySelector('svg');
    if (svg) {
      svg.style.width = size + 'px';
      svg.style.height = size + 'px';
      svg.style.display = 'block';
      svg.style.flexShrink = '0';
      if (color !== 'currentColor') svg.style.color = color;
    }
  }, [name, size, color]);
  return React.createElement('span', {
    ref,
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...extraStyle }
  });
}

// ── Primitive Components ──────────────────────────────────────

function Button({ children, variant = 'primary', size = 'md', onClick, disabled, style: extraStyle }) {
  const [hov, setHov] = React.useState(false);
  const base = {
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, border: 'none',
    borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 7,
    transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
    opacity: disabled ? 0.45 : 1,
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
    padding: size === 'sm' ? '7px 14px' : size === 'lg' ? '13px 28px' : '10px 20px',
    letterSpacing: '-0.01em',
    transform: hov && !disabled ? 'scale(0.99)' : 'scale(1)',
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary:   { background: hov ? DL_COLORS.accentHover : DL_COLORS.accent, color: '#0a1a16' },
    secondary: { background: hov ? DL_COLORS.accentBorder : DL_COLORS.accentDim, color: DL_COLORS.accent, border: `1px solid ${DL_COLORS.accentBorder}` },
    ghost:     { background: hov ? 'rgba(255,255,255,0.05)' : 'transparent', color: DL_COLORS.fgPrimary, border: `1px solid ${DL_COLORS.borderDefault}` },
    danger:    { background: 'rgba(248,113,113,0.12)', color: DL_COLORS.warning, border: '1px solid rgba(248,113,113,0.25)' },
    link:      { background: 'transparent', color: hov ? DL_COLORS.accent : DL_COLORS.fgMuted, padding: 0, border: 'none', fontSize: 13 },
  };
  return React.createElement('button', {
    style: { ...base, ...variants[variant], ...extraStyle },
    onClick, disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  }, children);
}

function Badge({ status = 'normal', children }) {
  const meta = STATUS_META[status] || STATUS_META.info;
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
      background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`,
      fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
    }
  },
    React.createElement('span', { style: { width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 } }),
    children || meta.label
  );
}

function Card({ children, style, hover, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return React.createElement('div', {
    style: {
      background: DL_COLORS.bgSurface,
      border: `1px solid ${hover && hovered ? 'rgba(0,201,167,0.35)' : DL_COLORS.border}`,
      borderRadius: 12, padding: '18px 20px',
      boxShadow: hover && hovered ? '0 4px 16px rgba(0,201,167,0.08)' : '0 2px 8px rgba(0,0,0,0.4)',
      transition: 'border-color 150ms, box-shadow 150ms',
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
  }, children);
}

function ValueDisplay({ value, unit, status = 'normal' }) {
  const meta = STATUS_META[status] || STATUS_META.info;
  return React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 5 } },
    React.createElement('span', {
      style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em', color: meta.color }
    }, value),
    React.createElement('span', {
      style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted }
    }, unit)
  );
}

function SectionLabel({ children }) {
  return React.createElement('div', {
    style: { fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.fgMuted, marginBottom: 12 }
  }, children);
}

function NavItem({ icon, label, active, onClick }) {
  const [hov, setHov] = React.useState(false);
  const col = active ? DL_COLORS.accent : hov ? DL_COLORS.fgPrimary : DL_COLORS.fgSecondary;
  return React.createElement('div', {
    onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
      background: active ? DL_COLORS.accentDim : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
      color: col, fontSize: 13, fontWeight: active ? 500 : 400,
      transition: 'all 150ms', userSelect: 'none',
    }
  },
    React.createElement(Icon, { name: icon, size: 16, style: { color: col } }),
    label
  );
}

// Empty state shown when report data is missing
function EmptyState({ message = 'No data available.' }) {
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', color: DL_COLORS.fgMuted, textAlign: 'center', gap: 12,
    }
  },
    React.createElement(Icon, { name: 'file-x', size: 32, style: { color: DL_COLORS.fgMuted, opacity: 0.4 } }),
    React.createElement('div', { style: { fontSize: 14 } }, message)
  );
}

Object.assign(window, {
  API_BASE,
  DL_COLORS, STATUS_META,
  mapApiStatus, normaliseBiomarker,
  DLLogo, Icon, Button, Badge, Card, ValueDisplay, SectionLabel, NavItem, EmptyState,
});
