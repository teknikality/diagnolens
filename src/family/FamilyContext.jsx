import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api.js';
import { useAuth } from '../auth/AuthContext.jsx';

const ACTIVE_KEY = 'dl_active_member';
const MEMBERS_CACHE_KEY = 'dl_family_members';
const FamilyContext = createContext(null);

function readCache() {
  try { return JSON.parse(localStorage.getItem(MEMBERS_CACHE_KEY) || '[]'); } catch { return []; }
}
function writeCache(members) {
  localStorage.setItem(MEMBERS_CACHE_KEY, JSON.stringify(members));
}

export function FamilyProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [members, setMembers] = useState([]);
  const [activeMember, setActiveMemberState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      // Try backend API first
      const data = await apiGet('/api/family/members');
      const list = data.members || [];
      setMembers(list);
      writeCache(list);
      _restoreActive(list);
    } catch (err) {
      console.warn('Backend fetch failed, using cache:', err.message);
      // Fall back to localStorage cache
      const cached = readCache();
      setMembers(cached);
      _restoreActive(cached);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  function _restoreActive(list) {
    const savedId = localStorage.getItem(ACTIVE_KEY);
    const saved = list.find(m => m.id === savedId);
    if (saved) {
      setActiveMemberState(saved);
    } else if (list.length > 0) {
      setActiveMemberState(list[0]);
      localStorage.setItem(ACTIVE_KEY, list[0].id);
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchMembers();
    else { setMembers([]); setActiveMemberState(null); setLoading(false); }
  }, [isAuthenticated, fetchMembers]);

  const switchMember = (member) => {
    setActiveMemberState(member);
    localStorage.setItem(ACTIVE_KEY, member.id);
  };

  const addMember = async (data) => {
    try {
      const result = await apiPost('/api/family/members', data);
      await fetchMembers();
      return result;
    } catch (err) {
      console.error('Failed to add member:', err);
      throw err;
    }
  };

  const updateMember = async (id, data) => {
    try {
      const result = await apiPut(`/api/family/members/${id}`, data);
      await fetchMembers();
      return result;
    } catch (err) {
      console.error('Failed to update member:', err);
      throw err;
    }
  };

  const deleteMember = async (id) => {
    try {
      await apiDelete(`/api/family/members/${id}`);
      await fetchMembers();
    } catch (err) {
      console.error('Failed to delete member:', err);
      throw err;
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
