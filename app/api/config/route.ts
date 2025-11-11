import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { parseMarkdownList } from '@/lib/config/parser';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('onboarding_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ config: data || null });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { markdown } = await request.json();

    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json({ error: 'Markdown is required' }, { status: 400 });
    }

    const config = parseMarkdownList(markdown);

    const { data, error } = await supabase
      .from('onboarding_config')
      .upsert({
        id: 'default',
        data_points: config.dataPoints,
        integrations: config.integrations,
        actions: config.actions,
        consent_text: config.consent.text,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ config: data, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

