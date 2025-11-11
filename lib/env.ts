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
  // Supabase (optional for Vital testing)
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', false) || '',
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', false) || '',
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false) || '',
  },
  
  // Veriff (optional for Vital testing)
  veriff: {
    apiKey: getEnvVar('VERIFF_API_KEY', false) || '',
    apiSecret: getEnvVar('VERIFF_API_SECRET', false) || '',
    apiUrl: getEnvVar('VERIFF_API_URL', false) || 'https://stationapi.veriff.com',
  },
  
  // OpenAI (optional for Vital testing)
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY', false) || '',
  },
  
  // Vital API (Health Data)
  vital: {
    apiKey: getEnvVar('VITAL_API_KEY'),
    environment: getEnvVar('VITAL_ENVIRONMENT', false) || 'sandbox',
    region: getEnvVar('VITAL_REGION', false) || 'us',
  },
  
  // Fasten Health (optional for Vital testing)
  fasten: {
    publicId: getEnvVar('FASTEN_PUBLIC_ID', false) || '',
    apiKey: getEnvVar('FASTEN_API_KEY', false) || '',
    environment: getEnvVar('FASTEN_ENVIRONMENT', false) || 'sandbox',
    apiUrl: getEnvVar('FASTEN_API_URL', false) || 'https://api.fastenhealth.com',
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
    // Only Vital is required for testing
    'VITAL_API_KEY',
    // Uncomment below when you're ready to use these services:
    // 'NEXT_PUBLIC_SUPABASE_URL',
    // 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    // 'SUPABASE_SERVICE_ROLE_KEY',
    // 'VERIFF_API_KEY',
    // 'VERIFF_API_SECRET',
    // 'OPENAI_API_KEY',
    // 'FASTEN_PUBLIC_ID',
    // 'FASTEN_API_KEY',
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

