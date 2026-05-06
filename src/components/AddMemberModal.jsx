import { useState } from 'react';
import { useFamily } from '../family/FamilyContext.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';

export default function AddMemberModal({ onClose }) {
  const { t } = useLang();
  const { addMember } = useFamily();

  const [name, setName]     = useState('');
  const [age, setAge]       = useState('');
  const [gender, setGender] = useState('');
  const [rel, setRel]       = useState('other');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSave = async () => {
    if (!name.trim() || !age) return;
    setSaving(true);
    setError('');
    try {
      await addMember({ name: name.trim(), age: parseInt(age), gender: gender || undefined, relationship: rel });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: DL_COLORS.bgRaised, border: `1px solid ${DL_COLORS.border}`,
    borderRadius: 10, padding: '12px 14px',
    color: DL_COLORS.fgPrimary, fontSize: 15, outline: 'none',
  };
  const labelStyle = { fontSize: 13, color: DL_COLORS.fgMuted, marginBottom: 6, display: 'block' };

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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: DL_COLORS.bgSurface, border: `1px solid ${DL_COLORS.border}`,
          borderRadius: 16, padding: '28px 24px', width: '100%', maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>{t('family.addMember') || 'Add family member'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: DL_COLORS.fgMuted, cursor: 'pointer', padding: 4 }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={inputStyle} autoFocus />
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" min="0" max="120" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Relationship</label>
            <select value={rel} onChange={e => setRel(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {relOptions.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Gender</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {genderOptions.map(g => (
              <button key={g.id} onClick={() => setGender(g.id)} style={{
                flex: 1, padding: '10px', borderRadius: 8,
                border: `1px solid ${gender === g.id ? DL_COLORS.accent : DL_COLORS.border}`,
                background: gender === g.id ? DL_COLORS.accentDim : DL_COLORS.bgRaised,
                color: DL_COLORS.fgPrimary, fontSize: 13, cursor: 'pointer',
              }}>{g.label}</button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: DL_COLORS.warning, fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button
          onClick={handleSave}
          disabled={!name.trim() || !age || saving}
          style={{
            width: '100%', background: DL_COLORS.accent, color: '#0a1a16',
            border: 'none', borderRadius: 10, padding: '13px',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            opacity: (!name.trim() || !age || saving) ? 0.5 : 1,
          }}
        >
          {saving ? 'Adding...' : (t('family.addMember') || 'Add member')}
        </button>
      </div>
    </div>
  );
}
