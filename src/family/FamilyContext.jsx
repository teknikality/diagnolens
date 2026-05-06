import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

const ACTIVE_KEY = 'dl_active_member';
const FamilyContext = createContext(null);

export function FamilyProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [members, setMembers] = useState([]);
  const [activeMember, setActiveMemberState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await apiGet('/api/family/members');
      const list = data.members || [];
      setMembers(list);

      // Restore or default active member
      const savedId = localStorage.getItem(ACTIVE_KEY);
      const saved = list.find(m => m.id === savedId);
      if (saved) {
        setActiveMemberState(saved);
      } else if (list.length > 0) {
        setActiveMemberState(list[0]);
        localStorage.setItem(ACTIVE_KEY, list[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch family members:', err);
    } finally {
      setLoading(false);
    }
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
    const result = await apiPost('/api/family/members', data);
    await fetchMembers();
    return result;
  };

  const updateMember = async (id, data) => {
    const result = await apiPut(`/api/family/members/${id}`, data);
    await fetchMembers();
    return result;
  };

  const deleteMember = async (id) => {
    await apiDelete(`/api/family/members/${id}`);
    await fetchMembers();
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
