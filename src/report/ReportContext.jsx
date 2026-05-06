import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useFamily } from '../family/FamilyContext.jsx';

const BIOMARKER_KEY = 'dl_selected_biomarker';

function reportKey(memberId) { return `dl_report_${memberId || 'default'}`; }
function ssRead(key)     { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }
function ssWrite(key, d) { try { if (d) sessionStorage.setItem(key, JSON.stringify(d)); else sessionStorage.removeItem(key); } catch {} }

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const { activeMember } = useFamily();
  const memberId = activeMember?.id;
  const prevMemberRef = useRef(memberId);

  const [reportData, setReportData]               = useState(() => ssRead(reportKey(memberId)));
  const [selectedBiomarker, setSelectedBiomarker] = useState(() => ssRead(BIOMARKER_KEY));

  // Only reload when member actually changes (not on every render)
  useEffect(() => {
    if (prevMemberRef.current === memberId) return;
    prevMemberRef.current = memberId;
    setReportData(ssRead(reportKey(memberId)));
    setSelectedBiomarker(null);
    ssWrite(BIOMARKER_KEY, null);
  }, [memberId]);

  const setReport = (data) => {
    setReportData(data);
    ssWrite(reportKey(memberId), data);
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
