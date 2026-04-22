import { DL_COLORS, STATUS_META } from '../tokens.js';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import EmptyState from './EmptyState.jsx';

export default function TrendsView({ reportData, onSelect }) {
  const biomarkers = reportData?.biomarkers || [];

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>Trends</h1>

      {!reportData ? (
        <EmptyState message="Upload a report to see your biomarker trends." />
      ) : (
        <>
          <div style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 20 }}>
            Upload multiple reports over time to track how your biomarkers change.
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
                  <div style={{ fontSize: 10, color: DL_COLORS.fgMuted }}>Ref: {b.reference_range}</div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
