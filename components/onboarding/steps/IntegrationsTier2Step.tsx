"use client";

import { useState } from "react";
import OAuthButton from "../OAuthButton";
import Button from "../Button";
import { initiateOAuth } from "@/lib/oauth/providers";

interface IntegrationsTier2StepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function IntegrationsTier2Step({ onNext, onBack }: IntegrationsTier2StepProps) {
  const [connected, setConnected] = useState({
    strava: false,
    myfitnesspal: false,
    spotify: false,
    twitter: false,
  });
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (provider: string) => {
    try {
      setConnecting(provider);
      
      const providerMap: Record<string, keyof typeof import("@/lib/oauth/providers").OAUTH_PROVIDERS> = {
        strava: "strava",
        spotify: "spotify",
        twitter: "twitter",
        myfitnesspal: "google", // MyFitnessPal might need different approach
      };

      const oauthProvider = providerMap[provider];
      if (oauthProvider && oauthProvider !== "myfitnesspal") {
        await initiateOAuth(oauthProvider);
      } else {
        // For providers without OAuth or different flow
        setConnected((prev) => ({ ...prev, [provider]: true }));
      }
    } catch (error) {
      console.error("Error connecting:", error);
      alert("Failed to connect. Please try again.");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Supercharge Your Insights</h2>
        <p className="text-gray-600 mb-6">
          Connect additional apps to get even better personalized health insights. (Optional)
        </p>
      </div>

      <div className="space-y-4">
        <OAuthButton
          provider="Strava"
          icon={<span className="text-2xl">🏃</span>}
          onConnect={() => handleConnect("strava")}
          connected={connected.strava}
        />
        <div className="text-sm text-gray-600 ml-12">Track your running and cycling activities</div>

        <OAuthButton
          provider="MyFitnessPal"
          icon={<span className="text-2xl">🍎</span>}
          onConnect={() => handleConnect("myfitnesspal")}
          connected={connected.myfitnesspal}
        />
        <div className="text-sm text-gray-600 ml-12">Sync nutrition and calorie tracking</div>

        <OAuthButton
          provider="Spotify"
          icon={<span className="text-2xl">🎵</span>}
          onConnect={() => handleConnect("spotify")}
          connected={connected.spotify}
        />
        <div className="text-sm text-gray-600 ml-12">Analyze music preferences for mood insights</div>

        <OAuthButton
          provider="Twitter/X"
          icon={<span className="text-2xl">🐦</span>}
          onConnect={() => handleConnect("twitter")}
          connected={connected.twitter}
        />
        <div className="text-sm text-gray-600 ml-12">Track social activity patterns</div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={() => onNext(connected)} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

