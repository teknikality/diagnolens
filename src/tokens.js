export const DL_COLORS = {
  bgBase:       '#1C1C1E',
  bgSurface:    '#252528',
  bgRaised:     '#2E2E32',
  border:       '#3A3A3E',
  borderDefault:'#4A4A50',
  fgPrimary:    '#F2F2F7',
  fgSecondary:  '#A0A0AB',
  fgMuted:      '#636369',
  accent:       '#00C9A7',
  accentHover:  '#00B396',
  accentDim:    'rgba(0,201,167,0.12)',
  accentBorder: 'rgba(0,201,167,0.25)',
  normal:       '#34D399',
  normalBg:     'rgba(52,211,153,0.10)',
  caution:      '#FBBF24',
  cautionBg:    'rgba(251,191,36,0.10)',
  warning:      '#F87171',
  warningBg:    'rgba(248,113,113,0.10)',
  info:         '#60A5FA',
  infoBg:       'rgba(96,165,250,0.10)',
};

export const STATUS_META = {
  normal:  { label: 'In range',   color: DL_COLORS.normal,  bg: DL_COLORS.normalBg  },
  caution: { label: 'Borderline', color: DL_COLORS.caution, bg: DL_COLORS.cautionBg },
  warning: { label: 'Elevated',   color: DL_COLORS.warning, bg: DL_COLORS.warningBg },
  info:    { label: 'Unknown',    color: DL_COLORS.info,    bg: DL_COLORS.infoBg    },
};
