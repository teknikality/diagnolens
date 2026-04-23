import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { DL_COLORS } from '../tokens.js';
import DLLogo from '../components/DLLogo.jsx';
import Icon from '../components/Icon.jsx';
import { useLang, LanguageSwitcher } from '../i18n/LangContext.jsx';

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;

export default function LoginPage() {
  const { t } = useLang();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (!ACCESS_CODE) {
      setError(t('login.errorConfig'));
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      if (code.trim() === ACCESS_CODE) {
        const token = Date.now().toString(36) + Math.random().toString(36).slice(2);
        login(token, null);
        navigate(from, { replace: true });
      } else {
        setError(t('login.errorWrong'));
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: 'calc(var(--vh, 1vh) * 100)',
      background: DL_COLORS.bgBase,
      color: DL_COLORS.fgPrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo + lang switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DLLogo size={30} />
            <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>DiagnoLens</span>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Card */}
        <div style={{
          background: DL_COLORS.bgSurface,
          border: `1px solid ${DL_COLORS.border}`,
          borderRadius: 16, padding: '32px 28px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {t('login.title')}
          </h1>
          <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 24, lineHeight: 1.5 }}>
            {t('login.sub')}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type={visible ? 'text' : 'password'}
                value={code}
                onChange={e => { setCode(e.target.value); setError(''); }}
                placeholder={t('login.placeholder')}
                autoFocus
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: DL_COLORS.bgRaised,
                  border: `1px solid ${error ? DL_COLORS.warning : DL_COLORS.border}`,
                  borderRadius: 10, padding: '12px 44px 12px 14px',
                  color: DL_COLORS.fgPrimary, fontSize: 15,
                  outline: 'none', transition: 'border-color 150ms',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = DL_COLORS.accentBorder; }}
                onBlur={e => { if (!error) e.target.style.borderColor = DL_COLORS.border; }}
              />
              <button
                type="button"
                onClick={() => setVisible(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                  color: DL_COLORS.fgMuted, display: 'flex', alignItems: 'center',
                }}
              >
                <Icon name={visible ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 8, padding: '9px 12px', marginBottom: 16, fontSize: 13,
                color: DL_COLORS.warning,
              }}>
                <Icon name="alert-circle" size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!code.trim() || loading}
              style={{
                width: '100%',
                background: code.trim() && !loading ? DL_COLORS.accent : DL_COLORS.bgRaised,
                color: code.trim() && !loading ? '#0a1a16' : DL_COLORS.fgMuted,
                border: 'none', borderRadius: 10, padding: '13px',
                fontSize: 15, fontWeight: 600, cursor: code.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 200ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading
                ? <><Icon name="loader" size={16} />{t('login.checking')}</>
                : <><Icon name="arrow-right" size={16} />{t('login.submit')}</>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: DL_COLORS.fgMuted, marginTop: 20 }}>
          {t('login.noCode')}
        </p>
      </div>
    </div>
  );
}
