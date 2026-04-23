import { DL_COLORS, STATUS_META } from '../tokens.js';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import EmptyState from './EmptyState.jsx';
import { useLang } from '../i18n/LangContext.jsx';

export default function TrendsView({ reportData, onSelect }) {
  const { t } = useLang();
  const biomarkers = reportData?.biomarkers || [];

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>{t('trends.title')}</h1>

      {!reportData ? (
        <EmptyState message={t('trends.noReport')} />
      ) : (
        <>
          <div style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 20 }}>
            {t('trends.sub')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {biomarkers.map(b => (
              <Card key={b.name} hover style={{ cursor: 'pointer', padding: '16px 18px' }} onClick={() => onSelect(b)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                  <Badge status={b.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, color: STATUS_META[b.status]?.color }}>
                    {b.value}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: DL_COLORS.fgMuted }}>{b.unit}</span>
                </div>
                {b.reference_range && (
                  <div style={{ fontSize: 10, color: DL_COLORS.fgMuted }}>{t('trends.ref')} {b.reference_range}</div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
