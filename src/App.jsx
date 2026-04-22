import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import AppShell from './components/AppShell.jsx';
import DashboardView from './components/DashboardView.jsx';
import DetailView from './components/DetailView.jsx';
import ReportsView from './components/ReportsView.jsx';
import TrendsView from './components/TrendsView.jsx';
import AskView from './components/AskView.jsx';
import OnboardingFlow from './components/onboarding/OnboardingFlow.jsx';

const STORAGE_KEY   = 'diagnolens_v2_state';
const SS_REPORT_KEY = 'dl_report';

function ssReadReport()  { try { return JSON.parse(sessionStorage.getItem(SS_REPORT_KEY) || 'null'); } catch { return null; } }
function ssWriteReport(d){ try { sessionStorage.setItem(SS_REPORT_KEY, JSON.stringify(d)); } catch {} }

export default function App() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } })();

  const [screen, setScreen]                   = useState(saved.screen || 'landing');
  const [appView, setAppView]                 = useState(saved.appView || 'dashboard');
  const [selectedBiomarker, setSelectedBiomarker] = useState(null);
  const [reportData, setReportData]           = useState(() => ssReadReport());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, appView }));
  }, [screen, appView]);

  const goToApp = () => setScreen('onboarding');

  const onOnboardingComplete = (data) => {
    if (data) { setReportData(data); ssWriteReport(data); }
    setScreen('app');
    setAppView('dashboard');
  };

  const handleNavNavigate = (v) => {
    if (v === 'upload') { setScreen('onboarding'); return; }
    setAppView(v);
    setSelectedBiomarker(null);
  };

  const handleSelectBiomarker = (b) => { setSelectedBiomarker(b); setAppView('detail'); };
  const handleBack = () => { setSelectedBiomarker(null); setAppView('dashboard'); };

  const renderAppContent = () => {
    if (appView === 'detail' && selectedBiomarker)
      return <DetailView biomarker={selectedBiomarker} onBack={handleBack} />;
    if (appView === 'reports')
      return <ReportsView reportData={reportData} onSelect={handleSelectBiomarker} />;
    if (appView === 'trends')
      return <TrendsView reportData={reportData} onSelect={handleSelectBiomarker} />;
    if (appView === 'ask')
      return <AskView reportData={reportData} />;
    return <DashboardView reportData={reportData} onSelectBiomarker={handleSelectBiomarker} />;
  };

  if (screen === 'landing')
    return <div className="screen-enter"><LandingPage onGetStarted={goToApp} /></div>;

  if (screen === 'onboarding')
    return <div className="screen-enter"><OnboardingFlow onComplete={onOnboardingComplete} /></div>;

  return (
    <div className="screen-enter">
      <AppShell currentView={appView} onNavigate={handleNavNavigate}>
        {renderAppContent()}
      </AppShell>
    </div>
  );
}
