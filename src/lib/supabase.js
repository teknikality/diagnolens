import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Guard: createClient throws if URL is empty. Create a no-op client
// so the app still renders (login page will show errors on submit).
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
