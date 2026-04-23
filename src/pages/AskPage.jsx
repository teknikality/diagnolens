import { useReport } from '../report/ReportContext.jsx';
import AskView from '../components/AskView.jsx';

export default function AskPage() {
  const { reportData } = useReport();
  return <AskView reportData={reportData} />;
}
