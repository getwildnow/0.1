// Environment variable validation
// This ensures all required env vars are present at runtime

function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  
  if (!value && required) {
    // Only throw in development or server-side
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
      console.error(`Missing required environment variable: ${key}`);
    }
    return '';
  }
  
  return value || '';
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
    apiUrl: getEnvVar('VERIFF_API_URL', false) || 'https://stationapi.veriff.com',
  },
  
  // OpenAI
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
  },
  
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate all required env vars on module load
export function validateEnv() {
  const errors: string[] = [];
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VERIFF_API_KEY',
    'VERIFF_API_SECRET',
    'OPENAI_API_KEY',
  ];
  
  for (const key of required) {
    if (!process.env[key]) {
      errors.push(key);
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Missing required environment variables:');
    errors.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Copy ENV_EXAMPLE.txt to .env.local and fill in your values.\n');
    
    if (env.isProduction) {
      throw new Error('Missing required environment variables in production');
    }
  } else {
    console.log('✅ All required environment variables are present');
  }
  
  return errors.length === 0;
}

