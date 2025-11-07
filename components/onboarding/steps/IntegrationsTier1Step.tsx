"use client";

import { useState } from "react";
import OAuthButton from "../OAuthButton";
import Button from "../Button";

interface IntegrationsTier1StepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function IntegrationsTier1Step({ onNext, onBack }: IntegrationsTier1StepProps) {
  const [connected, setConnected] = useState({
    appleHealth: false,
    googleWorkspace: false,
    instagram: false,
    linkedin: false,
  });

  const handleConnect = (provider: string) => {
    // In production, this would initiate OAuth flow
    // For now, just mark as connected
    setConnected((prev) => ({ ...prev, [provider]: true }));
  };

  const canProceed =
    connected.appleHealth && connected.googleWorkspace && connected.instagram && connected.linkedin;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Health Data</h2>
        <p className="text-gray-600 mb-6">
          We'll automatically sync your data for real-time insights. All connections are secure and
          encrypted.
        </p>
      </div>

      <div className="space-y-4">
        <OAuthButton
          provider="Apple Health / Google Fit"
          icon={<span className="text-2xl">🏃</span>}
          onConnect={() => handleConnect("appleHealth")}
          connected={connected.appleHealth}
          required
        />
        <div className="text-sm text-gray-600 ml-12">
          Syncs your activity, heart rate, sleep, and fitness data
        </div>

        <OAuthButton
          provider="Google Workspace"
          icon={<span className="text-2xl">📧</span>}
          onConnect={() => handleConnect("googleWorkspace")}
          connected={connected.googleWorkspace}
          required
        />
        <div className="text-sm text-gray-600 ml-12">
          Analyzes emails for health appointments and tracks your schedule
        </div>

        <OAuthButton
          provider="Instagram"
          icon={<span className="text-2xl">📸</span>}
          onConnect={() => handleConnect("instagram")}
          connected={connected.instagram}
          required
        />
        <div className="text-sm text-gray-600 ml-12">
          Analyzes public posts to understand lifestyle patterns
        </div>

        <OAuthButton
          provider="LinkedIn"
          icon={<span className="text-2xl">💼</span>}
          onConnect={() => handleConnect("linkedin")}
          connected={connected.linkedin}
          required
        />
        <div className="text-sm text-gray-600 ml-12">
          Tracks career trajectory and professional network for health insights
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={() => onNext(connected)} disabled={!canProceed} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

