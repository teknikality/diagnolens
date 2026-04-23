import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useReport } from '../report/ReportContext.jsx';
import AppShell from '../components/AppShell.jsx';

const PATH_TO_VIEW = {
  '/dashboard': 'dashboard',
  '/reports':   'reports',
  '/trends':    'trends',
  '/ask':       'ask',
  '/detail':    'detail',
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout }         = useAuth();
  const { clearBiomarker } = useReport();

  const currentView = PATH_TO_VIEW[location.pathname] || 'dashboard';

  const handleNavigate = (view) => {
    if (view === 'upload') { navigate('/upload'); return; }
    clearBiomarker();
    navigate('/' + view);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppShell currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout}>
      <Outlet />
    </AppShell>
  );
}
