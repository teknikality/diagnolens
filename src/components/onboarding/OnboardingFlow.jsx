import { useState, useEffect } from 'react';
import UploadStep from './UploadStep.jsx';
import QuestionStep from './QuestionStep.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';
import MemberSelectStep from './MemberSelectStep.jsx';
import { useLang } from '../../i18n/LangContext.jsx';
import { useFamily } from '../../family/FamilyContext.jsx';

const STEP_META = [
  { type: 'slider', min: 0, max: 100, default: 35, unit: 'years', optional: false },
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
  const { members, activeMember, switchMember } = useFamily();
  const saved = ssRead();

  const [phase, setPhase]           = useState('member-select'); // 'member-select' | 'upload' | 'questions' | 'processing'
  const [selectedMember, setSelectedMember] = useState(saved.selectedMemberId ? members.find(m => m.id === saved.selectedMemberId) : activeMember);
  const [file, setFile]             = useState(null);
  const [fileName, setFileName]     = useState(saved.fileName || '');
  const [answers, setAnswers]       = useState(saved.answers || {});
  const [qStep, setQStep]          = useState(saved.qStep   || 0);
  const [retryKey, setRetryKey]     = useState(0);

  // Skip member select if only 1 member — run once when members load
  const membersLen = members.length;
  const activeMemberId = activeMember?.id;
  useEffect(() => {
    if (phase === 'member-select' && membersLen <= 1 && activeMemberId) {
      setSelectedMember(activeMember);
      setPhase('upload');
    }
  }, [phase, membersLen, activeMemberId]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasProgress = !!saved.fileName && Object.keys(saved.answers || {}).length > 0;

  const getSteps = () => {
    const translatedSteps = t('questions.steps');
    if (!Array.isArray(translatedSteps)) return [];
    return STEP_META.map((meta, i) => ({ ...meta, ...translatedSteps[i] }));
  };

  const steps = getSteps();

  useEffect(() => { ssWrite({ answers, qStep, fileName, selectedMemberId: selectedMember?.id }); }, [answers, qStep, fileName, selectedMember]);

  useEffect(() => {
    const step = steps[qStep];
    if (!step || step.type !== 'slider' || answers[step.id] !== undefined) return;
    setAnswers(a => ({ ...a, [step.id]: step.default }));
  }, [qStep]);

  const handleMemberSelected = (member) => {
    setSelectedMember(member);
    switchMember(member);
    // Pre-fill age from member profile if available
    if (member.age) {
      setAnswers(a => ({ ...a, age: member.age }));
    }
    setPhase('upload');
  };

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

  if (phase === 'member-select') {
    return (
      <MemberSelectStep
        members={members}
        activeMember={activeMember}
        onSelect={handleMemberSelected}
      />
    );
  }
  if (phase === 'upload') {
    return (
      <UploadStep
        onDone={handleUploadDone}
        hasProgress={hasProgress}
        restoredFileName={fileName}
        restoredStep={qStep}
        memberName={selectedMember?.name}
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
      memberId={selectedMember?.id}
      onComplete={handleComplete}
      onRetry={handleRetry}
    />
  );
}
