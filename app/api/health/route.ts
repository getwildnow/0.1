import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Check database connection
    const supabase = await createClient();
    const { error } = await supabase.from('onboarding_config').select('id').limit(1);
    
    if (error) {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          database: 'error',
          error: error.message 
        },
        { status: 503 }
      );
    }

    // Check required environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'VERIFF_API_KEY',
      'VERIFF_API_SECRET',
      'OPENAI_API_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'ok',
          environment: 'missing_variables',
          missing: missingEnvVars,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'ok',
      environment: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message || 'Unknown error',
      },
      { status: 503 }
    );
  }
}

