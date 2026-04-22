import { useState, useEffect } from 'react';
import UploadStep from './UploadStep.jsx';
import QuestionStep from './QuestionStep.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';

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

const SS_KEY = 'dl_ob';
function ssRead() { try { return JSON.parse(sessionStorage.getItem(SS_KEY) || '{}'); } catch { return {}; } }
function ssWrite(data) { try { sessionStorage.setItem(SS_KEY, JSON.stringify(data)); } catch {} }
function ssClear() { try { sessionStorage.removeItem(SS_KEY); } catch {} }

export default function OnboardingFlow({ onComplete }) {
  const saved = ssRead();

  const [phase, setPhase]       = useState('upload');
  const [file, setFile]         = useState(null);
  const [fileName, setFileName] = useState(saved.fileName || '');
  const [answers, setAnswers]   = useState(saved.answers || {});
  const [qStep, setQStep]       = useState(saved.qStep   || 0);
  const [retryKey, setRetryKey] = useState(0);

  const hasProgress = !!saved.fileName && Object.keys(saved.answers || {}).length > 0;

  useEffect(() => { ssWrite({ answers, qStep, fileName }); }, [answers, qStep, fileName]);

  useEffect(() => {
    const step = ONBOARDING_STEPS[qStep];
    if (!step || step.type !== 'slider' || answers[step.id] !== undefined) return;
    setAnswers(a => ({ ...a, [step.id]: step.default }));
  }, [qStep]);

  const handleUploadDone = (f) => {
    setFile(f);
    setFileName(f.name);
    setPhase('questions');
  };

  const handleAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const handleNext   = () => { if (qStep < ONBOARDING_STEPS.length - 1) setQStep(s => s + 1); else setPhase('processing'); };
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
    return (
      <QuestionStep
        step={ONBOARDING_STEPS[qStep]}
        stepIndex={qStep}
        totalSteps={ONBOARDING_STEPS.length}
        value={answers[ONBOARDING_STEPS[qStep].id]}
        onChange={(val) => handleAnswer(ONBOARDING_STEPS[qStep].id, val)}
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
