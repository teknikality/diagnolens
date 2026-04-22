import { useState } from 'react';
import { DL_COLORS } from '../tokens.js';

export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, style: extraStyle }) {
  const [hov, setHov] = useState(false);

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

  return (
    <button
      style={{ ...base, ...variants[variant], ...extraStyle }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}
