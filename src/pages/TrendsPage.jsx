import { useNavigate } from 'react-router-dom';
import { useReport } from '../report/ReportContext.jsx';
import TrendsView from '../components/TrendsView.jsx';

export default function TrendsPage() {
  const { reportData, selectBiomarker } = useReport();
  const navigate = useNavigate();

  const handleSelect = (b) => {
    selectBiomarker(b);
    navigate('/detail');
  };

  return <TrendsView reportData={reportData} onSelect={handleSelect} />;
}
