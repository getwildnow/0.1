import { NextResponse } from 'next/server';
import { fasten } from '@/lib/fasten';
import { createServiceRoleClient } from '@/lib/supabase/service';

// Webhook endpoint for Fasten events
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-fasten-signature');
    const webhookSecret = process.env.FASTEN_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const isValid = fasten.verifyWebhookSignature(body, signature, webhookSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const supabase = createServiceRoleClient();

    // Handle different webhook events
    switch (event.type) {
      case 'connection.created':
        // User connected a new source
        await supabase.from('fasten_connections').insert({
          fasten_user_id: event.data.user_id,
          source_id: event.data.source_id,
          source_name: event.data.source_name,
          status: 'connected',
          connected_at: new Date().toISOString(),
        });
        break;

      case 'connection.deleted':
        // User disconnected a source
        await supabase
          .from('fasten_connections')
          .update({ status: 'disconnected' })
          .eq('fasten_user_id', event.data.user_id)
          .eq('source_id', event.data.source_id);
        break;

      case 'data.sync_completed':
        // New clinical data is available
        await supabase
          .from('fasten_connections')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('fasten_user_id', event.data.user_id);
        
        // Optionally trigger a sync to cache new data
        // You could add logic here to fetch and cache the new data
        break;

      default:
        console.log('Unhandled Fasten webhook event:', event.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Fasten webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}



