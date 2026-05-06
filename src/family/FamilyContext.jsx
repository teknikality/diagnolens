import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  const fetchedRef = useRef(false);

  const restoreActive = useCallback((list) => {
    const savedId = localStorage.getItem(ACTIVE_KEY);
    const saved = list.find(m => m.id === savedId);
    if (saved) {
      setActiveMemberState(saved);
    } else if (list.length > 0) {
      setActiveMemberState(list[0]);
      localStorage.setItem(ACTIVE_KEY, list[0].id);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/family/members');
      const list = data.members || [];
      setMembers(list);
      writeCache(list);
      restoreActive(list);
    } catch (err) {
      console.warn('Backend fetch failed, using cache:', err.message);
      const cached = readCache();
      setMembers(cached);
      restoreActive(cached);
    } finally {
      setLoading(false);
    }
  }, [restoreActive]);

  // Fetch once when authenticated — no fetchMembers in deps to avoid loops
  useEffect(() => {
    if (isAuthenticated && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchMembers();
    }
    if (!isAuthenticated) {
      fetchedRef.current = false;
      setMembers([]);
      setActiveMemberState(null);
      setLoading(false);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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
