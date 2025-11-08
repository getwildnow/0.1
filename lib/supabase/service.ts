/**
 * Supabase client with service role key
 * Bypasses Row Level Security (RLS) - use only for webhooks and admin operations
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

let serviceClient: ReturnType<typeof createClient> | null = null;

export const createServiceRoleClient = () => {
  if (serviceClient) {
    return serviceClient;
  }

  serviceClient = createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serviceClient;
};

