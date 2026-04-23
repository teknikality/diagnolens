import { useState } from 'react';
import { DL_COLORS, STATUS_META } from '../tokens.js';
import Icon from './Icon.jsx';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import SectionLabel from './SectionLabel.jsx';
import EmptyState from './EmptyState.jsx';
import BiomarkerModal from './BiomarkerModal.jsx';
import { useLang } from '../i18n/LangContext.jsx';

function SummaryHeader({ summary, biomarkers, fileName, t }) {
  const counts = { normal: 0, caution: 0, warning: 0 };
  (biomarkers || []).forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

  const explanation = summary?.safety_note || '';
  const keyFindings = summary?.key_findings || [];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>{t('dashboard.title')}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: DL_COLORS.fgMuted }}>
          <Icon name="file-text" size={13} style={{ color: DL_COLORS.fgMuted }} />
          {fileName ? t('dashboard.analyzedNowFile', { file: fileName }) : t('dashboard.analyzedNow')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: explanation ? 16 : 0 }}>
        {[
          { key: 'normal',  label: t('dashboard.inRange'),     color: DL_COLORS.normal,  bg: DL_COLORS.normalBg,  icon: 'check-circle' },
          { key: 'caution', label: t('dashboard.borderline'),  color: DL_COLORS.caution, bg: DL_COLORS.cautionBg, icon: 'alert-circle' },
          { key: 'warning', label: t('dashboard.elevatedLow'), color: DL_COLORS.warning, bg: DL_COLORS.warningBg, icon: 'alert-triangle' },
        ].map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: item.bg, border: `1px solid ${item.color}30`,
            borderRadius: 100, padding: '7px 14px',
          }}>
            <Icon name={item.icon} size={14} style={{ color: item.color }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: item.color }}>{counts[item.key]}</span>
            <span style={{ fontSize: 13, color: item.color, opacity: 0.85 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {explanation && (
        <div style={{
          background: DL_COLORS.accentDim, border: '1px solid rgba(0,201,167,0.18)',
          borderRadius: 10, padding: '12px 16px',
          fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.7,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: DL_COLORS.accent, marginRight: 8 }}>{t('dashboard.summaryLabel')}</span>
          {explanation}
        </div>
      )}

      {keyFindings.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <SectionLabel>{t('dashboard.keyFindings')}</SectionLabel>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
            {keyFindings.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  background: 'rgba(0,201,167,0.12)', border: `1px solid ${DL_COLORS.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="check" size={10} style={{ color: DL_COLORS.accent }} />
                </div>
                <span style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.6 }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TopConcerns({ biomarkers, onAction, t }) {
  const concerns = (biomarkers || [])
    .filter(b => b.is_abnormal)
    .sort((a, b) => (b.status === 'warning' ? 1 : 0) - (a.status === 'warning' ? 1 : 0))
    .slice(0, 2);

  if (concerns.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel>{t('dashboard.topConcerns')}</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {concerns.map(b => {
          const meta = STATUS_META[b.status] || STATUS_META.info;
          return (
            <div key={b.name} style={{ background: meta.bg, border: `1px solid ${meta.color}30`, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: DL_COLORS.fgMuted }}>{b.category || ''}</div>
                </div>
                <Badge status={b.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color: meta.color }}>{b.value}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted }}>{b.unit}</span>
              </div>
              {b.insight?.meaning && (
                <p style={{ fontSize: 13, color: DL_COLORS.fgSecondary, lineHeight: 1.55, margin: '0 0 14px' }}>
                  {b.insight.meaning.length > 120 ? b.insight.meaning.slice(0, 120) + '…' : b.insight.meaning}
                </p>
              )}
              <button
                onClick={() => onAction(b, 0)}
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.2)', border: `1px solid ${meta.color}25`,
                  borderRadius: 8, padding: '9px 14px', color: DL_COLORS.fgPrimary,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                <Icon name="info" size={13} />
                {t('dashboard.understandThis')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BiomarkerActionCard({ biomarker: b, onAction, t }) {
  const meta = STATUS_META[b.status] || STATUS_META.info;

  const actions = [
    { label: t('dashboard.actionMeaning'), section: 0, icon: 'info' },
    { label: t('dashboard.actionTodo'),    section: 2, icon: 'check-square' },
    { label: t('dashboard.actionSerious'), section: 3, icon: 'alert-triangle' },
  ];

  return (
    <div style={{
      background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
      borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{b.name}</span>
              <Badge status={b.status} />
              {b.category && (
                <span style={{
                  fontSize: 10, color: DL_COLORS.fgMuted, background: DL_COLORS.bgRaised,
                  border: `1px solid ${DL_COLORS.border}`, borderRadius: 100, padding: '2px 8px',
                }}>{b.category}</span>
              )}
            </div>
            {b.reference_range ? (
              <div style={{ fontSize: 11, color: DL_COLORS.fgMuted, marginBottom: 10 }}>
                {t('modal.referenceLabel')} {b.reference_range}{b.unit ? ' ' + b.unit : ''}
              </div>
            ) : <div style={{ marginBottom: 10 }} />}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: meta.color, letterSpacing: '-0.02em' }}>{b.value}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: DL_COLORS.fgMuted }}>{b.unit}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, color: meta.color,
                background: meta.bg, borderRadius: 4, padding: '2px 6px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>{b.apiStatus}</span>
            </div>

            {b.insight?.meaning && (
              <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, lineHeight: 1.5, margin: 0 }}>
                {b.insight.meaning.length > 140 ? b.insight.meaning.slice(0, 140) + '…' : b.insight.meaning}
              </p>
            )}
          </div>

          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: meta.bg, border: `1px solid ${meta.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={b.is_abnormal ? 'alert-circle' : 'check-circle'} size={18} style={{ color: meta.color }} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${DL_COLORS.border}`, display: 'flex' }}>
        {actions.map((action, i) => (
          <button
            key={action.label}
            onClick={() => onAction(b, action.section)}
            style={{
              flex: 1, padding: '10px 8px',
              background: 'transparent', border: 'none',
              borderRight: i < actions.length - 1 ? `1px solid ${DL_COLORS.border}` : 'none',
              color: DL_COLORS.fgMuted, fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = DL_COLORS.accentDim; e.currentTarget.style.color = DL_COLORS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = DL_COLORS.fgMuted; }}
          >
            <Icon name={action.icon} size={14} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WhatsAppSection({ t }) {
  const [phone, setPhone]     = useState('');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!phone.trim() || phone.length < 7) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const ready = phone.trim() && phone.length >= 7;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="message-circle" size={20} style={{ color: '#25D366' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 3 }}>{t('dashboard.whatsapp.title')}</div>
            <div style={{ fontSize: 12, color: DL_COLORS.fgMuted, lineHeight: 1.5 }}>{t('dashboard.whatsapp.sub')}</div>
          </div>
        </div>

        {sent ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 10, padding: '11px 14px',
          }}>
            <Icon name="check-circle" size={16} style={{ color: DL_COLORS.normal }} />
            <span style={{ fontSize: 13, color: DL_COLORS.normal }}>{t('dashboard.whatsapp.sent')}</span>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <div style={{
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                borderRadius: 8, padding: '9px 10px', fontSize: 13, color: DL_COLORS.fgSecondary,
                display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, whiteSpace: 'nowrap',
              }}>
                <Icon name="globe" size={12} style={{ color: DL_COLORS.fgMuted }} />
                +1
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={t('dashboard.whatsapp.phonePlaceholder')}
                style={{
                  flex: 1, minWidth: 0,
                  background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                  borderRadius: 8, padding: '9px 12px', color: DL_COLORS.fgPrimary,
                  fontSize: 13, outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!ready || sending}
                style={{
                  background: ready ? '#25D366' : DL_COLORS.bgRaised,
                  border: `1px solid ${ready ? '#25D366' : DL_COLORS.border}`,
                  borderRadius: 8, padding: '9px 16px',
                  color: ready ? 'white' : DL_COLORS.fgMuted,
                  fontSize: 13, fontWeight: 600, cursor: ready ? 'pointer' : 'not-allowed',
                  transition: 'all 200ms', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }}
              >
                <Icon name={sending ? 'loader' : 'send'} size={13} />
                {sending ? t('dashboard.whatsapp.sending') : t('dashboard.whatsapp.send')}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: DL_COLORS.fgMuted }}>
              <Icon name="lock" size={10} style={{ color: DL_COLORS.fgMuted }} />
              {t('dashboard.whatsapp.privacy')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardView({ reportData, onSelectBiomarker }) {
  const { t } = useLang();
  const [modal, setModal]               = useState(null);
  const [sortImportant, setSortImportant] = useState(true);

  if (!reportData) {
    return <EmptyState message={t('dashboard.noReport')} />;
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

  const bCount = biomarkers.length;
  const biomarkerLabel = bCount === 1
    ? t('dashboard.biomarkerCount', { n: bCount })
    : t('dashboard.biomarkerCountPlural', { n: bCount });

  return (
    <div style={{ width: '100%' }}>
      <SummaryHeader summary={summary} biomarkers={biomarkers} fileName={fileName} t={t} />
      <TopConcerns biomarkers={biomarkers} onAction={openModal} t={t} />

      {biomarkers.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SectionLabel>{biomarkerLabel}</SectionLabel>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setSortImportant(true)}
              style={{
                padding: '5px 12px', borderRadius: 100,
                border: `1px solid ${sortImportant ? DL_COLORS.accentBorder : DL_COLORS.border}`,
                background: sortImportant ? DL_COLORS.accentDim : 'transparent',
                color: sortImportant ? DL_COLORS.accent : DL_COLORS.fgMuted,
                fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, transition: 'all 150ms',
              }}
            >
              <Icon name="alert-triangle" size={11} />
              {t('dashboard.importantFirst')}
            </button>
            <button
              onClick={() => setSortImportant(false)}
              style={{
                padding: '5px 12px', borderRadius: 100,
                border: `1px solid ${!sortImportant ? DL_COLORS.accentBorder : DL_COLORS.border}`,
                background: !sortImportant ? DL_COLORS.accentDim : 'transparent',
                color: !sortImportant ? DL_COLORS.accent : DL_COLORS.fgMuted,
                fontSize: 12, cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {t('dashboard.originalOrder')}
            </button>
          </div>
        </div>
      )}

      {biomarkers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(b => <BiomarkerActionCard key={b.name} biomarker={b} onAction={openModal} t={t} />)}
        </div>
      ) : (
        <EmptyState message={t('dashboard.noBiomarkers')} />
      )}

      <WhatsAppSection t={t} />

      {modal && (
        <BiomarkerModal
          biomarker={modal.biomarker}
          initialSection={modal.section}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
