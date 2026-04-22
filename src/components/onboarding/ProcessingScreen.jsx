import { useState, useEffect } from 'react';
import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';
import { API_BASE } from '../../config.js';
import { normaliseBiomarker } from '../../utils.js';

function classifyError(err, status) {
  if (err?.name === 'AbortError') return 'timeout';
  if (!status) return 'network';
  if (status === 413) return 'size';
  if (status >= 400 && status < 500) return 'parse';
  return 'server';
}

const ERR = {
  timeout: {
    icon: 'clock', title: 'This is taking longer than usual',
    body: 'Your report may be complex. Your answers have been saved — just try again and it usually goes through.',
    retryLabel: 'Try again', retryPhase: 'processing',
  },
  network: {
    icon: 'wifi-off', title: "We couldn't connect",
    body: "Check your internet connection and try again. Nothing you've entered has been lost.",
    retryLabel: 'Try again', retryPhase: 'processing',
  },
  parse: {
    icon: 'file-x', title: "We couldn't read this file",
    body: 'We had trouble pulling results from it. A clear PDF exported directly from your lab usually works best.',
    retryLabel: 'Upload a different file', retryPhase: 'upload',
  },
  size: {
    icon: 'file-minus', title: 'File is too large',
    body: 'Our limit is 20 MB. Try a compressed PDF or a lower-resolution image and upload again.',
    retryLabel: 'Upload a different file', retryPhase: 'upload',
  },
  server: {
    icon: 'alert-triangle', title: 'Something went wrong on our end',
    body: "It's not your file — our servers hit an unexpected issue. Please try again in a moment.",
    retryLabel: 'Try again', retryPhase: 'processing',
  },
};

const STEPS_DATA = [
  { icon: 'scan-text',     label: 'Reading your report',      detail: 'Extracting text and structure…' },
  { icon: 'flask-conical', label: 'Understanding biomarkers', detail: 'Matching values to clinical references…' },
  { icon: 'sparkles',      label: 'Personalizing insights',   detail: 'Applying your health context…' },
];

export default function ProcessingScreen({ file, answers, onComplete, onRetry }) {
  const [activeStep, setActiveStep]    = useState(0);
  const [completedSteps, setCompleted] = useState([]);
  const [progress, setProgress]        = useState(0);
  const [done, setDone]                = useState(false);
  const [error, setError]              = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => { setCompleted(s => [...s, 0]); setActiveStep(1); }, 2200);
    const t2 = setTimeout(() => { setCompleted(s => [...s, 1]); setActiveStep(2); }, 4600);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (done || error) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p;
        const speed = p < 30 ? 1.4 : p < 60 ? 0.9 : 0.4;
        return Math.min(90, p + speed);
      });
    }, 80);
    return () => clearInterval(id);
  }, [done, error]);

  useEffect(() => {
    let cancelled = false;

    async function callApi() {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 90_000);

      const body = new FormData();
      if (file) body.append('file', file);
      if (answers.age)                body.append('age',            String(answers.age));
      if (answers.conditions?.length) body.append('conditions',     answers.conditions.join(','));
      if (answers.family?.length)     body.append('family_history', answers.family.join(','));
      if (answers.reason)             body.append('reason',         answers.reason);
      if (answers.diet)               body.append('diet',           answers.diet);
      if (answers.activity)           body.append('activity',       answers.activity);
      if (answers.work)               body.append('work',           answers.work);

      let status = null;
      try {
        const res = await fetch(`${API_BASE}/analyze-report`, { method: 'POST', body, signal: controller.signal });
        clearTimeout(timeoutId);
        if (cancelled) return;

        status = res.status;
        if (!res.ok) throw new Error(`HTTP ${status}`);

        const data = await res.json();
        if (cancelled) return;

        if (data.status === 'error') {
          setError(ERR.parse);
          return;
        }

        const reportData = {
          ...data,
          biomarkers: (data.biomarkers || []).map(normaliseBiomarker),
        };

        setProgress(100);
        setCompleted([0, 1, 2]);
        setActiveStep(2);
        setDone(true);
        setTimeout(() => { if (!cancelled) onComplete(reportData); }, 700);
      } catch (err) {
        clearTimeout(timeoutId);
        if (cancelled) return;
        const type = classifyError(err, status);
        setError(ERR[type] || ERR.server);
      }
    }

    callApi();
    return () => { cancelled = true; };
  }, []);

  // ── Error screen ───────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 20px',
        fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
      }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
            background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={error.icon} size={30} style={{ color: DL_COLORS.warning }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>{error.title}</h2>
          <p style={{ fontSize: 14, color: DL_COLORS.fgMuted, lineHeight: 1.65, maxWidth: 320, margin: '0 auto 28px' }}>{error.body}</p>
          <button
            onClick={() => onRetry(error.retryPhase)}
            style={{
              width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
              border: 'none', borderRadius: 12, padding: '15px 24px',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
            }}
          >{error.retryLabel}</button>
          {error.retryPhase === 'processing' && (
            <button
              onClick={() => onRetry('upload')}
              style={{
                width: '100%', background: 'transparent', color: DL_COLORS.fgMuted,
                border: `1px solid ${DL_COLORS.border}`, borderRadius: 12, padding: '13px 24px',
                fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >Upload a different file instead</button>
          )}
        </div>
      </div>
    );
  }

  // ── Processing screen ──────────────────────────────────────────
  return (
    <div style={{
      minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 20px',
      fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Animated icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'processingPulse 2s ease-in-out infinite',
          }}>
            <Icon name={STEPS_DATA[activeStep].icon} size={30} style={{ color: DL_COLORS.accent }} />
          </div>
        </div>

        {/* Step labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
          {STEPS_DATA.map((s, i) => {
            const isCompleted = completedSteps.includes(i);
            const isActive    = activeStep === i && !isCompleted;
            const col = isCompleted ? DL_COLORS.accent : isActive ? DL_COLORS.fgPrimary : DL_COLORS.fgMuted;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isCompleted ? DL_COLORS.accentDim : isActive ? DL_COLORS.bgRaised : 'transparent',
                  border: `1px solid ${isCompleted ? DL_COLORS.accentBorder : isActive ? DL_COLORS.border : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isCompleted
                    ? <Icon name="check" size={14} style={{ color: DL_COLORS.accent }} />
                    : <Icon name={s.icon} size={14} style={{ color: col }} />
                  }
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: col, transition: 'all 300ms' }}>{s.label}</div>
                  {isActive && <div style={{ fontSize: 12, color: DL_COLORS.fgMuted, marginTop: 1 }}>{s.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: DL_COLORS.bgRaised, borderRadius: 100, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: DL_COLORS.accent, borderRadius: 100,
            width: `${progress}%`, transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: DL_COLORS.fgMuted }}>
          This usually takes 15–30 seconds
        </div>
      </div>
    </div>
  );
}
