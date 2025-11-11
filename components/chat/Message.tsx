"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  type: "text" | "consent" | "question" | "integration" | "action" | "complete";
  content: string;
  metadata?: any;
  onConsentAgree?: () => void;
  onAnswer?: (answer: string) => void;
  onIntegrationClick?: (integration: string) => void;
  onActionSelect?: (action: string, choice: string) => void;
}

export default function Message({
  role,
  type,
  content,
  metadata,
  onConsentAgree,
  onAnswer,
  onIntegrationClick,
  onActionSelect,
}: MessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl px-4 py-3">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  }

  // Assistant messages
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <p className="text-sm text-gray-900 mb-2">{content}</p>

        {type === "consent" && (
          <ConsentGate consentText={content} onAgree={onConsentAgree || (() => {})} />
        )}

        {type === "integration" && metadata?.integration && (
          <button
            onClick={() => onIntegrationClick?.(metadata.integration)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect {getIntegrationName(metadata.integration)}
          </button>
        )}

        {type === "action" && metadata?.choices && (
          <div className="mt-2 space-y-2">
            {metadata.choices.map((choice: string) => (
              <button
                key={choice}
                onClick={() => onActionSelect?.(metadata.action, choice)}
                className="block w-full text-left px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {type === "complete" && (
          <div className="mt-2 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Onboarding Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentGate({ consentText, onAgree }: { consentText: string; onAgree: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 mt-2">
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) {
              setTimeout(() => onAgree(), 100);
            }
          }}
          className="mt-1 w-4 h-4 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-700">{consentText}</span>
      </label>
    </div>
  );
}

function getIntegrationName(integration: string): string {
  const names: Record<string, string> = {
    'apple health': 'Apple Health',
    'google workspace': 'Google Workspace',
    'instagram': 'Instagram',
    'linkedin': 'LinkedIn',
    'strava': 'Strava',
    'myfitnesspal': 'MyFitnessPal',
    'spotify': 'Spotify',
    'twitter': 'Twitter/X',
  };
  return names[integration.toLowerCase()] || integration;
}

