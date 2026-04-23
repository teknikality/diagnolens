import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AppLayout from './pages/AppLayout.jsx';
import UploadPage from './pages/UploadPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import TrendsPage from './pages/TrendsPage.jsx';
import AskPage from './pages/AskPage.jsx';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate('/upload')} />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — upload (outside AppShell) */}
      <Route path="/upload" element={
        <ProtectedRoute><UploadPage /></ProtectedRoute>
      } />

      {/* Protected — inside AppShell */}
      <Route element={
        <ProtectedRoute><AppLayout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/detail"    element={<DetailPage />} />
        <Route path="/reports"   element={<ReportsPage />} />
        <Route path="/trends"    element={<TrendsPage />} />
        <Route path="/ask"       element={<AskPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
