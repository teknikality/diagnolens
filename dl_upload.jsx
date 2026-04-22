// DiagnoLens — Onboarding Flow (upload + personalization + API call)

const ONBOARDING_STEPS = [
  {
    id: 'age', label: 'How old are you?',
    sub: 'Helps us apply the right reference ranges for your results.',
    type: 'slider', min: 18, max: 90, default: 35, unit: 'years', optional: false,
  },
  {
    id: 'conditions', label: 'Any known health conditions?',
    sub: 'Select all that apply. This helps us flag relevant markers.',
    type: 'chips', optional: true,
    options: ['Type 2 diabetes', 'High blood pressure', 'High cholesterol', 'Thyroid disorder', 'Kidney disease', 'Heart disease', 'Anaemia', 'PCOS', 'None of the above'],
  },
  {
    id: 'family', label: 'Any family history of these conditions?',
    sub: 'Genetic risk factors can affect how we interpret your results.',
    type: 'chips', optional: true,
    options: ['Heart disease', 'Diabetes', 'Stroke', 'Cancer', 'High cholesterol', 'Kidney disease', 'None / Not sure'],
  },
  {
    id: 'reason', label: 'What prompted this test?',
    sub: 'Understanding the context helps us focus on what matters.',
    type: 'options', optional: true,
    options: ['Routine annual check', 'Feeling unwell', 'Monitoring a condition', 'Doctor recommended', 'Preventive screening', 'Other'],
  },
  {
    id: 'diet', label: 'How would you describe your diet?',
    sub: 'Diet directly affects many biomarker levels.',
    type: 'options', optional: false,
    options: ['Vegetarian', 'Vegan', 'Non-vegetarian', 'Mixed / Flexitarian', 'Other'],
  },
  {
    id: 'activity', label: 'How active are you?',
    sub: 'Physical activity affects cholesterol, glucose, and more.',
    type: 'options', optional: false,
    options: ['Low — mostly sedentary', 'Moderate — a few times a week', 'High — daily exercise'],
  },
  {
    id: 'work', label: "What's your typical work style?",
    sub: 'Sedentary jobs carry different metabolic risks.',
    type: 'options', optional: false,
    options: ['Sedentary — mostly sitting', 'Mixed — some movement', 'Active — on my feet most of the day'],
  },
];

// ── Persistence helpers ───────────────────────────────────────

const SS_KEY = 'dl_ob';

function ssRead() {
  try { return JSON.parse(sessionStorage.getItem(SS_KEY) || '{}'); } catch { return {}; }
}
function ssWrite(data) {
  try { sessionStorage.setItem(SS_KEY, JSON.stringify(data)); } catch {}
}
function ssClear() {
  try { sessionStorage.removeItem(SS_KEY); } catch {}
}

// ── File validation ───────────────────────────────────────────

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/webp'];
const ACCEPTED_EXTS  = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'webp'];
const MAX_BYTES      = 20 * 1024 * 1024;

function validateFile(file) {
  if (!file) return 'No file selected.';
  const ext = file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTS.includes(ext))
    return 'Please upload a PDF or an image (JPG, PNG, HEIC, WebP).';
  if (file.size > MAX_BYTES)
    return 'This file is over 20 MB. Try a compressed version or a lower-resolution scan.';
  return null;
}

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

// ── Error classification + copy ───────────────────────────────

function classifyError(err, status) {
  if (err?.name === 'AbortError') return 'timeout';
  if (!status) return 'network';
  if (status === 413) return 'size';
  if (status >= 400 && status < 500) return 'parse';
  return 'server';
}

const ERR = {
  timeout: {
    icon: 'clock',
    title: 'This is taking longer than usual',
    body: 'Your report may be complex. Your answers have been saved — just try again and it usually goes through.',
    retryLabel: 'Try again',
    retryPhase: 'processing',
  },
  network: {
    icon: 'wifi-off',
    title: "We couldn't connect",
    body: "Check your internet connection and try again. Nothing you've entered has been lost.",
    retryLabel: 'Try again',
    retryPhase: 'processing',
  },
  parse: {
    icon: 'file-x',
    title: "We couldn't read this file",
    body: 'We had trouble pulling results from it. A clear PDF exported directly from your lab usually works best.',
    retryLabel: 'Upload a different file',
    retryPhase: 'upload',
  },
  size: {
    icon: 'file-minus',
    title: 'File is too large',
    body: 'Our limit is 20 MB. Try a compressed PDF or a lower-resolution image and upload again.',
    retryLabel: 'Upload a different file',
    retryPhase: 'upload',
  },
  server: {
    icon: 'alert-triangle',
    title: 'Something went wrong on our end',
    body: "It's not your file — our servers hit an unexpected issue. Please try again in a moment.",
    retryLabel: 'Try again',
    retryPhase: 'processing',
  },
};

// ── Main Flow Orchestrator ────────────────────────────────────

function OnboardingFlow({ onComplete }) {
  const saved = ssRead();

  const [phase, setPhase]       = React.useState('upload');
  const [file, setFile]         = React.useState(null);
  const [fileName, setFileName] = React.useState(saved.fileName || '');
  const [answers, setAnswers]   = React.useState(saved.answers || {});
  const [qStep, setQStep]       = React.useState(saved.qStep   || 0);
  const [retryKey, setRetryKey] = React.useState(0);

  const hasProgress = !!saved.fileName && Object.keys(saved.answers || {}).length > 0;

  // Persist to sessionStorage on every meaningful state change
  React.useEffect(() => {
    ssWrite({ answers, qStep, fileName });
  }, [answers, qStep, fileName]);

  // Auto-fill default for slider steps when first visited
  React.useEffect(() => {
    const step = ONBOARDING_STEPS[qStep];
    if (!step || step.type !== 'slider' || answers[step.id] !== undefined) return;
    setAnswers(a => ({ ...a, [step.id]: step.default }));
  }, [qStep]);

  const handleUploadDone = (f) => {
    setFile(f);
    setFileName(f.name);
    setPhase('questions');
  };

  const handleAnswer  = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const handleNext    = () => { if (qStep < ONBOARDING_STEPS.length - 1) setQStep(s => s + 1); else setPhase('processing'); };
  const handleBack    = () => { if (qStep > 0) setQStep(s => s - 1); else setPhase('upload'); };

  const handleRetry = (retryPhase) => {
    if (retryPhase === 'upload') {
      setFile(null);
      setPhase('upload');
    } else {
      setRetryKey(k => k + 1);  // force ProcessingScreen remount → re-runs API call
    }
  };

  const handleComplete = (data) => {
    ssClear();
    onComplete(data);
  };

  if (phase === 'upload') {
    return React.createElement(UploadStep, {
      onDone: handleUploadDone,
      hasProgress,
      restoredFileName: fileName,
      restoredStep: qStep,
    });
  }
  if (phase === 'questions') {
    return React.createElement(QuestionStep, {
      step: ONBOARDING_STEPS[qStep],
      stepIndex: qStep,
      totalSteps: ONBOARDING_STEPS.length,
      value: answers[ONBOARDING_STEPS[qStep].id],
      onChange: (val) => handleAnswer(ONBOARDING_STEPS[qStep].id, val),
      onNext: handleNext,
      onBack: handleBack,
    });
  }
  return React.createElement(ProcessingScreen, {
    key: retryKey,
    file, answers,
    onComplete: handleComplete,
    onRetry: handleRetry,
  });
}

// ── Upload Step ───────────────────────────────────────────────

function UploadStep({ onDone, hasProgress, restoredFileName, restoredStep }) {
  const [dragOver, setDragOver]   = React.useState(false);
  const [selection, setSelection] = React.useState(null);  // { file, name, size, error }
  const fileInputRef = React.useRef(null);

  const pick = (f) => {
    if (!f) return;
    const err = validateFile(f);
    setSelection({ file: err ? null : f, name: f.name, size: f.size, error: err });
  };

  const reset = () => {
    setSelection(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wrapStyle = {
    minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '32px 20px',
    fontFamily: "'DM Sans', sans-serif",
  };

  // ── File selected state ───────────────────────────────────
  if (selection) {
    return React.createElement('div', { style: wrapStyle },
      React.createElement('input', {
        ref: fileInputRef, type: 'file',
        accept: '.pdf,image/jpeg,image/png,image/heic,image/webp',
        style: { display: 'none' },
        onChange: e => pick(e.target.files[0]),
      }),

      React.createElement('div', { style: { width: '100%', maxWidth: 440 } },
        // Logo
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, justifyContent: 'center' } },
          React.createElement(DLLogo, { size: 26 }),
          React.createElement('span', { style: { fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: DL_COLORS.fgPrimary } }, 'DiagnoLens')
        ),

        selection.error
          // ── Validation error ─────────────────────────────
          ? React.createElement(React.Fragment, null,
              React.createElement('div', {
                style: {
                  background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}40`,
                  borderRadius: 14, padding: '20px 22px', marginBottom: 16,
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }
              },
                React.createElement('div', {
                  style: {
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }
                }, React.createElement(Icon, { name: 'file-x', size: 18, style: { color: DL_COLORS.warning } })),
                React.createElement('div', null,
                  React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 4 } }, selection.name),
                  React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.warning, lineHeight: 1.55 } }, selection.error)
                )
              ),
              React.createElement('button', {
                onClick: reset,
                style: {
                  width: '100%', background: DL_COLORS.bgSurface, color: DL_COLORS.fgPrimary,
                  border: `1px solid ${DL_COLORS.border}`, borderRadius: 12,
                  padding: '13px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }
              }, 'Choose a different file')
            )
          // ── Valid file preview ───────────────────────────
          : React.createElement(React.Fragment, null,
              // Resume notice
              hasProgress && React.createElement('div', {
                style: {
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                }
              },
                React.createElement(Icon, { name: 'rotate-ccw', size: 14, style: { color: DL_COLORS.accent, flexShrink: 0 } }),
                React.createElement('span', { style: { fontSize: 13, color: DL_COLORS.fgSecondary } },
                  `Your previous answers are saved — you'll continue from question ${restoredStep + 1}.`
                )
              ),

              // File card
              React.createElement('div', {
                style: {
                  background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.accentBorder}`,
                  borderRadius: 14, padding: '18px 20px', marginBottom: 16,
                  display: 'flex', gap: 14, alignItems: 'center',
                }
              },
                React.createElement('div', {
                  style: {
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }
                }, React.createElement(Icon, { name: 'file-text', size: 20, style: { color: DL_COLORS.accent } })),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', {
                    style: {
                      fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2,
                    }
                  }, selection.name),
                  React.createElement('div', { style: { fontSize: 12, color: DL_COLORS.fgMuted } }, fmtSize(selection.size))
                ),
                React.createElement('button', {
                  onClick: reset,
                  style: {
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: DL_COLORS.fgMuted, fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                    transition: 'color 150ms',
                  },
                  onMouseEnter: e => e.currentTarget.style.color = DL_COLORS.fgPrimary,
                  onMouseLeave: e => e.currentTarget.style.color = DL_COLORS.fgMuted,
                },
                  React.createElement(Icon, { name: 'x', size: 14 }),
                  'Change'
                )
              ),

              // Continue button
              React.createElement('button', {
                onClick: () => onDone(selection.file),
                style: {
                  width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
                  border: 'none', borderRadius: 12, padding: '15px 24px',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }
              },
                hasProgress ? `Continue from question ${restoredStep + 1}` : 'Continue',
                React.createElement(Icon, { name: 'arrow-right', size: 16 })
              )
            )
      )
    );
  }

  // ── Idle / drop zone ──────────────────────────────────────
  return React.createElement('div', { style: wrapStyle },
    React.createElement('input', {
      ref: fileInputRef, type: 'file',
      accept: '.pdf,image/jpeg,image/png,image/heic,image/webp',
      style: { display: 'none' },
      onChange: e => pick(e.target.files[0]),
    }),

    React.createElement('div', { style: { width: '100%', maxWidth: 440 } },
      // Logo
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, justifyContent: 'center' } },
        React.createElement(DLLogo, { size: 26 }),
        React.createElement('span', { style: { fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: DL_COLORS.fgPrimary } }, 'DiagnoLens')
      ),

      React.createElement('h1', { style: { fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center', color: DL_COLORS.fgPrimary } }, 'Upload your lab report'),
      React.createElement('p', { style: { fontSize: 14, color: DL_COLORS.fgMuted, textAlign: 'center', marginBottom: hasProgress ? 16 : 28, lineHeight: 1.6 } }, 'PDF, image, or screenshot · up to 20 MB'),

      // Resume banner
      hasProgress && React.createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: 10,
          background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
          borderRadius: 10, padding: '10px 14px', marginBottom: 16,
        }
      },
        React.createElement(Icon, { name: 'rotate-ccw', size: 14, style: { color: DL_COLORS.accent, flexShrink: 0 } }),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgPrimary, fontWeight: 500, marginBottom: 1 } }, 'Previous answers saved'),
          React.createElement('div', {
            style: { fontSize: 12, color: DL_COLORS.fgMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
          }, restoredFileName || 'Re-upload your file to continue')
        )
      ),

      // Drop zone
      React.createElement('div', {
        style: {
          border: `2px dashed ${dragOver ? DL_COLORS.accent : DL_COLORS.borderDefault}`,
          borderRadius: 16, padding: '44px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          cursor: 'pointer', transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
          background: dragOver ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
          marginBottom: 16,
        },
        onDragOver: e => { e.preventDefault(); setDragOver(true); },
        onDragLeave: () => setDragOver(false),
        onDrop: e => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files[0]); },
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
      },
        React.createElement('div', {
          style: {
            width: 60, height: 60, borderRadius: 16, flexShrink: 0,
            background: dragOver ? 'rgba(0,201,167,0.18)' : DL_COLORS.bgRaised,
            border: `1px solid ${dragOver ? DL_COLORS.accentBorder : DL_COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 200ms',
          }
        }, React.createElement(Icon, { name: 'upload-cloud', size: 26, style: { color: dragOver ? DL_COLORS.accent : DL_COLORS.fgMuted } })),
        React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 4 } }, 'Drop your report here'),
          React.createElement('div', { style: { fontSize: 13, color: DL_COLORS.fgMuted } }, 'or tap to browse files')
        ),
        React.createElement('button', {
          onClick: e => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); },
          style: {
            background: DL_COLORS.accent, color: '#0a1a16', border: 'none',
            borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }
        }, 'Choose file')
      ),

      // Supported types
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 } },
        ['Blood panel', 'Lipid panel', 'Thyroid', 'HbA1c', 'Metabolic panel', 'Urine'].map(t =>
          React.createElement('span', {
            key: t,
            style: {
              fontSize: 11, color: DL_COLORS.fgMuted, background: DL_COLORS.bgRaised,
              border: `1px solid ${DL_COLORS.border}`, borderRadius: 100, padding: '3px 10px',
            }
          }, t)
        )
      ),

      React.createElement('p', {
        style: { fontSize: 12, color: DL_COLORS.fgMuted, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }
      },
        React.createElement(Icon, { name: 'lock', size: 12, style: { color: DL_COLORS.fgMuted } }),
        'Your report is encrypted and never shared'
      )
    )
  );
}

// ── Question Step ─────────────────────────────────────────────

function QuestionStep({ step, stepIndex, totalSteps, value, onChange, onNext, onBack }) {
  const progress = ((stepIndex) / totalSteps) * 100;
  const effectiveValue = (value === undefined && step.type === 'slider') ? step.default : value;
  const canContinue = step.optional || (effectiveValue !== undefined && effectiveValue !== null && effectiveValue !== '' &&
    !(Array.isArray(effectiveValue) && effectiveValue.length === 0));

  return React.createElement('div', {
    style: {
      minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
    }
  },
    React.createElement('div', { style: { height: 3, background: DL_COLORS.bgRaised, position: 'relative' } },
      React.createElement('div', {
        style: {
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${progress + (1 / totalSteps) * 100}%`,
          background: DL_COLORS.accent,
          transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)',
        }
      })
    ),

    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: `1px solid ${DL_COLORS.border}`,
      }
    },
      React.createElement('button', {
        onClick: onBack,
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: 6,
          color: DL_COLORS.fgMuted, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
        }
      },
        React.createElement(Icon, { name: 'chevron-left', size: 16, style: { color: DL_COLORS.fgMuted } }),
        'Back'
      ),
      React.createElement('span', { style: { fontSize: 12, color: DL_COLORS.fgMuted } }, `${stepIndex + 1} of ${totalSteps}`),
      step.optional
        ? React.createElement('button', {
            onClick: onNext,
            style: {
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
              color: DL_COLORS.fgMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }
          }, 'Skip')
        : React.createElement('div', { style: { width: 56 } })
    ),

    React.createElement('div', {
      style: {
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '32px 20px 24px', maxWidth: 500, margin: '0 auto', width: '100%',
      }
    },
      React.createElement('div', { style: { marginBottom: 28 } },
        React.createElement('h2', { style: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.25 } }, step.label),
        React.createElement('p', { style: { fontSize: 14, color: DL_COLORS.fgMuted, lineHeight: 1.6 } }, step.sub)
      ),

      step.type === 'slider'  && React.createElement(AgeSlider,    { value: value ?? step.default, onChange, min: step.min, max: step.max }),
      step.type === 'chips'   && React.createElement(ChipSelect,   { options: step.options, value: value || [], onChange }),
      step.type === 'options' && React.createElement(OptionSelect, { options: step.options, value, onChange }),

      React.createElement('div', { style: { marginTop: 'auto', paddingTop: 28 } },
        React.createElement('button', {
          onClick: onNext, disabled: !canContinue,
          style: {
            width: '100%',
            background: canContinue ? DL_COLORS.accent : DL_COLORS.bgRaised,
            color: canContinue ? '#0a1a16' : DL_COLORS.fgMuted,
            border: 'none', borderRadius: 12, padding: '15px 24px',
            fontSize: 15, fontWeight: 600, cursor: canContinue ? 'pointer' : 'not-allowed',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }
        },
          stepIndex < totalSteps - 1 ? 'Continue' : 'Analyze my report',
          React.createElement(Icon, { name: stepIndex < totalSteps - 1 ? 'arrow-right' : 'sparkles', size: 16 })
        )
      )
    )
  );
}

// ── Age Slider ────────────────────────────────────────────────

function AgeSlider({ value, onChange, min, max }) {
  return React.createElement('div', null,
    React.createElement('div', { style: { textAlign: 'center', marginBottom: 28 } },
      React.createElement('span', {
        style: {
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 72, fontWeight: 700, color: DL_COLORS.accent,
          letterSpacing: '-0.04em', lineHeight: 1,
        }
      }, value),
      React.createElement('span', { style: { fontSize: 18, color: DL_COLORS.fgMuted, marginLeft: 6 } }, 'years')
    ),
    React.createElement('input', {
      type: 'range', min, max, value,
      onChange: e => onChange(parseInt(e.target.value)),
      style: { width: '100%', accentColor: DL_COLORS.accent, height: 6, cursor: 'pointer' }
    }),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
      React.createElement('span', { style: { fontSize: 11, color: DL_COLORS.fgMuted } }, min),
      React.createElement('span', { style: { fontSize: 11, color: DL_COLORS.fgMuted } }, max)
    )
  );
}

// ── Chip Multi-select ─────────────────────────────────────────

function ChipSelect({ options, value, onChange }) {
  const toggle = (opt) => {
    const cur = value || [];
    const next = cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt];
    onChange(next);
  };
  return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
    options.map(opt => {
      const selected = (value || []).includes(opt);
      return React.createElement('button', {
        key: opt, onClick: () => toggle(opt),
        style: {
          padding: '10px 16px', borderRadius: 100, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
          border: `1px solid ${selected ? DL_COLORS.accent : DL_COLORS.border}`,
          background: selected ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
          color: selected ? DL_COLORS.accent : DL_COLORS.fgSecondary,
          transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }
      },
        selected && React.createElement(Icon, { name: 'check', size: 14, style: { color: DL_COLORS.accent } }),
        opt
      );
    })
  );
}

// ── Single Option Select ──────────────────────────────────────

function OptionSelect({ options, value, onChange }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
    options.map(opt => {
      const selected = value === opt;
      return React.createElement('button', {
        key: opt, onClick: () => onChange(opt),
        style: {
          width: '100%', padding: '14px 18px',
          border: `1px solid ${selected ? DL_COLORS.accent : DL_COLORS.border}`,
          borderRadius: 12, cursor: 'pointer',
          background: selected ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
          color: selected ? DL_COLORS.accent : DL_COLORS.fgSecondary,
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
          textAlign: 'left', transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }
      },
        opt,
        selected && React.createElement(Icon, { name: 'check-circle', size: 18, style: { color: DL_COLORS.accent } })
      );
    })
  );
}

// ── Processing Screen — real API call with error handling ─────

const PROCESSING_STEPS_DATA = [
  { icon: 'scan-text',     label: 'Reading your report',      detail: 'Extracting text and structure…' },
  { icon: 'flask-conical', label: 'Understanding biomarkers', detail: 'Matching values to clinical references…' },
  { icon: 'sparkles',      label: 'Personalizing insights',   detail: 'Applying your health context…' },
];

function ProcessingScreen({ file, answers, onComplete, onRetry }) {
  const [activeStep, setActiveStep]    = React.useState(0);
  const [completedSteps, setCompleted] = React.useState([]);
  const [progress, setProgress]        = React.useState(0);
  const [done, setDone]                = React.useState(false);
  const [error, setError]              = React.useState(null);   // { type, title, body, retryLabel, retryPhase }

  // Step animation while API is in-flight
  React.useEffect(() => {
    const t1 = setTimeout(() => { setCompleted(s => [...s, 0]); setActiveStep(1); }, 2200);
    const t2 = setTimeout(() => { setCompleted(s => [...s, 1]); setActiveStep(2); }, 4600);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  // Smooth indeterminate progress bar
  React.useEffect(() => {
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

  // Real API call with timeout
  React.useEffect(() => {
    let cancelled = false;

    async function callApi() {
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 90_000);

      const body = new FormData();
      if (file) body.append('file', file);
      if (answers.age)                         body.append('age',            String(answers.age));
      if (answers.conditions?.length)          body.append('conditions',     answers.conditions.join(','));
      if (answers.family?.length)              body.append('family_history', answers.family.join(','));
      if (answers.reason)                      body.append('reason',         answers.reason);
      if (answers.diet)                        body.append('diet',           answers.diet);
      if (answers.activity)                    body.append('activity',       answers.activity);
      if (answers.work)                        body.append('work',           answers.work);

      let status = null;
      try {
        const res = await fetch(`${API_BASE}/analyze-report`, { method: 'POST', body, signal: controller.signal });
        clearTimeout(timeoutId);
        if (cancelled) return;

        status = res.status;

        if (!res.ok) {
          throw new Error(`HTTP ${status}`);
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.status === 'error') {
          // API returned a logical error (e.g. couldn't parse the document)
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

  // ── Error screen ──────────────────────────────────────────
  if (error) {
    return React.createElement('div', {
      style: {
        minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px 20px',
        fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
      }
    },
      React.createElement('div', { style: { width: '100%', maxWidth: 400, textAlign: 'center' } },
        // Icon
        React.createElement('div', {
          style: {
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
            background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }
        },
          React.createElement(Icon, { name: error.icon, size: 30, style: { color: DL_COLORS.warning } })
        ),

        React.createElement('h2', { style: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 } }, error.title),
        React.createElement('p', {
          style: { fontSize: 14, color: DL_COLORS.fgMuted, lineHeight: 1.65, maxWidth: 320, margin: '0 auto 28px' }
        }, error.body),

        // Primary retry
        React.createElement('button', {
          onClick: () => onRetry(error.retryPhase),
          style: {
            width: '100%', background: DL_COLORS.accent, color: '#0a1a16', border: 'none',
            borderRadius: 12, padding: '14px 24px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 10,
          }
        },
          React.createElement(Icon, { name: error.retryPhase === 'processing' ? 'rotate-cw' : 'upload-cloud', size: 15 }),
          error.retryLabel
        ),

        // Secondary: always offer going back to upload as escape hatch
        error.retryPhase === 'processing' && React.createElement('button', {
          onClick: () => onRetry('upload'),
          style: {
            width: '100%', background: 'transparent', color: DL_COLORS.fgMuted, border: 'none',
            padding: '10px', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }
        }, 'Upload a different file instead')
      )
    );
  }

  // ── Processing screen ─────────────────────────────────────
  return React.createElement('div', {
    style: {
      minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 20px',
      fontFamily: "'DM Sans', sans-serif", color: DL_COLORS.fgPrimary,
    }
  },
    React.createElement('div', { style: { width: '100%', maxWidth: 400, textAlign: 'center' } },
      // Animated icon
      React.createElement('div', {
        style: {
          width: 72, height: 72, borderRadius: 20,
          background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: done ? 'none' : 'processingPulse 2s ease-in-out infinite',
        }
      },
        done
          ? React.createElement(Icon, { name: 'check', size: 30, style: { color: DL_COLORS.accent } })
          : React.createElement(Icon, { name: 'file-text', size: 28, style: { color: DL_COLORS.accent } })
      ),

      React.createElement('h2', { style: { fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 } },
        done ? 'Your report is ready' : 'Analyzing your report…'
      ),
      React.createElement('p', { style: { fontSize: 14, color: DL_COLORS.fgMuted, marginBottom: 36, lineHeight: 1.6 } },
        done ? 'Personalized insights are waiting for you.' : 'This usually takes 15–30 seconds.'
      ),

      // Progress bar
      React.createElement('div', {
        style: { background: DL_COLORS.bgRaised, borderRadius: 100, height: 5, overflow: 'hidden', marginBottom: 36 }
      },
        React.createElement('div', {
          style: {
            height: '100%', width: `${progress}%`,
            background: done
              ? `linear-gradient(90deg, ${DL_COLORS.normal}, ${DL_COLORS.accent})`
              : `linear-gradient(90deg, ${DL_COLORS.accent}, ${DL_COLORS.accentHover})`,
            borderRadius: 100,
            transition: progress === 100 ? 'width 600ms ease, background 500ms' : 'width 400ms ease',
          }
        })
      ),

      // Step list
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' } },
        PROCESSING_STEPS_DATA.map((step, i) => {
          const isDone    = completedSteps.includes(i) || done;
          const isActive  = activeStep === i && !isDone;
          const isPending = activeStep < i && !done;
          return React.createElement('div', {
            key: step.label,
            style: {
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 12,
              background: isDone ? 'rgba(52,211,153,0.07)' : isActive ? DL_COLORS.accentDim : 'transparent',
              border: `1px solid ${isDone ? 'rgba(52,211,153,0.2)' : isActive ? DL_COLORS.accentBorder : DL_COLORS.border}`,
              opacity: isPending ? 0.35 : 1,
              transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
            }
          },
            React.createElement('div', {
              style: {
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: isDone ? 'rgba(52,211,153,0.15)' : isActive ? 'rgba(0,201,167,0.15)' : DL_COLORS.bgRaised,
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : isActive ? DL_COLORS.accentBorder : DL_COLORS.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 250ms',
              }
            },
              isDone
                ? React.createElement(Icon, { name: 'check', size: 16, style: { color: DL_COLORS.normal } })
                : isActive
                  ? React.createElement('div', {
                      style: {
                        width: 10, height: 10, borderRadius: '50%', background: DL_COLORS.accent,
                        animation: 'dotPulse 1.2s ease-in-out infinite',
                      }
                    })
                  : React.createElement(Icon, { name: step.icon, size: 16, style: { color: DL_COLORS.fgMuted } })
            ),
            React.createElement('div', null,
              React.createElement('div', {
                style: {
                  fontSize: 14, fontWeight: 500,
                  color: isDone ? DL_COLORS.normal : isActive ? DL_COLORS.fgPrimary : DL_COLORS.fgMuted,
                  marginBottom: isActive ? 2 : 0, transition: 'color 300ms',
                }
              }, step.label),
              isActive && React.createElement('div', {
                style: { fontSize: 12, color: DL_COLORS.fgMuted, lineHeight: 1.4 }
              }, step.detail)
            )
          );
        })
      )
    ),

    React.createElement('style', null, `
      @keyframes processingPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0,201,167,0.2); }
        50%       { box-shadow: 0 0 0 12px rgba(0,201,167,0); }
      }
      @keyframes dotPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.8); }
      }
    `)
  );
}

Object.assign(window, { OnboardingFlow });
