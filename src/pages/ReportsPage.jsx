import { useNavigate } from 'react-router-dom';
import { useReport } from '../report/ReportContext.jsx';
import ReportsView from '../components/ReportsView.jsx';

export default function ReportsPage() {
  const { reportData, selectBiomarker } = useReport();
  const navigate = useNavigate();

  const handleSelect = (b) => {
    selectBiomarker(b);
    navigate('/detail');
  };

  return <ReportsView reportData={reportData} onSelect={handleSelect} />;
}
