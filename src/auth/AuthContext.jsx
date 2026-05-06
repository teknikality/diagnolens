import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'dl_auth';

function readStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStorage() || { phone: null });

  const isAuthenticated = !!state.phone;
  const loading = false;

  const loginWithPhone = (phone) => {
    const next = { phone };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ phone: null });
  };

  // Stubs for OTP — not used in pilot, keeps LoginPage compatible
  const sendOTP = async () => {};
  const verifyOTP = async () => {};
  const getToken = () => null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user: state.phone ? { phone: state.phone } : null,
      phone: state.phone,
      session: null,
      loading,
      loginWithPhone,
      sendOTP,
      verifyOTP,
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
