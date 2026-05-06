import { createContext, useContext, useState, useEffect } from 'react';
import { setApiPhone } from '../lib/api.js';

const STORAGE_KEY = 'dl_auth';

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = readStorage() || { phone: null };
    // Restore API phone on reload
    if (saved.phone) setApiPhone(saved.phone);
    return saved;
  });

  const isAuthenticated = !!state.phone;
  const loading = false;

  const loginWithPhone = (phone) => {
    const next = { phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setApiPhone(phone);
    setState(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiPhone(null);
    setState({ phone: null });
  };

  const getToken = () => null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user: state.phone ? { phone: state.phone } : null,
      phone: state.phone,
      loading,
      loginWithPhone,
      logout,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
