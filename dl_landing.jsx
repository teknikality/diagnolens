// DiagnoLens — Landing Page

function LandingPage({ onGetStarted }) {
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setEntered(true), 60); return () => clearTimeout(t); }, []);

  const fadeUp = (delay = 0) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'none' : 'translateY(14px)',
    transition: `opacity 550ms ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 550ms ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
  });

  return React.createElement('div', {
    style: {
      minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
      fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
      display: 'flex', flexDirection: 'column',
    }
  },
    // ── Topbar ──────────────────────────────────────────────
    React.createElement('nav', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', maxWidth: 640, margin: '0 auto', width: '100%',
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement(DLLogo, { size: 26 }),
        React.createElement('span', { style: { fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' } }, 'DiagnoLens')
      ),
      React.createElement('button', {
        onClick: onGetStarted,
        style: {
          background: 'transparent', border: `1px solid ${DL_COLORS.border}`,
          borderRadius: 8, padding: '7px 14px', color: DL_COLORS.fgSecondary,
          fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }
      }, 'Sign in')
    ),

    // ── Hero ────────────────────────────────────────────────
    React.createElement('section', {
      style: {
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '56px 24px 48px', maxWidth: 540, margin: '0 auto', width: '100%',
      }
    },
      // Eyebrow pill
      React.createElement('div', {
        style: {
          ...fadeUp(0),
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
          borderRadius: 100, padding: '5px 13px', marginBottom: 24,
        }
      },
        React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: DL_COLORS.accent, flexShrink: 0 } }),
        React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.accent, fontWeight: 500 } }, 'AI-powered lab report analysis')
      ),

      // Headline
      React.createElement('h1', {
        style: {
          ...fadeUp(80),
          fontSize: 'clamp(32px, 8vw, 52px)',
          fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1,
          margin: '0 0 16px', textWrap: 'balance',
        }
      },
        'Understand your lab report ',
        React.createElement('span', { style: { color: DL_COLORS.accent } }, 'in minutes')
      ),

      // Subtext
      React.createElement('p', {
        style: {
          ...fadeUp(140),
          fontSize: 16, color: DL_COLORS.fgSecondary, lineHeight: 1.65,
          margin: '0 0 36px', maxWidth: 400, textWrap: 'pretty',
        }
      }, 'Simple, personalized insights based on your health. No medical background needed.'),

      // Primary CTA
      React.createElement('div', { style: { ...fadeUp(200), width: '100%', maxWidth: 340 } },
        React.createElement('button', {
          onClick: onGetStarted,
          style: {
            width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
            border: 'none', borderRadius: 12, padding: '16px 24px',
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 150ms', boxShadow: '0 4px 24px rgba(0,201,167,0.25)',
          },
          onMouseEnter: e => { e.currentTarget.style.background = DL_COLORS.accentHover; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,201,167,0.35)'; },
          onMouseLeave: e => { e.currentTarget.style.background = DL_COLORS.accent; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,201,167,0.25)'; },
        },
          React.createElement(Icon, { name: 'upload-cloud', size: 18 }),
          'Upload your report'
        ),
        React.createElement('p', { style: { fontSize: 12, color: DL_COLORS.fgMuted, marginTop: 10, textAlign: 'center' } },
          'Free · No account required · Results in seconds'
        )
      )
    ),

    // ── Trust strip ──────────────────────────────────────────
    React.createElement('section', {
      style: {
        borderTop: `1px solid ${DL_COLORS.border}`,
        borderBottom: `1px solid ${DL_COLORS.border}`,
        padding: '20px 24px',
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: 640, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }
      },
        [
          { icon: 'lock',         text: 'End-to-end encrypted' },
          { icon: 'shield-check', text: 'Data never shared' },
          { icon: 'zap',          text: 'Results in seconds' },
        ].map(({ icon, text }) =>
          React.createElement('div', {
            key: text,
            style: {
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 8, padding: '12px 8px', textAlign: 'center',
            }
          },
            React.createElement('div', {
              style: {
                width: 36, height: 36, borderRadius: 10,
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }
            },
              React.createElement(Icon, { name: icon, size: 16, style: { color: DL_COLORS.fgMuted } })
            ),
            React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.fgMuted, lineHeight: 1.4 } }, text)
          )
        )
      )
    ),

    // ── How it works ─────────────────────────────────────────
    React.createElement('section', {
      style: { padding: '52px 24px', maxWidth: 640, margin: '0 auto', width: '100%' }
    },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: 36 } },
        React.createElement('div', {
          style: { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.fgMuted, marginBottom: 10 }
        }, 'How it works'),
        React.createElement('h2', { style: { fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 } }, 'Three steps to clarity')
      ),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
        [
          { n: '01', icon: 'upload-cloud', title: 'Upload your report', body: 'Drop a PDF or photo of your lab results. We accept all common blood panel formats.' },
          { n: '02', icon: 'user-check',   title: 'Answer a few questions', body: 'Age, known conditions, lifestyle. Takes 60 seconds — makes results far more relevant.' },
          { n: '03', icon: 'sparkles',     title: 'Get personalized insights', body: 'Every biomarker explained in plain English, flagged against your personal context.' },
        ].map(({ n, icon, title, body }) =>
          React.createElement('div', {
            key: n,
            style: {
              display: 'flex', gap: 16, alignItems: 'flex-start',
              background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
              borderRadius: 14, padding: '20px 20px',
            }
          },
            React.createElement('div', {
              style: {
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }
            },
              React.createElement(Icon, { name: icon, size: 18, style: { color: DL_COLORS.accent } })
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: DL_COLORS.fgMuted, marginBottom: 4, textTransform: 'uppercase' } }, `Step ${n}`),
              React.createElement('div', { style: { fontSize: 15, fontWeight: 600, marginBottom: 4, letterSpacing: '-0.01em' } }, title),
              React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgMuted, lineHeight: 1.6 } }, body)
            )
          )
        )
      )
    ),

    // ── Supported report types ────────────────────────────────
    React.createElement('section', {
      style: {
        padding: '0 24px 36px', maxWidth: 640, margin: '0 auto', width: '100%', textAlign: 'center',
      }
    },
      React.createElement('div', { style: { fontSize: 12, color: DL_COLORS.fgMuted, marginBottom: 10 } }, 'Supports reports including'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' } },
        ['CBC / Complete blood count', 'Lipid panel', 'Thyroid (TSH, T3, T4)', 'HbA1c', 'Metabolic panel', 'Urine analysis', 'Liver function'].map(t =>
          React.createElement('span', {
            key: t,
            style: {
              fontSize: 12, color: DL_COLORS.fgMuted,
              background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
              borderRadius: 100, padding: '4px 12px',
            }
          }, t)
        )
      )
    ),

    // ── Bottom CTA ───────────────────────────────────────────
    React.createElement('section', {
      style: {
        borderTop: `1px solid ${DL_COLORS.border}`,
        padding: '52px 24px 60px', textAlign: 'center',
        background: `radial-gradient(ellipse 60% 100% at 50% 100%, rgba(0,201,167,0.06) 0%, transparent 100%)`,
      }
    },
      React.createElement('div', { style: { maxWidth: 400, margin: '0 auto' } },
        React.createElement('h2', {
          style: { fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 12, textWrap: 'balance' }
        }, 'Ready to understand your results?'),
        React.createElement('p', { style: { fontSize: 14, color: DL_COLORS.fgMuted, marginBottom: 28 } },
          'Upload any lab report and get a plain-language breakdown in seconds.'
        ),
        React.createElement('button', {
          onClick: onGetStarted,
          style: {
            width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
            border: 'none', borderRadius: 12, padding: '16px 24px',
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em',
            transition: 'all 150ms', boxShadow: '0 4px 24px rgba(0,201,167,0.2)',
          },
          onMouseEnter: e => { e.currentTarget.style.background = DL_COLORS.accentHover; },
          onMouseLeave: e => { e.currentTarget.style.background = DL_COLORS.accent; },
        }, "Start now — it's free")
      )
    )
  );
}

Object.assign(window, { LandingPage });
