import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateNextMessage, extractAnswer } from '@/lib/ai/conversation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, action, choice, sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Load user profile (Veriff data)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', sessionId)
      .single();

    // Load config
    const { data: config } = await supabase
      .from('onboarding_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (!config) {
      return NextResponse.json({ error: 'No config found' }, { status: 400 });
    }

    // Load conversation state
    let { data: conversation } = await supabase
      .from('onboarding_conversations')
      .select('*')
      .eq('user_id', sessionId)
      .single();

    // Initialize conversation if doesn't exist
    if (!conversation) {
      const { data: newConv } = await supabase
        .from('onboarding_conversations')
        .insert({
          user_id: sessionId,
          veriff_data: profile || {},
          veriff_verified: profile?.verification_status === 'verified',
          status: 'pending',
        })
        .select()
        .single();
      conversation = newConv;
    }

    // Load collected data
    const { data: collectedData } = await supabase
      .from('user_onboarding_data')
      .select('*')
      .eq('user_id', sessionId);

    // Load connected integrations
    const { data: integrations } = await supabase
      .from('user_integrations')
      .select('integration_name')
      .eq('user_id', sessionId);

    const collected: Record<string, any> = {};
    collectedData?.forEach((item) => {
      collected[item.data_point] = item.value;
    });

    const integrationsConnected = integrations?.map((i) => i.integration_name) || [];

    // Handle actions
    if (action === 'consent_agreed') {
      await supabase.from('onboarding_conversations').upsert({
        user_id: sessionId,
        consent_agreed: true,
        veriff_data: profile,
        veriff_verified: profile?.verification_status === 'verified',
        status: 'collecting',
      }, {
        onConflict: 'user_id'
      });

      await supabase.from('consents').insert({
        user_id: sessionId,
        consent_type: 'onboarding_complete',
      });
    } else if (action === 'answer' && message) {
      // Find the next unanswered data point (excluding integrations and actions)
      const answeredPoints = collectedData?.map((d) => d.data_point) || [];
      const questionDataPoints = config.data_points.filter(
        (dp: string) => !config.integrations.includes(dp) && !config.actions.includes(dp)
      );
      const dataPoint = questionDataPoints.find((dp: string) => !answeredPoints.includes(dp));

      if (dataPoint) {
        const extracted = await extractAnswer(dataPoint, message);

        // Save answer
        await supabase.from('user_onboarding_data').insert({
          user_id: sessionId,
          data_point: dataPoint,
          value: extracted,
        });

        // Update conversation
        const currentCollected = conversation?.data_points_collected || [];
        await supabase
          .from('onboarding_conversations')
          .upsert({
            user_id: sessionId,
            data_points_collected: [...currentCollected, dataPoint],
            veriff_data: profile,
            veriff_verified: profile?.verification_status === 'verified',
            status: 'collecting',
          }, {
            onConflict: 'user_id'
          });
      }
    } else if (action === 'integration_connected') {
      const integration = message;
      await supabase.from('user_integrations').upsert({
        user_id: sessionId,
        integration_name: integration,
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,integration_name'
      });

      // Update conversation
      const currentIntegrations = conversation?.integrations_connected || [];
      await supabase
        .from('onboarding_conversations')
        .upsert({
          user_id: sessionId,
          integrations_connected: [...currentIntegrations, integration],
        }, {
          onConflict: 'user_id'
        });
    } else if (action === 'action_completed') {
      const actionName = message;
      await supabase.from('user_onboarding_data').insert({
        user_id: sessionId,
        data_point: actionName,
        value: { completed: true, choice: choice || null },
      });
    } else if (action === 'get_next') {
      // Just get next message without processing action
    }

    // Reload conversation state after updates
    const { data: updatedConversation } = await supabase
      .from('onboarding_conversations')
      .select('*')
      .eq('user_id', sessionId)
      .single();

    const { data: updatedCollected } = await supabase
      .from('user_onboarding_data')
      .select('*')
      .eq('user_id', sessionId);

    const { data: updatedIntegrations } = await supabase
      .from('user_integrations')
      .select('integration_name')
      .eq('user_id', sessionId);

    const updatedCollectedMap: Record<string, any> = {};
    updatedCollected?.forEach((item) => {
      updatedCollectedMap[item.data_point] = item.value;
    });

    const updatedIntegrationsList = updatedIntegrations?.map((i) => i.integration_name) || [];

    // Generate next message
    const state = {
      veriffData: profile || {},
      config: {
        dataPoints: config.data_points || [],
        integrations: config.integrations || [],
        actions: config.actions || [],
      },
      collected: updatedCollectedMap,
      integrationsConnected: updatedIntegrationsList,
      consentAgreed: updatedConversation?.consent_agreed || action === 'consent_agreed',
    };

    const nextMessage = await generateNextMessage(state);

    // Save AI message to chat
    await supabase.from('chat_messages').insert({
      user_id: sessionId,
      role: 'assistant',
      type: nextMessage.type,
      content: nextMessage.content,
      metadata: nextMessage.metadata || {},
    });

    // If complete, update conversation status
    if (nextMessage.type === 'complete') {
      await supabase
        .from('onboarding_conversations')
        .update({
          status: 'complete',
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', sessionId);
    }

    return NextResponse.json({ message: nextMessage });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Load chat history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', sessionId)
      .order('timestamp', { ascending: true });

    return NextResponse.json({ messages: messages || [] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
