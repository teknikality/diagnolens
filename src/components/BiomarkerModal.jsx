import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DL_COLORS, STATUS_META } from '../tokens.js';
import Icon from './Icon.jsx';
import Badge from './Badge.jsx';
import { useLang } from '../i18n/LangContext.jsx';

function SectionContent({ section, biomarker, t }) {
  const meta = STATUS_META[biomarker.status];

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={section.icon} size={15} style={{ color: DL_COLORS.accent }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', margin: 0 }}>{section.label}</h3>
    </div>
  );

  let body;

  if (section.isCustom === 'reference') {
    const statusKey = biomarker.apiStatus;
    const statusDesc = t(`modal.statusDesc.${statusKey}`) === `modal.statusDesc.${statusKey}`
      ? t('modal.statusDesc.unknown')
      : t(`modal.statusDesc.${statusKey}`);

    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: DL_COLORS.bgRaised, borderRadius: 10, padding: 16, border: `1px solid ${DL_COLORS.border}` }}>
          <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 }}>{t('modal.referenceRange')}</div>
          <div style={{ fontSize: 15, fontFamily: "'JetBrains Mono', monospace", color: DL_COLORS.fgPrimary, fontWeight: 500 }}>
            {biomarker.reference_range || t('modal.notSpecified')}
          </div>
        </div>
        <div style={{ background: meta.bg, borderRadius: 10, padding: 16, border: `1px solid ${meta.color}40` }}>
          <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 }}>{t('modal.yourStatus')}</div>
          <div style={{ fontSize: 14, color: meta.color, fontWeight: 600 }}>{meta.label}</div>
          <div style={{ fontSize: 12, color: DL_COLORS.fgMuted, marginTop: 4 }}>{statusDesc}</div>
        </div>
        <div style={{ background: DL_COLORS.bgRaised, borderRadius: 10, padding: 16, border: `1px solid ${DL_COLORS.border}` }}>
          <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 4 }}>{t('modal.category')}</div>
          <div style={{ fontSize: 14, color: DL_COLORS.fgPrimary }}>{biomarker.category || t('common.defaultCategory')}</div>
        </div>
      </div>
    );
  } else if (section.isCustom === 'monitor') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.75, margin: 0 }}>
          {t('modal.monitorText', { name: biomarker.name })}
        </p>
        <div style={{
          background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <Icon name="shield" size={16} style={{ color: DL_COLORS.accent, flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 }}>
            {t('modal.disclaimer')}
          </div>
        </div>
        {biomarker.is_abnormal && (
          <div style={{
            background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}40`,
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <Icon name="alert-circle" size={16} style={{ color: DL_COLORS.warning, flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.65 }}>
              {t('modal.abnormalWarning', { name: biomarker.name })}
            </div>
          </div>
        )}
      </div>
    );
  } else if (Array.isArray(section.content)) {
    body = (
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
        {section.content.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={11} style={{ color: DL_COLORS.accent }} />
            </div>
            <span style={{ fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.65 }}>{item}</span>
          </li>
        ))}
      </ul>
    );
  } else {
    body = <p style={{ fontSize: 14, color: DL_COLORS.fgSecondary, lineHeight: 1.75, margin: 0 }}>{section.content}</p>;
  }

  return <div>{header}{body}</div>;
}

export default function BiomarkerModal({ biomarker, initialSection, onClose }) {
  const { t } = useLang();
  const [activeSection, setActiveSection] = useState(initialSection || 0);
  const [entered, setEntered] = useState(false);

  useEffect(() => { setTimeout(() => setEntered(true), 20); }, []);

  if (!biomarker) return null;

  const advice = biomarker.insight?.advice || [];
  const mid    = Math.ceil(advice.length / 2);
  const steps  = advice.slice(0, Math.max(mid, 1));
  const plan   = advice.slice(mid);

  const sections = [
    { id: 'means',   label: t('modal.sections.means'),   icon: 'info',           content: biomarker.insight?.meaning || t('modal.defaultMeaning') },
    { id: 'context', label: t('modal.sections.context'),  icon: 'bar-chart-2',    isCustom: 'reference' },
    { id: 'steps',   label: t('modal.sections.steps'),    icon: 'check-square',   content: steps.length ? steps : [t('modal.defaultStep')] },
    { id: 'plan',    label: t('modal.sections.plan'),     icon: 'clipboard-list', content: plan.length  ? plan  : [t('modal.defaultPlan')] },
    { id: 'monitor', label: t('modal.sections.monitor'),  icon: 'activity',       isCustom: 'monitor' },
  ];

  const meta = STATUS_META[biomarker.status];

  return createPortal(
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end',
        opacity: entered ? 1 : 0,
        transition: 'opacity 250ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 680, margin: '0 auto',
        background: DL_COLORS.bgBase,
        borderRadius: '20px 20px 0 0',
        border: `1px solid ${DL_COLORS.border}`,
        borderBottom: 'none',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        transform: entered ? 'translateY(0)' : 'translateY(32px)',
        transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 100, background: DL_COLORS.border }} />
        </div>

        {/* Header */}
        <div style={{ padding: '16px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{biomarker.name}</h2>
              <Badge status={biomarker.status} />
            </div>
            {biomarker.category && <div style={{ fontSize: 13, color: DL_COLORS.fgMuted }}>{biomarker.category}</div>}
            {biomarker.is_abnormal && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 8, background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 100, padding: '3px 10px',
              }}>
                <Icon name="alert-triangle" size={11} style={{ color: DL_COLORS.warning }} />
                <span style={{ fontSize: 11, color: DL_COLORS.warning }}>{t('modal.outsideRange')}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
              borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Icon name="x" size={15} style={{ color: DL_COLORS.fgMuted }} />
          </button>
        </div>

        {/* Value row */}
        <div style={{ padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: meta.color, letterSpacing: '-0.03em' }}>
            {biomarker.value}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: DL_COLORS.fgMuted }}>{biomarker.unit}</span>
          {biomarker.reference_range && (
            <span style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>{t('modal.referenceLabel')} {biomarker.reference_range}</span>
          )}
        </div>

        {/* Section tabs */}
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto', padding: '14px 24px 0',
          borderBottom: `1px solid ${DL_COLORS.border}`, scrollbarWidth: 'none',
        }}>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(i)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', fontSize: 13, fontWeight: activeSection === i ? 600 : 400,
                color: activeSection === i ? DL_COLORS.fgPrimary : DL_COLORS.fgMuted,
                borderBottom: activeSection === i ? `2px solid ${DL_COLORS.accent}` : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 150ms', marginBottom: -1,
              }}
            >{s.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 32px' }}>
          <SectionContent section={sections[activeSection]} biomarker={biomarker} t={t} />
        </div>

        {/* Footer nav */}
        <div style={{
          padding: '14px 24px', borderTop: `1px solid ${DL_COLORS.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {activeSection > 0 ? (
            <button
              onClick={() => setActiveSection(s => s - 1)}
              style={{
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                borderRadius: 8, padding: '8px 14px', color: DL_COLORS.fgSecondary,
                fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Icon name="chevron-left" size={14} />
              {t('modal.previous')}
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: DL_COLORS.fgMuted,
                fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Icon name="chevron-left" size={14} />
              {t('modal.backToReport')}
            </button>
          )}
          <span style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>{activeSection + 1} / {sections.length}</span>
          {activeSection < sections.length - 1 ? (
            <button
              onClick={() => setActiveSection(s => s + 1)}
              style={{
                background: DL_COLORS.accent, border: 'none',
                borderRadius: 8, padding: '8px 16px', color: '#0a1a16',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {t('modal.next')}
              <Icon name="chevron-right" size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: DL_COLORS.accent, border: 'none',
                borderRadius: 8, padding: '8px 16px', color: '#0a1a16',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >{t('modal.done')}</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
