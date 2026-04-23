import { createContext, useContext, useState } from 'react';

const REPORT_KEY    = 'dl_report';
const BIOMARKER_KEY = 'dl_selected_biomarker';

function ssRead(key)     { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }
function ssWrite(key, d) { try { if (d) sessionStorage.setItem(key, JSON.stringify(d)); else sessionStorage.removeItem(key); } catch {} }

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [reportData, setReportData]               = useState(() => ssRead(REPORT_KEY));
  const [selectedBiomarker, setSelectedBiomarker] = useState(() => ssRead(BIOMARKER_KEY));

  const setReport = (data) => {
    setReportData(data);
    ssWrite(REPORT_KEY, data);
  };

  const selectBiomarker = (b) => {
    setSelectedBiomarker(b);
    ssWrite(BIOMARKER_KEY, b);
  };

  const clearBiomarker = () => {
    setSelectedBiomarker(null);
    ssWrite(BIOMARKER_KEY, null);
  };

  return (
    <ReportContext.Provider value={{ reportData, setReport, selectedBiomarker, selectBiomarker, clearBiomarker }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  return useContext(ReportContext);
}
