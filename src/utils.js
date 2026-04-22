export function mapApiStatus(apiStatus) {
  const map = {
    NORMAL:     'normal',
    HIGH:       'warning',
    LOW:        'warning',
    BORDERLINE: 'caution',
    UNKNOWN:    'info',
  };
  return map[(apiStatus || '').toUpperCase()] || 'info';
}

export function normaliseBiomarker(b) {
  return {
    name:            b.name             || 'Unknown',
    value:           String(b.value     || '—'),
    unit:            b.unit             || '',
    reference_range: b.reference_range  || '',
    status:          mapApiStatus(b.status),
    apiStatus:       (b.status          || '').toUpperCase(),
    category:        b.category         || 'General',
    is_abnormal:     !!b.is_abnormal,
    insight: {
      meaning: b.insight?.meaning || '',
      advice:  Array.isArray(b.insight?.advice) ? b.insight.advice : [],
    },
  };
}
