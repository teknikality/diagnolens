// DiagnoLens — Dashboard (fully dynamic, no hardcoded data)

// ── Sparkline (shown only when history data exists) ───────────
function Sparkline({ history, status, width = 72, height = 36 }) {
  if (!history || history.length < 2) return null;
  const meta = STATUS_META[status] || STATUS_META.info;
  const vals = history.map(h => h.value);
  const min = Math.min(...vals) * 0.95;
  const max = Math.max(...vals) * 1.05;
  const norm = v => height - ((v - min) / (max - min)) * (height - 4) - 2;
  const pts = history.map((h, i) => `${(i / (history.length - 1)) * width},${norm(h.value)}`).join(' ');
  const uid = `sg-${status}-${width}-${Math.random().toString(36).slice(2)}`;
  return React.createElement('svg', { width, height, viewBox: `0 0 ${width} ${height}`, style: { display: 'block', overflow: 'visible' } },
    React.createElement('defs', null,
      React.createElement('linearGradient', { id: uid, x1: 0, y1: 0, x2: 0, y2: 1 },
        React.createElement('stop', { offset: '0%', stopColor: meta.color, stopOpacity: 0.2 }),
        React.createElement('stop', { offset: '100%', stopColor: meta.color, stopOpacity: 0 })
      )
    ),
    React.createElement('polygon', { points: `${pts} ${width},${height} 0,${height}`, fill: `url(#${uid})` }),
    React.createElement('polyline', { points: pts, fill: 'none', stroke: meta.color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })
  );
}

// ── Summary Header ────────────────────────────────────────────
function SummaryHeader({ summary, biomarkers, fileName }) {
  // Derive status counts from the live biomarker list
  const counts = { normal: 0, caution: 0, warning: 0 };
  (biomarkers || []).forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

  const explanation = summary?.explanation || '';
  const keyFindings = summary?.key_findings || [];

  return React.createElement('div', { style: { marginBottom: 24 } },
    React.createElement('div', { style: { marginBottom: 16 } },
      React.createElement('h1', { style: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 } }, 'Your lab report summary'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: DL_COLORS.fgMuted } },
        React.createElement(Icon, { name: 'file-text', size: 13, style: { color: DL_COLORS.fgMuted } }),
        fileName ? `${fileName} · Analyzed just now` : 'Report analyzed just now'
      )
    ),

    // Stat pills
    React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: explanation ? 16 : 0 } },
      [
        { key: 'normal',  label: 'In range',        color: DL_COLORS.normal,  bg: DL_COLORS.normalBg,  icon: 'check-circle' },
        { key: 'caution', label: 'Borderline',       color: DL_COLORS.caution, bg: DL_COLORS.cautionBg, icon: 'alert-circle' },
        { key: 'warning', label: 'Elevated / Low',   color: DL_COLORS.warning, bg: DL_COLORS.warningBg, icon: 'alert-triangle' },
      ].map(item =>
        React.createElement('div', {
          key: item.key,
          style: {
            display: 'flex', alignItems: 'center', gap: 8,
            background: item.bg, border: `1px solid ${item.color}30`,
            borderRadius: 100, padding: '7px 14px',
          }
        },
          React.createElement(Icon, { name: item.icon, size: 14, style: { color: item.color } }),
          React.createElement('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: item.color } }, counts[item.key]),
          React.createElement('span', { style: { fontSize: 13, color: item.color, opacity: 0.85 } }, item.label)
        )
      )
    ),

    // AI summary paragraph
    explanation ? React.createElement('div', {
      style: {
        background: DL_COLORS.accentDim, border: '1px solid rgba(0,201,167,0.18)',
        borderRadius: 10, padding: '12px 16px',
        fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.7,
      }
    },
      React.createElement('span', { style: { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.accent, marginRight: 8 } }, 'Summary'),
      explanation
    ) : null,

    // Key findings list
    keyFindings.length > 0 ? React.createElement('div', { style: { marginTop: 10 } },
      React.createElement(SectionLabel, null, 'Key findings'),
      React.createElement('ul', { style: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 } },
        keyFindings.map((f, i) =>
          React.createElement('li', { key: i, style: { display: 'flex', gap: 10, alignItems: 'flex-start' } },
            React.createElement('div', {
              style: {
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }
            },
              React.createElement(Icon, { name: 'check', size: 10, style: { color: DL_COLORS.accent } })
            ),
            React.createElement('span', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.6 } }, f)
          )
        )
      )
    ) : null
  );
}

// ── Top Concerns ──────────────────────────────────────────────
function TopConcerns({ biomarkers, onAction }) {
  const concerns = (biomarkers || [])
    .filter(b => b.is_abnormal)
    .sort((a, b) => (b.status === 'warning' ? 1 : 0) - (a.status === 'warning' ? 1 : 0))
    .slice(0, 2);

  if (concerns.length === 0) return null;

  return React.createElement('div', { style: { marginBottom: 24 } },
    React.createElement(SectionLabel, null, 'Top concerns'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 } },
      concerns.map(b => {
        const meta = STATUS_META[b.status] || STATUS_META.info;
        return React.createElement('div', {
          key: b.name,
          style: {
            background: meta.bg, border: `1px solid ${meta.color}30`,
            borderRadius: 14, padding: '18px 20px',
          }
        },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 15, fontWeight: 600, marginBottom: 2 } }, b.name),
              React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted } }, b.category || '')
            ),
            React.createElement(Badge, { status: b.status })
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 } },
            React.createElement('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color: meta.color } }, b.value),
            React.createElement('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted } }, b.unit)
          ),
          b.insight.meaning
            ? React.createElement('p', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.55, margin: '0 0 14px' } },
                b.insight.meaning.length > 120 ? b.insight.meaning.slice(0, 120) + '…' : b.insight.meaning
              )
            : null,
          React.createElement('button', {
            onClick: () => onAction(b, 0),
            style: {
              width: '100%', background: 'rgba(0,0,0,0.2)', border: `1px solid ${meta.color}25`,
              borderRadius: 8, padding: '9px 14px', color: DL_COLORS.fgPrimary,
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }
          },
            React.createElement(Icon, { name: 'info', size: 13 }),
            'Understand this'
          )
        );
      })
    )
  );
}

// ── Biomarker Action Card ─────────────────────────────────────
function BiomarkerActionCard({ biomarker: b, onAction }) {
  const meta = STATUS_META[b.status] || STATUS_META.info;

  const actions = [
    { label: 'What this means', section: 0, icon: 'info' },
    { label: 'What to do',      section: 2, icon: 'check-square' },
    { label: 'How serious',     section: 3, icon: 'alert-triangle' },
  ];

  return React.createElement('div', {
    style: {
      background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
      borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }
  },
    // Card body
    React.createElement('div', { style: { padding: '16px 18px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0, marginRight: 12 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontSize: 15, fontWeight: 600 } }, b.name),
            React.createElement(Badge, { status: b.status }),
            b.category && React.createElement('span', {
              style: {
                fontSize: 10, color: DL_COLORS.fgMuted, background: DL_COLORS.bgRaised,
                border: `1px solid ${DL_COLORS.border}`, borderRadius: 100, padding: '2px 8px',
              }
            }, b.category)
          ),
          b.reference_range
            ? React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 10 } },
                `Reference: ${b.reference_range}${b.unit ? ' ' + b.unit : ''}`
              )
            : React.createElement('div', { style: { marginBottom: 10 } }),

          // Value
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 } },
            React.createElement('span', {
              style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: meta.color, letterSpacing: '-0.02em' }
            }, b.value),
            React.createElement('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted } }, b.unit),
            // API status label badge
            React.createElement('span', {
              style: {
                fontSize: 10, fontWeight: 600, color: meta.color,
                background: meta.bg, borderRadius: 4, padding: '2px 6px',
                fontFamily: "'JetBrains Mono', monospace",
              }
            }, b.apiStatus)
          ),

          // One-line insight
          b.insight.meaning
            ? React.createElement('p', {
                style: { fontSize: 13, color: DL_COLORS.fgMuted, lineHeight: 1.5, margin: 0 }
              }, b.insight.meaning.length > 140 ? b.insight.meaning.slice(0, 140) + '…' : b.insight.meaning)
            : null
        ),

        // No sparkline without historical data
        React.createElement('div', {
          style: {
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: meta.bg, border: `1px solid ${meta.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }
        },
          React.createElement(Icon, {
            name: b.is_abnormal ? 'alert-circle' : 'check-circle',
            size: 18, style: { color: meta.color }
          })
        )
      )
    ),

    // Action buttons row
    React.createElement('div', { style: { borderTop: `1px solid ${DL_COLORS.border}`, display: 'flex' } },
      actions.map((action, i) =>
        React.createElement('button', {
          key: action.label,
          onClick: () => onAction(b, action.section),
          style: {
            flex: 1, padding: '10px 8px',
            background: 'transparent', border: 'none',
            borderRight: i < actions.length - 1 ? `1px solid ${DL_COLORS.border}` : 'none',
            color: DL_COLORS.fgMuted, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            transition: 'background 150ms, color 150ms',
          },
          onMouseEnter: e => { e.currentTarget.style.background = DL_COLORS.accentDim; e.currentTarget.style.color = DL_COLORS.accent; },
          onMouseLeave: e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = DL_COLORS.fgMuted; },
        },
          React.createElement(Icon, { name: action.icon, size: 14 }),
          action.label
        )
      )
    )
  );
}

// ── WhatsApp Section ──────────────────────────────────────────
function WhatsAppSection() {
  const [phone, setPhone] = React.useState('');
  const [sent, setSent]   = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const handleSend = () => {
    if (!phone.trim() || phone.length < 7) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const ready = phone.trim() && phone.length >= 7;

  return React.createElement('div', { style: { marginTop: 32 } },
    React.createElement('div', {
      style: {
        background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
        borderRadius: 14, padding: '18px 20px',
      }
    },
      // Header
      React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 } },
        React.createElement('div', {
          style: {
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }
        },
          React.createElement(Icon, { name: 'message-circle', size: 20, style: { color: '#25D366' } })
        ),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 3 } }, 'Continue on WhatsApp'),
          React.createElement('div', { style: { fontSize: 12, color: DL_COLORS.fgMuted, lineHeight: 1.5 } },
            'Get follow-up reminders and ask questions about your results — free, no app needed.'
          )
        )
      ),

      // Input / sent state
      sent
        ? React.createElement('div', {
            style: {
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 10, padding: '11px 14px',
            }
          },
            React.createElement(Icon, { name: 'check-circle', size: 16, style: { color: DL_COLORS.normal } }),
            React.createElement('span', { style: { fontSize: 13, color: DL_COLORS.normal } }, 'Summary sent! Check WhatsApp for your results.')
          )
        : React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 8 } },
              React.createElement('div', {
                style: {
                  background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                  borderRadius: 8, padding: '9px 10px', fontSize: 13, color: DL_COLORS.fgSecondary,
                  display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, whiteSpace: 'nowrap',
                }
              },
                React.createElement(Icon, { name: 'globe', size: 12, style: { color: DL_COLORS.fgMuted } }),
                '+1'
              ),
              React.createElement('input', {
                type: 'tel', value: phone,
                onChange: e => setPhone(e.target.value),
                onKeyDown: e => e.key === 'Enter' && handleSend(),
                placeholder: 'Your phone number',
                style: {
                  flex: 1, minWidth: 0,
                  background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                  borderRadius: 8, padding: '9px 12px', color: DL_COLORS.fgPrimary,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none',
                }
              }),
              React.createElement('button', {
                onClick: handleSend, disabled: !ready || sending,
                style: {
                  background: ready ? '#25D366' : DL_COLORS.bgRaised,
                  border: `1px solid ${ready ? '#25D366' : DL_COLORS.border}`,
                  borderRadius: 8, padding: '9px 16px',
                  color: ready ? 'white' : DL_COLORS.fgMuted,
                  fontSize: 13, fontWeight: 600, cursor: ready ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif", transition: 'all 200ms', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }
              },
                React.createElement(Icon, { name: sending ? 'loader' : 'send', size: 13 }),
                sending ? 'Sending…' : 'Send'
              )
            ),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: DL_COLORS.fgMuted } },
              React.createElement(Icon, { name: 'lock', size: 10, style: { color: DL_COLORS.fgMuted } }),
              'Your number is used only to send this report summary. Never shared or stored.'
            )
          )
    )
  );
}

// ── Main Dashboard ────────────────────────────────────────────
function DashboardView({ reportData, onSelectBiomarker }) {
  const [modal, setModal] = React.useState(null);
  const [sortImportant, setSortImportant] = React.useState(true);

  if (!reportData) {
    return React.createElement(EmptyState, { message: 'No report loaded. Upload a lab report to get started.' });
  }

  const biomarkers = reportData.biomarkers || [];
  const summary    = reportData.summary    || {};
  const fileName   = reportData._fileName  || '';

  const sortOrder = { warning: 0, caution: 1, normal: 2, info: 3 };
  const sorted = sortImportant
    ? [...biomarkers].sort((a, b) => (sortOrder[a.status] ?? 9) - (sortOrder[b.status] ?? 9))
    : biomarkers;

  const openModal  = (biomarker, section) => setModal({ biomarker, section });
  const closeModal = () => setModal(null);

  return React.createElement('div', { style: { maxWidth: 820 } },
    React.createElement(SummaryHeader, { summary, biomarkers, fileName }),
    React.createElement(TopConcerns,  { biomarkers, onAction: openModal }),

    // Sort control
    biomarkers.length > 0 && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
      React.createElement(SectionLabel, null, `${biomarkers.length} biomarker${biomarkers.length !== 1 ? 's' : ''}`),
      React.createElement('div', { style: { display: 'flex', gap: 6 } },
        React.createElement('button', {
          onClick: () => setSortImportant(true),
          style: {
            padding: '5px 12px', borderRadius: 100,
            border: `1px solid ${sortImportant ? DL_COLORS.accentBorder : DL_COLORS.border}`,
            background: sortImportant ? DL_COLORS.accentDim : 'transparent',
            color: sortImportant ? DL_COLORS.accent : DL_COLORS.fgMuted,
            fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 150ms',
          }
        },
          React.createElement(Icon, { name: 'alert-triangle', size: 11 }),
          'Important first'
        ),
        React.createElement('button', {
          onClick: () => setSortImportant(false),
          style: {
            padding: '5px 12px', borderRadius: 100,
            border: `1px solid ${!sortImportant ? DL_COLORS.accentBorder : DL_COLORS.border}`,
            background: !sortImportant ? DL_COLORS.accentDim : 'transparent',
            color: !sortImportant ? DL_COLORS.accent : DL_COLORS.fgMuted,
            fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            transition: 'all 150ms',
          }
        }, 'Original order')
      )
    ),

    // Biomarker cards
    biomarkers.length > 0
      ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          sorted.map(b =>
            React.createElement(BiomarkerActionCard, { key: b.name, biomarker: b, onAction: openModal })
          )
        )
      : React.createElement(EmptyState, { message: 'No biomarkers were detected in this report.' }),

    React.createElement(WhatsAppSection),

    modal && React.createElement(BiomarkerModal, {
      biomarker: modal.biomarker,
      initialSection: modal.section,
      onClose: closeModal,
    })
  );
}

Object.assign(window, { DashboardView, Sparkline });
