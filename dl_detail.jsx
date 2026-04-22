// DiagnoLens — Biomarker Detail View

function DetailView({ biomarker, onBack }) {
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setEntered(true), 30); }, []);

  if (!biomarker) return null;

  const meta = STATUS_META[biomarker.status];

  return React.createElement('div', {
    style: {
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1)',
      maxWidth: 680,
    }
  },
    // Back link
    React.createElement('div', {
      onClick: onBack,
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: DL_COLORS.fgMuted, fontSize: 13, cursor: 'pointer',
        marginBottom: 20, userSelect: 'none', transition: 'color 150ms',
      },
      onMouseEnter: e => e.currentTarget.style.color = DL_COLORS.fgPrimary,
      onMouseLeave: e => e.currentTarget.style.color = DL_COLORS.fgMuted,
    },
      React.createElement(Icon, { name: 'chevron-left', size: 16 }),
      'Back to dashboard'
    ),

    // Header card
    React.createElement(Card, { style: { marginBottom: 12, padding: '22px 24px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 } },
        React.createElement('div', null,
          React.createElement('h2', { style: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 } }, biomarker.name),
          biomarker.category && React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgMuted } }, biomarker.category)
        ),
        React.createElement(Badge, { status: biomarker.status })
      ),

      React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(ValueDisplay, { value: biomarker.value, unit: biomarker.unit, status: biomarker.status })
      ),

      biomarker.reference_range && React.createElement('div', { style: { display: 'flex', gap: 24, flexWrap: 'wrap' } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 3 } }, 'Reference range'),
          React.createElement('div', {
            style: { fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: DL_COLORS.fgSecondary }
          }, biomarker.reference_range)
        ),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 3 } }, 'Status'),
          React.createElement('div', { style: { fontSize: 13, color: meta.color, fontWeight: 500 } }, meta.label)
        )
      )
    ),

    // AI insight panel
    biomarker.insight?.meaning && React.createElement('div', {
      style: {
        background: DL_COLORS.accentDim, border: '1px solid rgba(0,201,167,0.18)',
        borderRadius: 12, padding: '18px 20px', marginBottom: 12,
      }
    },
      React.createElement('div', {
        style: { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.accent, marginBottom: 8 }
      }, 'What this means'),
      React.createElement('p', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.7, margin: 0 } },
        biomarker.insight.meaning
      )
    ),

    // Advice list
    biomarker.insight?.advice?.length > 0 && React.createElement(Card, { style: { marginBottom: 12, padding: '20px 22px' } },
      React.createElement(SectionLabel, null, 'What you can do'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 } },
        biomarker.insight.advice.map((item, i) =>
          React.createElement('div', { key: i, style: { display: 'flex', gap: 12, alignItems: 'flex-start' } },
            React.createElement('div', {
              style: {
                width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }
            },
              React.createElement(Icon, { name: 'check', size: 11, style: { color: DL_COLORS.accent } })
            ),
            React.createElement('span', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 } }, item)
          )
        )
      )
    ),

    // Ask CTA
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
        borderRadius: 12, padding: '14px 18px',
      }
    },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 13, fontWeight: 500, marginBottom: 2 } }, 'Have questions about this result?'),
        React.createElement('div', { style: { fontSize: 12, color: DL_COLORS.fgMuted } }, 'Ask DiagnoLens for a plain-language explanation.')
      ),
      React.createElement(Button, { variant: 'secondary', size: 'sm' },
        React.createElement(Icon, { name: 'message-circle', size: 13 }),
        `Ask about ${biomarker.name}`
      )
    )
  );
}

Object.assign(window, { DetailView });
