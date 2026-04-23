import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from './en.js';
import hi from './hi.js';
import kn from './kn.js';

const LANGS = { en, hi, kn };
const LS_KEY = 'dl_lang';
const FONT_MAP = {
  en: "'DM Sans', system-ui, sans-serif",
  hi: "'Noto Sans Devanagari', 'DM Sans', system-ui, sans-serif",
  kn: "'Noto Sans Kannada', 'DM Sans', system-ui, sans-serif",
};

function getDeep(obj, path) {
  return path.split('.').reduce((o, k) => (o != null && o[k] !== undefined ? o[k] : undefined), obj);
}

function interpolate(str, vars) {
  if (!vars || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

function applyFont(lang) {
  document.documentElement.style.setProperty('--dl-font', FONT_MAP[lang] || FONT_MAP.en);
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = (() => { try { return localStorage.getItem(LS_KEY) || 'en'; } catch { return 'en'; } })();
    const resolved = LANGS[saved] ? saved : 'en';
    applyFont(resolved);
    return resolved;
  });

  const setLang = useCallback((l) => {
    if (!LANGS[l]) return;
    try { localStorage.setItem(LS_KEY, l); } catch {}
    applyFont(l);
    setLangState(l);
  }, []);

  const t = useCallback((key, vars) => {
    const strings = LANGS[lang] || en;
    let val = getDeep(strings, key);
    if (val === undefined) val = getDeep(en, key);
    if (val === undefined) return key;
    if (typeof val !== 'string') return val;
    return interpolate(val, vars);
  }, [lang]);

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang, setLang]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() { return useContext(LangContext); }

export function LanguageSwitcher({ style }) {
  const { lang, setLang } = useLang();
  const options = [
    { id: 'en', label: 'EN' },
    { id: 'hi', label: 'हि' },
    { id: 'kn', label: 'ಕ' },
  ];
  return (
    <div style={{
      display: 'inline-flex', borderRadius: 8, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)', gap: 0, ...style,
    }}>
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => setLang(opt.id)}
          style={{
            background: lang === opt.id ? 'rgba(0,201,167,0.18)' : 'transparent',
            border: 'none',
            borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            color: lang === opt.id ? '#00C9A7' : '#636369',
            fontSize: 12, fontWeight: lang === opt.id ? 600 : 400,
            padding: '5px 10px', cursor: 'pointer',
            fontFamily: opt.id === 'hi' ? "'Noto Sans Devanagari', sans-serif"
                      : opt.id === 'kn' ? "'Noto Sans Kannada', sans-serif"
                      : "'DM Sans', sans-serif",
            transition: 'all 150ms',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
