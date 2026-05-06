import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../family/FamilyContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { DL_COLORS } from '../tokens.js';
import DLLogo from '../components/DLLogo.jsx';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';

export default function FamilySetupPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const { members, updateMember, addMember } = useFamily();
  const navigate = useNavigate();

  const selfMember = members.find(m => m.relationship === 'self');

  const [step, setStep]         = useState('self'); // 'self' | 'add' | 'done'
  const [selfName, setSelfName] = useState(selfMember?.name || '');
  const [selfAge, setSelfAge]   = useState(selfMember?.age || '');
  const [selfGender, setSelfGender] = useState(selfMember?.gender || '');

  const [newName, setNewName]     = useState('');
  const [newAge, setNewAge]       = useState('');
  const [newGender, setNewGender] = useState('');
  const [newRel, setNewRel]       = useState('other');
  const [saving, setSaving]       = useState(false);

  const handleSaveSelf = async () => {
    if (!selfMember || !selfName.trim() || !selfAge) return;
    setSaving(true);
    try {
      await updateMember(selfMember.id, {
        name: selfName.trim(),
        age: parseInt(selfAge),
        gender: selfGender || undefined,
      });
      setStep('add');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newName.trim() || !newAge) return;
    setSaving(true);
    try {
      await addMember({
        name: newName.trim(),
        age: parseInt(newAge),
        gender: newGender || undefined,
        relationship: newRel,
      });
      setNewName(''); setNewAge(''); setNewGender(''); setNewRel('other');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: DL_COLORS.bgRaised,
    border: `1px solid ${DL_COLORS.border}`,
    borderRadius: 10, padding: '12px 14px',
    color: DL_COLORS.fgPrimary, fontSize: 15, outline: 'none',
  };
  const labelStyle = { fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 6, display: 'block' };
  const btnPrimary = {
    width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
    border: 'none', borderRadius: 10, padding: '13px', fontSize: 15,
    fontWeight: 600, cursor: 'pointer',
  };
  const btnSecondary = {
    width: '100%', background: 'transparent', color: DL_COLORS.accent,
    border: `1px solid ${DL_COLORS.border}`, borderRadius: 10, padding: '12px',
    fontSize: 14, cursor: 'pointer',
  };

  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  const relOptions = [
    { id: 'spouse', label: t('family.relationships.spouse') || 'Spouse' },
    { id: 'child', label: t('family.relationships.child') || 'Child' },
    { id: 'parent', label: t('family.relationships.parent') || 'Parent' },
    { id: 'other', label: t('family.relationships.other') || 'Other' },
  ];

  return (
    <div style={{
      minHeight: 'calc(var(--vh, 1vh) * 100)',
      background: DL_COLORS.bgBase, color: DL_COLORS.fgPrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, gap: 10 }}>
          <DLLogo size={28} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>DiagnoLens</span>
        </div>

        <div style={{
          background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
          borderRadius: 16, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          {step === 'self' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
                {t('family.setup.title') || "Let's set up your profile"}
              </h2>
              <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 24 }}>
                {t('family.setup.selfSub') || 'This helps us personalize your report analysis.'}
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{t('family.setup.name') || 'Your name'}</label>
                <input value={selfName} onChange={e => setSelfName(e.target.value)} placeholder="Name" style={inputStyle} autoFocus />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{t('family.setup.age') || 'Age'}</label>
                <input type="number" value={selfAge} onChange={e => setSelfAge(e.target.value)} placeholder="35" min="1" max="120" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>{t('family.setup.gender') || 'Gender'}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {genderOptions.map(g => (
                    <button key={g.id} onClick={() => setSelfGender(g.id)} style={{
                      flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${selfGender === g.id ? DL_COLORS.accent : DL_COLORS.border}`,
                      background: selfGender === g.id ? DL_COLORS.accentMuted : DL_COLORS.bgRaised,
                      color: DL_COLORS.fgPrimary, fontSize: 13, cursor: 'pointer',
                    }}>{g.label}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleSaveSelf} disabled={!selfName.trim() || !selfAge || saving} style={{
                ...btnPrimary, opacity: (!selfName.trim() || !selfAge || saving) ? 0.5 : 1,
              }}>
                {saving ? 'Saving...' : (t('family.setup.continue') || 'Continue')}
              </button>
            </>
          )}

          {step === 'add' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
                {t('family.setup.addTitle') || 'Add family members'}
              </h2>
              <p style={{ fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 20 }}>
                {t('family.setup.addSub') || 'Track health reports for your family. You can always add more later.'}
              </p>

              {/* Show existing non-self members */}
              {members.filter(m => m.relationship !== 'self').map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', background: DL_COLORS.bgRaised, borderRadius: 8, marginBottom: 8,
                }}>
                  <Icon name="user" size={16} />
                  <span style={{ fontSize: 14 }}>{m.name}</span>
                  <span style={{ fontSize: 12, color: DL_COLORS.fgMuted, marginLeft: 'auto' }}>{m.age_group}</span>
                </div>
              ))}

              <div style={{ marginTop: 16, marginBottom: 14 }}>
                <label style={labelStyle}>Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Family member name" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Age</label>
                  <input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder="Age" min="0" max="120" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Relationship</label>
                  <select value={newRel} onChange={e => setNewRel(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {relOptions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Gender</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {genderOptions.map(g => (
                    <button key={g.id} onClick={() => setNewGender(g.id)} style={{
                      flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${newGender === g.id ? DL_COLORS.accent : DL_COLORS.border}`,
                      background: newGender === g.id ? DL_COLORS.accentMuted : DL_COLORS.bgRaised,
                      color: DL_COLORS.fgPrimary, fontSize: 13, cursor: 'pointer',
                    }}>{g.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleAddMember} disabled={!newName.trim() || !newAge || saving} style={{
                  ...btnPrimary, flex: 1, opacity: (!newName.trim() || !newAge || saving) ? 0.5 : 1,
                }}>
                  {saving ? 'Adding...' : (t('family.addMember') || 'Add member')}
                </button>
              </div>

              <button onClick={() => navigate('/upload', { replace: true })} style={{ ...btnSecondary, marginTop: 12 }}>
                {t('family.setup.skipAndUpload') || "Done — upload a report"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
