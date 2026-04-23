import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'dl_auth';

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStorage() || { token: null, user: null });

  const isAuthenticated = !!state.token;

  const login = (token, user = null) => {
    const next = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ token: null, user: null });
  };

  const getToken = () => state.token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: state.user, token: state.token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
