/**
 * AI conversation logic for onboarding
 */

import { openai } from '@/lib/openai';

export interface VeriffData {
  first_name?: string | null;
  last_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  id_number?: string | null;
  document_type?: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ConversationContext {
  veriffData: VeriffData;
  dataPoints: string[];
  collectedData: Record<string, any>;
  messages: ChatMessage[];
}

/**
 * Generate system prompt that includes Veriff data
 * CRITICAL: AI should never ask for data already extracted from Veriff
 */
export function generateSystemPrompt(
  veriffData: VeriffData,
  dataPoints: string[]
): string {
  const veriffInfo: string[] = [];
  
  if (veriffData.first_name) veriffInfo.push(`First Name: ${veriffData.first_name}`);
  if (veriffData.last_name) veriffInfo.push(`Last Name: ${veriffData.last_name}`);
  if (veriffData.dob) veriffInfo.push(`Date of Birth: ${veriffData.dob}`);
  if (veriffData.gender) veriffInfo.push(`Gender: ${veriffData.gender}`);
  if (veriffData.email) veriffInfo.push(`Email: ${veriffData.email}`);
  if (veriffData.phone) veriffInfo.push(`Phone: ${veriffData.phone}`);
  if (veriffData.address_line1) {
    const address = [
      veriffData.address_line1,
      veriffData.city,
      veriffData.state,
      veriffData.postal_code,
      veriffData.country,
    ].filter(Boolean).join(', ');
    veriffInfo.push(`Address: ${address}`);
  }
  if (veriffData.id_number) veriffInfo.push(`ID Number: ${veriffData.id_number}`);
  if (veriffData.document_type) veriffInfo.push(`Document Type: ${veriffData.document_type}`);

  const veriffInfoStr = veriffInfo.length > 0
    ? `\n\nVERIFF VERIFICATION DATA (DO NOT ASK FOR THESE - THEY ARE ALREADY COLLECTED):\n${veriffInfo.join('\n')}`
    : '';

  const dataPointsStr = dataPoints.length > 0
    ? `\n\nDATA POINTS TO COLLECT:\n${dataPoints.map((dp, i) => `${i + 1}. ${dp}`).join('\n')}`
    : '';

  return `You are a helpful onboarding assistant for getwild Prime Care. Your role is to guide new employees through the onboarding process.

${veriffInfoStr}

${dataPointsStr}

IMPORTANT RULES:
1. NEVER ask for information that was already collected from Veriff (name, DOB, address, email, phone, ID number, document type)
2. Start by requesting consent for data collection
3. Collect the remaining data points from the list above in a conversational, friendly manner
4. Ask one question at a time
5. Be concise and professional
6. Once all data points are collected, confirm completion and thank the user

Respond naturally and conversationally.`;
}

/**
 * Generate AI response using GPT-4
 */
export async function generateAIResponse(
  context: ConversationContext
): Promise<string> {
  const systemPrompt = generateSystemPrompt(context.veriffData, context.dataPoints);
  
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...context.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
}

/**
 * Extract answer from user message
 * Simple extraction - can be enhanced with more sophisticated parsing
 */
export function extractAnswer(message: string, dataPoint: string): any {
  // Simple extraction - return the message as the answer
  // Can be enhanced with more sophisticated parsing if needed
  return message.trim();
}

