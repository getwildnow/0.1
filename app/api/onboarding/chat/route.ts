/**
 * AI Chat endpoint for onboarding conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { generateAIResponse, extractAnswer, type ConversationContext } from '@/lib/ai/conversation';

// GET: Load chat history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Verify user is authenticated and matches userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Load chat messages
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) {
      logger.dbError('chat_messages', 'select', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    logger.error('Error loading chat history', error instanceof Error ? error : null);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Send message and get AI response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message } = body;

    if (!userId || !message) {
      return NextResponse.json({ error: 'Missing userId or message' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Verify user is authenticated and matches userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Load Veriff data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      logger.dbError('user_profiles', 'select', profileError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!profile || profile.verification_status !== 'verified') {
      return NextResponse.json({ error: 'Verification not complete' }, { status: 400 });
    }

    // Load admin config
    const { data: config, error: configError } = await supabase
      .from('onboarding_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (configError && configError.code !== 'PGRST116') {
      logger.dbError('onboarding_config', 'select', configError);
      return NextResponse.json({ error: 'No config found' }, { status: 400 });
    }

    const dataPoints = config?.data_points || [];

    // Load conversation state
    const { data: conversation } = await supabase
      .from('onboarding_conversations')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Load collected data from database
    const collectedData: Record<string, any> = {};
    const { data: onboardingData } = await supabase
      .from('user_onboarding_data')
      .select('*')
      .eq('user_id', userId);

    onboardingData?.forEach(item => {
      collectedData[item.data_point] = item.value;
    });

    // Load chat history
    const { data: existingMessages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    const chatMessages = (existingMessages || []).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Add user message
    chatMessages.push({ role: 'user', content: message });

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'user',
      type: 'text',
      content: message,
    });

    // Prepare conversation context
    const context: ConversationContext = {
      veriffData: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        dob: profile.dob,
        gender: profile.gender,
        email: profile.email,
        phone: profile.phone,
        address_line1: profile.address_line1,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        country: profile.country,
        id_number: profile.id_number,
        document_type: profile.document_type,
      },
      dataPoints,
      collectedData,
      messages: chatMessages,
    };

    // Generate AI response
    const aiResponse = await generateAIResponse(context);

    // Save AI response
    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'assistant',
      type: 'text',
      content: aiResponse,
    });

    // Extract answers from user message (simple extraction)
    // In a real implementation, you might want more sophisticated extraction
    const remainingDataPoints = dataPoints.filter((dp: string) => !collectedData[dp]);
    let newlyCollectedDataPoint: string | null = null;
    
    if (remainingDataPoints.length > 0) {
      // Try to extract answer for the first remaining data point
      const currentDataPoint = remainingDataPoints[0];
      const answer = extractAnswer(message, currentDataPoint);
      
      // Save extracted answer
      await supabase.from('user_onboarding_data').upsert({
        user_id: userId,
        data_point: currentDataPoint,
        value: answer,
      });
      
      newlyCollectedDataPoint = currentDataPoint;
      collectedData[currentDataPoint] = answer;
    }

    // Update conversation status - check if all data points are collected
    const allCollected = dataPoints.length > 0 && dataPoints.every((dp: string) => collectedData[dp]);
    if (allCollected) {
      await supabase.from('onboarding_conversations').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        data_points_collected: dataPoints,
      }).eq('user_id', userId);
    } else if (newlyCollectedDataPoint) {
      // Update data_points_collected array
      const updatedCollected = conversation?.data_points_collected || [];
      if (!updatedCollected.includes(newlyCollectedDataPoint)) {
        updatedCollected.push(newlyCollectedDataPoint);
        await supabase.from('onboarding_conversations').update({
          data_points_collected: updatedCollected,
        }).eq('user_id', userId);
      }
    }

    return NextResponse.json({
      message: aiResponse,
      type: 'text',
    });
  } catch (error) {
    logger.error('Error processing chat message', error instanceof Error ? error : null);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

