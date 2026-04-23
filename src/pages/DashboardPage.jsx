import { useNavigate } from 'react-router-dom';
import { useReport } from '../report/ReportContext.jsx';
import DashboardView from '../components/DashboardView.jsx';

export default function DashboardPage() {
  const { reportData, selectBiomarker } = useReport();
  const navigate = useNavigate();

  const handleSelectBiomarker = (b) => {
    selectBiomarker(b);
    navigate('/detail');
  };

  return <DashboardView reportData={reportData} onSelectBiomarker={handleSelectBiomarker} />;
}
