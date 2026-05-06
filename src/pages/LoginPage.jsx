import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { DL_COLORS } from '../tokens.js';
import DLLogo from '../components/DLLogo.jsx';
import Icon from '../components/Icon.jsx';
import { useLang, LanguageSwitcher } from '../i18n/LangContext.jsx';

export default function LoginPage() {
  const { t } = useLang();
  const { isAuthenticated, loginWithPhone } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [phone, setPhone] = useState('+91');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to={from} replace />;

  const isValid = phone.replace(/\D/g, '').length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError(t('login.errorPhone') || 'Enter a valid phone number');
      return;
    }
    loginWithPhone(phone.trim());
    navigate('/family-setup', { replace: true });
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
            {t('login.phoneTitle') || 'Sign in with your phone'}
          </h1>
          <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 24, lineHeight: 1.5 }}>
            {t('login.phoneSub') || 'Enter your phone number to get started.'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 6, display: 'block' }}>
                {t('login.phoneLabel') || 'Phone number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(''); }}
                placeholder="+91 9876543210"
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: DL_COLORS.bgRaised,
                  border: `1px solid ${error ? DL_COLORS.warning : DL_COLORS.border}`,
                  borderRadius: 10, padding: '12px 14px',
                  color: DL_COLORS.fgPrimary, fontSize: 15,
                  outline: 'none', transition: 'border-color 150ms',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = DL_COLORS.accentBorder; }}
                onBlur={e => { if (!error) e.target.style.borderColor = DL_COLORS.border; }}
              />
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
              disabled={!isValid}
              style={{
                width: '100%',
                background: isValid ? DL_COLORS.accent : DL_COLORS.bgRaised,
                color: isValid ? '#0a1a16' : DL_COLORS.fgMuted,
                border: 'none', borderRadius: 10, padding: '13px',
                fontSize: 15, fontWeight: 600,
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'all 200ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Icon name="arrow-right" size={16} />
              {t('login.continue') || 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
