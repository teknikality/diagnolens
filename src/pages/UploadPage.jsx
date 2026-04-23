import { useNavigate } from 'react-router-dom';
import { useReport } from '../report/ReportContext.jsx';
import OnboardingFlow from '../components/onboarding/OnboardingFlow.jsx';

export default function UploadPage() {
  const { setReport } = useReport();
  const navigate = useNavigate();

  const handleComplete = (data) => {
    setReport(data);
    navigate('/dashboard', { replace: true });
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
