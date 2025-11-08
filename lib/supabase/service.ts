import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

/**
 * Service Role Supabase Client
 * 
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)
 * Only use this for:
 * - Webhooks from external services (Veriff, Stripe, etc.)
 * - Admin operations that need to access all data
 * - Background jobs that run without a user context
 * 
 * NEVER expose this client to the browser!
 * NEVER use this for regular user operations!
 */
export function createServiceRoleClient() {
  return createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

