import { useNavigate } from 'react-router-dom';
import { useReport } from '../report/ReportContext.jsx';
import DetailView from '../components/DetailView.jsx';

export default function DetailPage() {
  const { selectedBiomarker, clearBiomarker } = useReport();
  const navigate = useNavigate();

  const handleBack = () => {
    clearBiomarker();
    navigate('/dashboard');
  };

  // If navigated here directly without a biomarker (e.g. manual URL), go back to dashboard
  if (!selectedBiomarker) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return <DetailView biomarker={selectedBiomarker} onBack={handleBack} />;
}
