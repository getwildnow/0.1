/**
 * Environment variable validation and access
 * Server-side only - validates all required vars on import
 */

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
  
  // Veriff
  veriff: {
    apiKey: getEnvVar('VERIFF_API_KEY'),
    apiSecret: getEnvVar('VERIFF_API_SECRET'),
    apiUrl: process.env.VERIFF_API_URL || 'https://stationapi.veriff.com',
  },
  
  // OpenAI
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
  },
  
  // Railway
  railway: {
    externalUrl: process.env.RAILWAY_EXTERNAL_URL || process.env.VERCEL_URL || '',
  },
  
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

