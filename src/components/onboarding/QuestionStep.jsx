import { DL_COLORS } from '../../tokens.js';
import Icon from '../Icon.jsx';
import AgeSlider from './AgeSlider.jsx';
import ChipSelect from './ChipSelect.jsx';
import OptionSelect from './OptionSelect.jsx';
import { useLang } from '../../i18n/LangContext.jsx';

export default function QuestionStep({ step, stepIndex, totalSteps, value, onChange, onNext, onBack }) {
  const { t } = useLang();
  const progress = (stepIndex / totalSteps) * 100;
  const effectiveValue = (value === undefined && step?.type === 'slider') ? step.default : value;
  const canContinue = step?.optional || (
    effectiveValue !== undefined && effectiveValue !== null && effectiveValue !== '' &&
    !(Array.isArray(effectiveValue) && effectiveValue.length === 0)
  );

  if (!step) return null;

  return (
    <div style={{
      minHeight: 'calc(var(--vh, 1vh) * 100)', background: DL_COLORS.bgBase,
      display: 'flex', flexDirection: 'column',
      color: DL_COLORS.fgPrimary,
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: DL_COLORS.bgRaised, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${progress + (1 / totalSteps) * 100}%`,
          background: DL_COLORS.accent,
          transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>

      {/* Nav row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: `1px solid ${DL_COLORS.border}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6,
            color: DL_COLORS.fgMuted, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
          }}
        >
          <Icon name="chevron-left" size={16} style={{ color: DL_COLORS.fgMuted }} />
          {t('questions.back')}
        </button>
        <span style={{ fontSize: 12, color: DL_COLORS.fgMuted }}>
          {t('questions.stepOf', { n: stepIndex + 1, total: totalSteps })}
        </span>
        {step.optional ? (
          <button
            onClick={onNext}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
              color: DL_COLORS.fgMuted, fontSize: 13,
            }}
          >{t('questions.skip')}</button>
        ) : (
          <div style={{ width: 56 }} />
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '32px 20px 24px', maxWidth: 500, margin: '0 auto', width: '100%',
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.25 }}>{step.label}</h2>
          <p style={{ fontSize: 14, color: DL_COLORS.fgMuted, lineHeight: 1.6, margin: 0 }}>{step.sub}</p>
        </div>

        {step.type === 'slider'  && <AgeSlider value={value ?? step.default} onChange={onChange} min={step.min} max={step.max} />}
        {step.type === 'chips'   && <ChipSelect options={step.options || []} value={value || []} onChange={onChange} />}
        {step.type === 'options' && <OptionSelect options={step.options || []} value={value} onChange={onChange} />}

        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
          <button
            onClick={onNext}
            disabled={!canContinue}
            style={{
              width: '100%',
              background: canContinue ? DL_COLORS.accent : DL_COLORS.bgRaised,
              color: canContinue ? '#0a1a16' : DL_COLORS.fgMuted,
              border: 'none', borderRadius: 12, padding: '15px 24px',
              fontSize: 15, fontWeight: 600, cursor: canContinue ? 'pointer' : 'not-allowed',
              transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {stepIndex < totalSteps - 1 ? t('questions.continue') : t('questions.analyze')}
            <Icon name={stepIndex < totalSteps - 1 ? 'arrow-right' : 'sparkles'} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
