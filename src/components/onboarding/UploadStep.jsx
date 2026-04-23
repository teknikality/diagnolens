import { useState, useRef } from 'react';
import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';
import DLLogo from '../DLLogo.jsx';
import { useLang } from '../../i18n/LangContext.jsx';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/webp'];
const ACCEPTED_EXTS  = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'webp'];
const MAX_BYTES      = 20 * 1024 * 1024;

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

export default function UploadStep({ onDone, hasProgress, restoredFileName, restoredStep }) {
  const { t } = useLang();
  const [dragOver, setDragOver]   = useState(false);
  const [selection, setSelection] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTS.includes(ext))
      return t('upload.errorInvalid');
    if (file.size > MAX_BYTES)
      return t('upload.errorSize');
    return null;
  };

  const pick = (f) => {
    if (!f) return;
    const err = validateFile(f);
    setSelection({ file: err ? null : f, name: f.name, size: f.size, error: err });
  };

  const reset = () => {
    setSelection(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wrapStyle = {
    minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '32px 20px',
  };

  if (selection) {
    return (
      <div style={wrapStyle}>
        <input
          ref={fileInputRef} type="file"
          accept=".pdf,image/jpeg,image/png,image/heic,image/webp"
          style={{ display: 'none' }}
          onChange={e => pick(e.target.files[0])}
        />
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, justifyContent: 'center' }}>
            <DLLogo size={26} />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: DL_COLORS.fgPrimary }}>DiagnoLens</span>
          </div>

          {selection.error ? (
            <>
              <div style={{
                background: DL_COLORS.warningBg, border: `1px solid ${DL_COLORS.warning}40`,
                borderRadius: 14, padding: '20px 22px', marginBottom: 16,
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="file-x" size={18} style={{ color: DL_COLORS.warning }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 4 }}>{selection.name}</div>
                  <div style={{ fontSize: 13, color: DL_COLORS.warning, lineHeight: 1.55 }}>{selection.error}</div>
                </div>
              </div>
              <button
                onClick={reset}
                style={{
                  width: '100%', background: DL_COLORS.bgSurface, color: DL_COLORS.fgPrimary,
                  border: `1px solid ${DL_COLORS.border}`, borderRadius: 12,
                  padding: '13px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >{t('upload.chooseDifferent')}</button>
            </>
          ) : (
            <>
              {hasProgress && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                }}>
                  <Icon name="rotate-ccw" size={14} style={{ color: DL_COLORS.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: DL_COLORS.fgSecondary }}>
                    {t('upload.savedResume', { n: restoredStep + 1 })}
                  </span>
                </div>
              )}

              <div style={{
                background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.accentBorder}`,
                borderRadius: 14, padding: '18px 20px', marginBottom: 16,
                display: 'flex', gap: 14, alignItems: 'center',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="file-text" size={20} style={{ color: DL_COLORS.accent }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DL_COLORS.fgPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                    {selection.name}
                  </div>
                  <div style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>{fmtSize(selection.size)}</div>
                </div>
                <button
                  onClick={reset}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: DL_COLORS.fgMuted, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, transition: 'color 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = DL_COLORS.fgPrimary}
                  onMouseLeave={e => e.currentTarget.style.color = DL_COLORS.fgMuted}
                >
                  <Icon name="x" size={14} />
                  {t('upload.change')}
                </button>
              </div>

              <button
                onClick={() => onDone(selection.file)}
                style={{
                  width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
                  border: 'none', borderRadius: 12, padding: '15px 24px',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {hasProgress ? t('upload.continueFromStep', { n: restoredStep + 1 }) : t('upload.continueBtn')}
                <Icon name="arrow-right" size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <input
        ref={fileInputRef} type="file"
        accept=".pdf,image/jpeg,image/png,image/heic,image/webp"
        style={{ display: 'none' }}
        onChange={e => pick(e.target.files[0])}
      />
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, justifyContent: 'center' }}>
          <DLLogo size={26} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: DL_COLORS.fgPrimary }}>DiagnoLens</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center', color: DL_COLORS.fgPrimary }}>
          {t('upload.title')}
        </h1>
        <p style={{ fontSize: 14, color: DL_COLORS.fgMuted, textAlign: 'center', marginBottom: hasProgress ? 16 : 28, lineHeight: 1.6 }}>
          {t('upload.sub')}
        </p>

        {hasProgress && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: DL_COLORS.accentDim, border: `1px solid ${DL_COLORS.accentBorder}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          }}>
            <Icon name="rotate-ccw" size={14} style={{ color: DL_COLORS.accent, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: DL_COLORS.fgPrimary, fontWeight: 500, marginBottom: 1 }}>{t('upload.savedProgress')}</div>
              <div style={{ fontSize: 12, color: DL_COLORS.fgMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {restoredFileName || t('upload.savedProgressSub2')}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            border: `2px dashed ${dragOver ? DL_COLORS.accent : DL_COLORS.borderDefault}`,
            borderRadius: 16, padding: '44px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            cursor: 'pointer', transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
            background: dragOver ? DL_COLORS.accentDim : DL_COLORS.bgSurface,
            marginBottom: 16,
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{
            width: 60, height: 60, borderRadius: 16, flexShrink: 0,
            background: dragOver ? 'rgba(0,201,167,0.18)' : DL_COLORS.bgRaised,
            border: `1px solid ${dragOver ? DL_COLORS.accentBorder : DL_COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms',
          }}>
            <Icon name="upload-cloud" size={26} style={{ color: dragOver ? DL_COLORS.accent : DL_COLORS.fgMuted }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: DL_COLORS.fgPrimary, marginBottom: 4 }}>{t('upload.dropHere')}</div>
            <div style={{ fontSize: 13, color: DL_COLORS.fgMuted }}>{t('upload.orTap')}</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            style={{
              background: DL_COLORS.accent, color: '#0a1a16', border: 'none',
              borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >{t('upload.chooseFile')}</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {t('upload.tags').map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: DL_COLORS.fgMuted, background: DL_COLORS.bgRaised,
              border: `1px solid ${DL_COLORS.border}`, borderRadius: 100, padding: '3px 10px',
            }}>{tag}</span>
          ))}
        </div>

        <p style={{ fontSize: 12, color: DL_COLORS.fgMuted, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, margin: 0 }}>
          <Icon name="lock" size={12} style={{ color: DL_COLORS.fgMuted }} />
          {t('upload.privacy')}
        </p>
      </div>
    </div>
  );
}
