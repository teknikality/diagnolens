import { useState, useEffect } from 'react';
import UploadStep from './UploadStep.jsx';
import QuestionStep from './QuestionStep.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';
import { useLang } from '../../i18n/LangContext.jsx';

const STEP_META = [
  { type: 'slider', min: 18, max: 90, default: 35, unit: 'years', optional: false },
  { type: 'chips',   optional: true },
  { type: 'chips',   optional: true },
  { type: 'options', optional: true },
  { type: 'options', optional: false },
  { type: 'options', optional: false },
  { type: 'options', optional: false },
];

const SS_KEY = 'dl_ob';
function ssRead()       { try { return JSON.parse(sessionStorage.getItem(SS_KEY) || '{}'); } catch { return {}; } }
function ssWrite(data)  { try { sessionStorage.setItem(SS_KEY, JSON.stringify(data)); } catch {} }
function ssClear()      { try { sessionStorage.removeItem(SS_KEY); } catch {} }

export default function OnboardingFlow({ onComplete }) {
  const { t } = useLang();
  const saved = ssRead();

  const [phase, setPhase]       = useState('upload');
  const [file, setFile]         = useState(null);
  const [fileName, setFileName] = useState(saved.fileName || '');
  const [answers, setAnswers]   = useState(saved.answers || {});
  const [qStep, setQStep]       = useState(saved.qStep   || 0);
  const [retryKey, setRetryKey] = useState(0);

  const hasProgress = !!saved.fileName && Object.keys(saved.answers || {}).length > 0;

  const getSteps = () => {
    const translatedSteps = t('questions.steps');
    if (!Array.isArray(translatedSteps)) return [];
    return STEP_META.map((meta, i) => ({ ...meta, ...translatedSteps[i] }));
  };

  const steps = getSteps();

  useEffect(() => { ssWrite({ answers, qStep, fileName }); }, [answers, qStep, fileName]);

  useEffect(() => {
    const step = steps[qStep];
    if (!step || step.type !== 'slider' || answers[step.id] !== undefined) return;
    setAnswers(a => ({ ...a, [step.id]: step.default }));
  }, [qStep]);

  const handleUploadDone = (f) => {
    setFile(f);
    setFileName(f.name);
    setPhase('questions');
  };

  const handleAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const handleNext   = () => { if (qStep < steps.length - 1) setQStep(s => s + 1); else setPhase('processing'); };
  const handleBack   = () => { if (qStep > 0) setQStep(s => s - 1); else setPhase('upload'); };

  const handleRetry = (retryPhase) => {
    if (retryPhase === 'upload') { setFile(null); setPhase('upload'); }
    else { setRetryKey(k => k + 1); }
  };

  const handleComplete = (data) => { ssClear(); onComplete(data); };

  if (phase === 'upload') {
    return (
      <UploadStep
        onDone={handleUploadDone}
        hasProgress={hasProgress}
        restoredFileName={fileName}
        restoredStep={qStep}
      />
    );
  }
  if (phase === 'questions') {
    const step = steps[qStep];
    return (
      <QuestionStep
        step={step}
        stepIndex={qStep}
        totalSteps={steps.length}
        value={answers[step?.id]}
        onChange={(val) => handleAnswer(step?.id, val)}
        onNext={handleNext}
        onBack={handleBack}
      />
    );
  }
  return (
    <ProcessingScreen
      key={retryKey}
      file={file}
      answers={answers}
      onComplete={handleComplete}
      onRetry={handleRetry}
    />
  );
}
