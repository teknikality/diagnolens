import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      // Supabase not configured — run in unauthenticated mode
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOTP = async (phone) => {
    if (!supabase) throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  };

  const verifyOTP = async (phone, token) => {
    if (!supabase) throw new Error('Supabase not configured.');
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const isAuthenticated = !!session;
  const user = session?.user ?? null;
  const getToken = () => session?.access_token ?? null;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      session,
      loading,
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
