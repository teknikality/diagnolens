import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { apiPost } from '../lib/api.js';
import { DL_COLORS } from '../tokens.js';
import DLLogo from '../components/DLLogo.jsx';
import Icon from '../components/Icon.jsx';
import { useLang, LanguageSwitcher } from '../i18n/LangContext.jsx';

export default function LoginPage() {
  const { t } = useLang();
  const { isAuthenticated, loading: authLoading, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [phase, setPhase]     = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone]     = useState('+91');
  const [otp, setOtp]         = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 10) return;
    setLoading(true);
    setError('');
    try {
      await sendOTP(phone.trim());
      setPhase('otp');
    } catch (err) {
      setError(err.message || t('login.errorSend'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const authData = await verifyOTP(phone.trim(), otp.trim());
      // Register with backend
      const result = await apiPost('/api/auth/verify-otp', {
        supabase_access_token: authData.session.access_token,
      });
      // Navigate based on whether this is a new user
      if (result.is_new_user) {
        navigate('/family-setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || t('login.errorOtp'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: DL_COLORS.bgRaised,
    border: `1px solid ${error ? DL_COLORS.warning : DL_COLORS.border}`,
    borderRadius: 10, padding: '12px 14px',
    color: DL_COLORS.fgPrimary, fontSize: 15,
    outline: 'none', transition: 'border-color 150ms',
  };

  const btnDisabled = phase === 'phone' ? (!phone.trim() || phone.length < 10 || loading) : (!otp.trim() || otp.length < 6 || loading);
  const btnStyle = {
    width: '100%',
    background: !btnDisabled ? DL_COLORS.accent : DL_COLORS.bgRaised,
    color: !btnDisabled ? '#0a1a16' : DL_COLORS.fgMuted,
    border: 'none', borderRadius: 10, padding: '13px',
    fontSize: 15, fontWeight: 600,
    cursor: !btnDisabled ? 'pointer' : 'not-allowed',
    transition: 'all 200ms',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
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
            {phase === 'phone' ? (t('login.phoneTitle') || 'Sign in with your phone') : (t('login.otpTitle') || 'Enter verification code')}
          </h1>
          <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 24, lineHeight: 1.5 }}>
            {phase === 'phone'
              ? (t('login.phoneSub') || "We'll send a 6-digit code to verify your number.")
              : (t('login.otpSub') || `Code sent to ${phone}`)}
          </p>

          {phase === 'phone' ? (
            <form onSubmit={handleSendOTP}>
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
                  style={inputStyle}
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

              <button type="submit" disabled={btnDisabled} style={btnStyle}>
                {loading
                  ? <><Icon name="loader" size={16} />{t('login.sending') || 'Sending...'}</>
                  : <><Icon name="arrow-right" size={16} />{t('login.sendOtp') || 'Send OTP'}</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 6, display: 'block' }}>
                  {t('login.otpLabel') || 'Verification code'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="000000"
                  autoFocus
                  style={{ ...inputStyle, letterSpacing: '0.3em', textAlign: 'center', fontSize: 22 }}
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

              <button type="submit" disabled={btnDisabled} style={btnStyle}>
                {loading
                  ? <><Icon name="loader" size={16} />{t('login.verifying') || 'Verifying...'}</>
                  : <><Icon name="arrow-right" size={16} />{t('login.verifyOtp') || 'Verify'}</>}
              </button>

              <button
                type="button"
                onClick={() => { setPhase('phone'); setOtp(''); setError(''); }}
                style={{
                  width: '100%', marginTop: 12, background: 'none', border: 'none',
                  color: DL_COLORS.accent, fontSize: 13, cursor: 'pointer', padding: 8,
                }}
              >
                {t('login.changePhone') || 'Use a different number'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
