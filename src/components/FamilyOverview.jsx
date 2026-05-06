import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamily } from '../family/FamilyContext.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { DL_COLORS } from '../tokens.js';
import Icon from './Icon.jsx';
import MemberCard from './MemberCard.jsx';
import AddMemberModal from './AddMemberModal.jsx';

export default function FamilyOverview({ members }) {
  const { t } = useLang();
  const { switchMember } = useFamily();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  const handleCardClick = (member) => {
    switchMember(member);
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {t('family.title') || 'Your Family'}
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: DL_COLORS.accent, color: '#0a1a16',
            border: 'none', borderRadius: 8, padding: '8px 14px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={14} />
          {t('family.addMember') || 'Add member'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}>
        {members.map(m => (
          <MemberCard key={m.id} member={m} onClick={() => handleCardClick(m)} />
        ))}
      </div>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
