#!/usr/bin/env node

/**
 * Create Magic Link for Testing
 * 
 * This script generates a magic link for employee onboarding testing.
 * 
 * Usage:
 *   node scripts/create-magic-link.js test@example.com
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('\nUsage: node scripts/create-magic-link.js test@example.com\n');
  process.exit(1);
}

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('\nRequired:');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

async function createMagicLink() {
  console.log('🔗 Creating magic link for:', email);
  console.log('');

  // Create Supabase client with service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Generate magic link using admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zero-1-nyha.onrender.com'}/onboard/verify`
      }
    });

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }

    console.log('✅ Magic link created successfully!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📧 Send this link to the employee:');
    console.log('');
    console.log(data.properties.action_link);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 When they click the link:');
    console.log('   1. They will be authenticated');
    console.log('   2. Redirected to Veriff for ID verification');
    console.log('   3. After Veriff → ChatGPT conversation');
    console.log('   4. After chat → Dashboard');
    console.log('');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

createMagicLink();

