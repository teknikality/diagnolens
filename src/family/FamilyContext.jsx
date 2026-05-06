import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

const ACTIVE_KEY = 'dl_active_member';
const MEMBERS_KEY = 'dl_family_members';
const FamilyContext = createContext(null);

let _nextId = 1;
function localId() { return `local_${Date.now()}_${_nextId++}`; }

function readLocalMembers() {
  try { return JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]'); } catch { return []; }
}
function writeLocalMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function FamilyProvider({ children }) {
  const { isAuthenticated, phone } = useAuth();
  const [members, setMembers] = useState([]);
  const [activeMember, setActiveMemberState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try backend first, fall back to localStorage
  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated) return;

    // For pilot: use localStorage
    let list = readLocalMembers();

    // Auto-create self member if none exist
    if (list.length === 0) {
      const self = { id: localId(), name: 'Self', age_group: 'adult', age: null, gender: null, relationship: 'self', profile_data: null };
      list = [self];
      writeLocalMembers(list);
    }

    setMembers(list);

    const savedId = localStorage.getItem(ACTIVE_KEY);
    const saved = list.find(m => m.id === savedId);
    if (saved) {
      setActiveMemberState(saved);
    } else if (list.length > 0) {
      setActiveMemberState(list[0]);
      localStorage.setItem(ACTIVE_KEY, list[0].id);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchMembers();
    else { setMembers([]); setActiveMemberState(null); setLoading(false); }
  }, [isAuthenticated, fetchMembers]);

  const switchMember = (member) => {
    setActiveMemberState(member);
    localStorage.setItem(ACTIVE_KEY, member.id);
  };

  const addMember = async (data) => {
    const ageGroup = data.age <= 17 ? 'child' : data.age >= 65 ? 'senior' : 'adult';
    const member = { id: localId(), ...data, age_group: ageGroup, profile_data: null };
    const updated = [...members, member];
    setMembers(updated);
    writeLocalMembers(updated);
    return member;
  };

  const updateMember = async (id, data) => {
    const updated = members.map(m => {
      if (m.id !== id) return m;
      const merged = { ...m, ...data };
      if (data.age != null) merged.age_group = data.age <= 17 ? 'child' : data.age >= 65 ? 'senior' : 'adult';
      return merged;
    });
    setMembers(updated);
    writeLocalMembers(updated);
    // Update active member if it was changed
    if (activeMember?.id === id) {
      setActiveMemberState(updated.find(m => m.id === id));
    }
    return updated.find(m => m.id === id);
  };

  const deleteMember = async (id) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    writeLocalMembers(updated);
    if (activeMember?.id === id && updated.length > 0) {
      switchMember(updated[0]);
    }
  };

  return (
    <FamilyContext.Provider value={{
      members,
      activeMember,
      loading,
      fetchMembers,
      addMember,
      updateMember,
      deleteMember,
      switchMember,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  return useContext(FamilyContext);
}
