export interface OnboardingConfig {
  dataPoints: string[];
  integrations: string[];
  actions: string[];
  consent: {
    text: string;
    links?: {
      terms?: string;
      privacy?: string;
    };
  };
}

const INTEGRATION_KEYWORDS = [
  'apple health',
  'google workspace',
  'google fit',
  'instagram',
  'linkedin',
  'strava',
  'myfitnesspal',
  'spotify',
  'twitter',
];

export function parseMarkdownList(markdown: string): OnboardingConfig {
  const lines = markdown.split('\n');
  const dataPoints: string[] = [];
  const integrations: string[] = [];
  const actions: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const item = trimmed.replace(/^[-*]\s*/, '').trim().toLowerCase();
      
      if (!item) return;

      // Check if it's an integration
      if (INTEGRATION_KEYWORDS.some((kw) => item.includes(kw))) {
        integrations.push(item);
      }
      // Check if it's an action
      else if (item.includes('wearable')) {
        actions.push(item);
      }
      // Everything else is a data point/question
      else {
        dataPoints.push(item);
      }
    }
  });

  return {
    dataPoints,
    integrations,
    actions,
    consent: {
      text: 'I agree to the getwild Terms of Service and Privacy Policy and understand how my health data will be used.',
      links: {
        terms: '/terms',
        privacy: '/privacy',
      },
    },
  };
}

export function detectItemType(item: string): 'question' | 'integration' | 'action' {
  const lower = item.toLowerCase();
  
  if (INTEGRATION_KEYWORDS.some((kw) => lower.includes(kw))) {
    return 'integration';
  }
  
  if (lower.includes('wearable')) {
    return 'action';
  }
  
  return 'question';
}

