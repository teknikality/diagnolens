import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';
import Badge from './Badge.jsx';
import Card from './Card.jsx';
import Button from './Button.jsx';
import EmptyState from './EmptyState.jsx';

export default function ReportsView({ reportData, onSelect }) {
  const biomarkers = reportData?.biomarkers || [];
  const abnormalCount = biomarkers.filter(b => b.is_abnormal).length;
  const overallStatus = abnormalCount > 2 ? 'warning' : abnormalCount > 0 ? 'caution' : 'normal';

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>My reports</h1>
        <Button variant="primary" size="sm">
          <Icon name="upload-cloud" size={13} />
          Upload new
        </Button>
      </div>

      {!reportData ? (
        <EmptyState message="No reports yet. Upload your first blood panel to get started." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Card
            hover
            style={{ padding: '14px 18px', cursor: 'pointer' }}
            onClick={() => biomarkers[0] && onSelect(biomarkers[0])}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="file-text" size={16} style={{ color: DL_COLORS.fgMuted }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: DL_COLORS.fgPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {reportData.fileName || 'Uploaded report'}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: DL_COLORS.accent,
                    background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                    borderRadius: 100, padding: '1px 7px', flexShrink: 0,
                  }}>Latest</span>
                </div>
                <div style={{ fontSize: 11, color: DL_COLORS.fgMuted }}>
                  {biomarkers.length} biomarker{biomarkers.length !== 1 ? 's' : ''}  ·  {abnormalCount} outside range
                </div>
              </div>
              <Badge status={overallStatus} />
              <Icon name="chevron-right" size={15} style={{ color: DL_COLORS.fgMuted }} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
