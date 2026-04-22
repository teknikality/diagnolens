// DiagnoLens — Biomarker Modal (expanded detail view)

function BiomarkerModal({ biomarker, initialSection, onClose }) {
  const [activeSection, setActiveSection] = React.useState(initialSection || 0);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => { setTimeout(() => setEntered(true), 20); }, []);

  if (!biomarker) return null;

  const advice = biomarker.insight?.advice || [];
  const mid = Math.ceil(advice.length / 2);
  const steps = advice.slice(0, Math.max(mid, 1));
  const plan = advice.slice(mid);

  const sections = [
    {
      id: 'means',
      label: 'What this means',
      icon: 'info',
      content: biomarker.insight?.meaning || 'No detailed information is available for this biomarker.',
    },
    {
      id: 'context',
      label: 'Reference context',
      icon: 'bar-chart-2',
      isCustom: 'reference',
    },
    {
      id: 'steps',
      label: 'What you can do',
      icon: 'check-square',
      content: steps.length
        ? steps
        : ['Maintain healthy lifestyle habits: balanced diet, regular exercise, and adequate sleep.'],
    },
    {
      id: 'plan',
      label: 'Action plan',
      icon: 'clipboard-list',
      content: plan.length
        ? plan
        : ['Follow up with your healthcare provider to review this result in the context of your full health picture.'],
    },
    {
      id: 'monitor',
      label: 'When to act',
      icon: 'activity',
      isCustom: 'monitor',
    },
  ];

  const meta = STATUS_META[biomarker.status];

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return React.createElement('div', {
    onClick: handleBackdrop,
    style: {
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
      fontFamily: "'DM Sans', sans-serif",
      opacity: entered ? 1 : 0,
      transition: 'opacity 250ms cubic-bezier(0.16,1,0.3,1)',
    }
  },
    React.createElement('div', {
      style: {
        width: '100%', maxWidth: 680, margin: '0 auto',
        background: DL_COLORS.bgBase,
        borderRadius: '20px 20px 0 0',
        border: `1px solid ${DL_COLORS.border}`,
        borderBottom: 'none',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        transform: entered ? 'translateY(0)' : 'translateY(32px)',
        transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1)',
      }
    },
      // Drag handle
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '12px 0 0' } },
        React.createElement('div', { style: { width: 36, height: 4, borderRadius: 100, background: DL_COLORS.border } })
      ),

      // Modal header
      React.createElement('div', {
        style: { padding: '16px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }
      },
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } },
            React.createElement('h2', { style: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' } }, biomarker.name),
            React.createElement(Badge, { status: biomarker.status })
          ),
          biomarker.category && React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgMuted } }, biomarker.category),
          biomarker.is_abnormal && React.createElement('div', {
            style: {
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 8, background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 100, padding: '3px 10px',
            }
          },
            React.createElement(Icon, { name: 'alert-triangle', size: 11, style: { color: DL_COLORS.warning } }),
            React.createElement('span', { style: { fontSize: 11, color: DL_COLORS.warning } }, 'Outside reference range')
          )
        ),
        React.createElement('button', {
          onClick: onClose,
          style: {
            background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }
        },
          React.createElement(Icon, { name: 'x', size: 15, style: { color: DL_COLORS.fgMuted } })
        )
      ),

      // Value row
      React.createElement('div', {
        style: { padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: 16 }
      },
        React.createElement('span', {
          style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: meta.color, letterSpacing: '-0.03em' }
        }, biomarker.value),
        React.createElement('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: DL_COLORS.fgMuted } }, biomarker.unit),
        biomarker.reference_range && React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.fgMuted } }, `Reference: ${biomarker.reference_range}`)
      ),

      // Section tabs
      React.createElement('div', {
        style: {
          display: 'flex', gap: 0, overflowX: 'auto', padding: '14px 24px 0',
          borderBottom: `1px solid ${DL_COLORS.border}`, scrollbarWidth: 'none',
        }
      },
        sections.map((s, i) =>
          React.createElement('button', {
            key: s.id,
            onClick: () => setActiveSection(i),
            style: {
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 14px', fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
              color: activeSection === i ? DL_COLORS.fgPrimary : DL_COLORS.fgMuted,
              borderBottom: activeSection === i ? `2px solid ${DL_COLORS.accent}` : '2px solid transparent',
              whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 150ms', marginBottom: -1,
            }
          }, s.label)
        )
      ),

      // Section content
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '24px 24px 32px' } },
        React.createElement(SectionContent, { section: sections[activeSection], biomarker })
      ),

      // Footer navigation
      React.createElement('div', {
        style: {
          padding: '14px 24px', borderTop: `1px solid ${DL_COLORS.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }
      },
        activeSection > 0
          ? React.createElement('button', {
              onClick: () => setActiveSection(s => s - 1),
              style: {
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                borderRadius: 8, padding: '8px 14px', color: DL_COLORS.fgSecondary,
                fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 6,
              }
            },
              React.createElement(Icon, { name: 'chevron-left', size: 14 }),
              'Previous'
            )
          : React.createElement('button', {
              onClick: onClose,
              style: {
                background: 'none', border: 'none', color: DL_COLORS.fgMuted,
                fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 6,
              }
            },
              React.createElement(Icon, { name: 'chevron-left', size: 14 }),
              'Back to report'
            ),
        React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.fgMuted } },
          `${activeSection + 1} / ${sections.length}`
        ),
        activeSection < sections.length - 1
          ? React.createElement('button', {
              onClick: () => setActiveSection(s => s + 1),
              style: {
                background: DL_COLORS.accent, border: 'none',
                borderRadius: 8, padding: '8px 16px', color: '#0a1a16',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 6,
              }
            },
              'Next',
              React.createElement(Icon, { name: 'chevron-right', size: 14 })
            )
          : React.createElement('button', {
              onClick: onClose,
              style: {
                background: DL_COLORS.accent, border: 'none',
                borderRadius: 8, padding: '8px 16px', color: '#0a1a16',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }
            }, 'Done')
      )
    )
  );
}

function SectionContent({ section, biomarker }) {
  const meta = STATUS_META[biomarker.status];

  const header = React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 } },
    React.createElement('div', {
      style: {
        width: 32, height: 32, borderRadius: 8,
        background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }
    },
      React.createElement(Icon, { name: section.icon, size: 15, style: { color: DL_COLORS.accent } })
    ),
    React.createElement('h3', { style: { fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' } }, section.label)
  );

  let body;

  if (section.isCustom === 'reference') {
    body = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', {
        style: {
          background: DL_COLORS.bgRaised, borderRadius: 10, padding: '16px',
          border: `1px solid ${DL_COLORS.border}`,
        }
      },
        React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 } }, 'Reference range'),
        React.createElement('div', {
          style: { fontSize: 15, fontFamily: "'JetBrains Mono', monospace", color: DL_COLORS.fgPrimary, fontWeight: 500 }
        }, biomarker.reference_range || 'Not specified')
      ),
      React.createElement('div', {
        style: {
          background: meta.bg, borderRadius: 10, padding: '16px',
          border: `1px solid ${meta.color}40`,
        }
      },
        React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 } }, 'Your result status'),
        React.createElement('div', { style: { fontSize: 14, color: meta.color, fontWeight: 600 } }, meta.label),
        React.createElement('div', { style: { fontSize: 12, color: DL_COLORS.fgMuted, marginTop: 4 } },
          biomarker.apiStatus === 'NORMAL'     ? 'This value falls within the normal reference range.' :
          biomarker.apiStatus === 'HIGH'       ? 'This value is above the upper limit of the reference range.' :
          biomarker.apiStatus === 'LOW'        ? 'This value is below the lower limit of the reference range.' :
          biomarker.apiStatus === 'BORDERLINE' ? 'This value is close to the boundary of the reference range.' :
          'The status for this biomarker could not be determined automatically.'
        )
      ),
      React.createElement('div', {
        style: {
          background: DL_COLORS.bgRaised, borderRadius: 10, padding: '16px',
          border: `1px solid ${DL_COLORS.border}`,
        }
      },
        React.createElement('div', { style: { fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 } }, 'Category'),
        React.createElement('div', { style: { fontSize: 14, color: DL_COLORS.fgPrimary } }, biomarker.category || 'General')
      )
    );
  } else if (section.isCustom === 'monitor') {
    body = React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('p', { style: { fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.75, margin: 0 } },
        `Keep track of your ${biomarker.name} over time to identify trends. Consistent monitoring helps you and your doctor catch changes early.`
      ),
      React.createElement('div', {
        style: {
          background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }
      },
        React.createElement(Icon, { name: 'shield', size: 16, style: { color: DL_COLORS.accent, flexShrink: 0, marginTop: 1 } }),
        React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 } },
          'Always discuss your results with a qualified healthcare professional before making changes to medication or treatment.'
        )
      ),
      biomarker.is_abnormal && React.createElement('div', {
        style: {
          background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}40`,
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }
      },
        React.createElement(Icon, { name: 'alert-circle', size: 16, style: { color: DL_COLORS.warning, flexShrink: 0, marginTop: 1 } }),
        React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 } },
          `Your ${biomarker.name} is currently outside the reference range. Consider scheduling a follow-up with your doctor to review this result.`
        )
      )
    );
  } else if (Array.isArray(section.content)) {
    body = React.createElement('ul', { style: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 } },
      section.content.map((item, i) =>
        React.createElement('li', { key: i, style: { display: 'flex', gap: 12, alignItems: 'flex-start' } },
          React.createElement('div', {
            style: {
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }
          },
            React.createElement(Icon, { name: 'check', size: 11, style: { color: DL_COLORS.accent } })
          ),
          React.createElement('span', { style: { fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.65 } }, item)
        )
      )
    );
  } else {
    body = React.createElement('p', {
      style: { fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.75, margin: 0 }
    }, section.content);
  }

  return React.createElement('div', null, header, body);
}

Object.assign(window, { BiomarkerModal });
