/**
 * Client-side Supabase client
 * For use in React components and browser-side code
 */

import { createBrowserClient } from '@supabase/ssr';

// Direct access to env vars (env utility doesn't work client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

