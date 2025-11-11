import { openai } from '@/lib/openai';

export interface ConversationState {
  veriffData: any;
  config: {
    dataPoints: string[];
    integrations: string[];
    actions: string[];
  };
  collected: Record<string, any>;
  integrationsConnected: string[];
  consentAgreed: boolean;
}

export async function generateNextMessage(state: ConversationState): Promise<{
  type: 'consent' | 'question' | 'integration' | 'action' | 'complete';
  content: string;
  metadata?: any;
}> {
  const { veriffData, config, collected, integrationsConnected, consentAgreed } = state;

  // Step 1: Consent
  if (!consentAgreed) {
    const name = veriffData?.first_name || 'there';
    const location = veriffData?.city 
      ? `I see you're from ${veriffData.city}${veriffData.state ? `, ${veriffData.state}` : ''}.`
      : '';
    return {
      type: 'consent',
      content: `Hi ${name}! ${location} I'm your health companion. Before we start, please agree to our terms.`,
    };
  }

  // Step 2: Questions (data points)
  // Filter out integrations and actions from data points
  const questionDataPoints = config.dataPoints.filter(
    (dp) => !config.integrations.includes(dp) && !config.actions.includes(dp)
  );
  const remainingQuestions = questionDataPoints.filter((dp) => !collected[dp]);

  if (remainingQuestions.length > 0) {
    const nextQuestion = remainingQuestions[0];
    const question = await generateQuestion(nextQuestion, veriffData);
    
    return {
      type: 'question',
      content: question,
      metadata: { dataPoint: nextQuestion },
    };
  }

  // Step 3: Integrations
  const remainingIntegrations = config.integrations.filter(
    (int) => !integrationsConnected.includes(int)
  );

  if (remainingIntegrations.length > 0) {
    const nextIntegration = remainingIntegrations[0];
    const integrationName = getIntegrationDisplayName(nextIntegration);
    
    return {
      type: 'integration',
      content: `Let's connect your ${integrationName} to sync your data.`,
      metadata: { integration: nextIntegration },
    };
  }

  // Step 4: Actions
  const remainingActions = config.actions.filter(
    (act) => !collected[act]
  );

  if (remainingActions.length > 0) {
    const nextAction = remainingActions[0];
    
    if (nextAction.includes('wearable')) {
      return {
        type: 'action',
        content: 'Which wearable would you like? We\'ll ship it to you for free!',
        metadata: {
          action: 'wearable_selection',
          choices: ['Oura Ring', 'Whoop Band', 'I already have one'],
        },
      };
    }
  }

  // Step 5: Complete
  return {
    type: 'complete',
    content: `Perfect! You're all set, ${veriffData?.first_name || 'there'}. Welcome to getwild!`,
  };
}

async function generateQuestion(dataPoint: string, veriffData: any): Promise<string> {
  const prompt = `Generate a natural, conversational question to ask about: "${dataPoint}"

User's info (you can reference this naturally):
- Name: ${veriffData?.first_name || 'User'}
- Age: ${veriffData?.dob ? calculateAge(veriffData.dob) : 'unknown'}
- Location: ${veriffData?.city || 'unknown'}, ${veriffData?.state || ''}

Generate a friendly, conversational question. Just the question, nothing else.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content || `Tell me about your ${dataPoint}.`;
  } catch (error) {
    return `Tell me about your ${dataPoint}.`;
  }
}

export async function extractAnswer(
  dataPoint: string,
  userResponse: string
): Promise<any> {
  const prompt = `Extract structured data for "${dataPoint}" from this user response: "${userResponse}"

Return a JSON object with the extracted value. Examples:
- "health goals" → {"value": "lose weight, sleep better"}
- "medications" → {"value": ["aspirin", "metformin"]}
- "exercise frequency" → {"value": "3-4 times per week"}

Return ONLY valid JSON, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    return parsed.value;
  } catch (error) {
    return userResponse; // Fallback to raw response
  }
}

function getIntegrationDisplayName(integration: string): string {
  const names: Record<string, string> = {
    'apple health': 'Apple Health',
    'google workspace': 'Google Workspace',
    'google fit': 'Google Fit',
    'instagram': 'Instagram',
    'linkedin': 'LinkedIn',
    'strava': 'Strava',
    'myfitnesspal': 'MyFitnessPal',
    'spotify': 'Spotify',
    'twitter': 'Twitter/X',
  };
  return names[integration.toLowerCase()] || integration;
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
