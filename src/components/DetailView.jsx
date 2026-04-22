import { useState, useEffect } from 'react';
import { DL_COLORS, STATUS_META } from '../tokens.js';
import Icon from './Icon.jsx';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import Button from './Button.jsx';
import SectionLabel from './SectionLabel.jsx';
import ValueDisplay from './ValueDisplay.jsx';

export default function DetailView({ biomarker, onBack }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 30); }, []);

  if (!biomarker) return null;

  const meta = STATUS_META[biomarker.status];

  return (
    <div style={{
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1)',
      maxWidth: 680,
    }}>
      {/* Back link */}
      <div
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: DL_COLORS.fgMuted, fontSize: 13, cursor: 'pointer',
          marginBottom: 20, userSelect: 'none', transition: 'color 150ms',
        }}
        onMouseEnter={e => e.currentTarget.style.color = DL_COLORS.fgPrimary}
        onMouseLeave={e => e.currentTarget.style.color = DL_COLORS.fgMuted}
      >
        <Icon name="chevron-left" size={16} />
        Back to dashboard
      </div>

      {/* Header card */}
      <Card style={{ marginBottom: 12, padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4, margin: '0 0 4px' }}>{biomarker.name}</h2>
            {biomarker.category && <div style={{ fontSize: 13, color: DL_COLORS.fgMuted }}>{biomarker.category}</div>}
          </div>
          <Badge status={biomarker.status} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <ValueDisplay value={biomarker.value} unit={biomarker.unit} status={biomarker.status} />
        </div>

        {biomarker.reference_range && (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 3 }}>Reference range</div>
              <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: DL_COLORS.fgSecondary }}>
                {biomarker.reference_range}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 3 }}>Status</div>
              <div style={{ fontSize: 13, color: meta.color, fontWeight: 500 }}>{meta.label}</div>
            </div>
          </div>
        )}
      </Card>

      {/* AI insight panel */}
      {biomarker.insight?.meaning && (
        <div style={{
          background: DL_COLORS.accentDim, border: '1px solid rgba(0,201,167,0.18)',
          borderRadius: 12, padding: '18px 20px', marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.accent, marginBottom: 8 }}>
            What this means
          </div>
          <p style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.7, margin: 0 }}>
            {biomarker.insight.meaning}
          </p>
        </div>
      )}

      {/* Advice list */}
      {biomarker.insight?.advice?.length > 0 && (
        <Card style={{ marginBottom: 12, padding: '20px 22px' }}>
          <SectionLabel>What you can do</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {biomarker.insight.advice.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={11} style={{ color: DL_COLORS.accent }} />
                </div>
                <span style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ask CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
        borderRadius: 12, padding: '14px 18px',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Have questions about this result?</div>
          <div style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>Ask DiagnoLens for a plain-language explanation.</div>
        </div>
        <Button variant="secondary" size="sm">
          <Icon name="message-circle" size={13} />
          Ask about {biomarker.name}
        </Button>
      </div>
    </div>
  );
}
