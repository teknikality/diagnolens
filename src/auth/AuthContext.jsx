import { createContext, useContext, useState } from 'react';
import { setApiPhone } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Pilot mode: auth lives in React state only.
  // Reload = fresh login screen. Each session is one user.
  const [phone, setPhone] = useState(null);

  const isAuthenticated = !!phone;
  const loading = false;

  const loginWithPhone = (p) => {
    setPhone(p);
    setApiPhone(p);
    // Clear stale data from previous user
    sessionStorage.clear();
    localStorage.removeItem('dl_active_member');
    localStorage.removeItem('dl_family_members');
  };

  const logout = () => {
    setPhone(null);
    setApiPhone(null);
    // Clear all session data so next user starts clean
    sessionStorage.clear();
    localStorage.removeItem('dl_active_member');
    localStorage.removeItem('dl_family_members');
  };

  const getToken = () => null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user: phone ? { phone } : null,
      phone,
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
