"use client";

import { useState } from "react";
import Button from "../Button";

interface ConsentsStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function ConsentsStep({ onNext, onBack }: ConsentsStepProps) {
  const [consents, setConsents] = useState({
    healthData: false,
    wearableData: false,
    socialMedia: false,
    googleWorkspace: false,
    location: false,
    terms: false,
    privacy: false,
  });

  const handleToggle = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const requiredConsents = ["healthData", "wearableData", "terms", "privacy"];
  const canProceed = requiredConsents.every((key) => consents[key as keyof typeof consents]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Permissions & Consents</h2>
        <p className="text-gray-600">
          We need your consent to provide you with the best health coverage and insights.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.healthData}
            onChange={() => handleToggle("healthData")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <span className="font-medium">Health Data Collection</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-sm text-gray-600 mt-1">
              We collect and analyze your health data to provide personalized care and coverage.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.wearableData}
            onChange={() => handleToggle("wearableData")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <span className="font-medium">Wearable Data Syncing</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-sm text-gray-600 mt-1">
              Sync data from your wearable device for continuous health monitoring.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.socialMedia}
            onChange={() => handleToggle("socialMedia")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Social Media Analysis</span>
            <p className="text-sm text-gray-600 mt-1">
              Analyze public posts to understand lifestyle patterns. Get 10% better insights!
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.googleWorkspace}
            onChange={() => handleToggle("googleWorkspace")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Google Workspace Analysis</span>
            <p className="text-sm text-gray-600 mt-1">
              Auto-schedule appointments and track your health-related emails.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.location}
            onChange={() => handleToggle("location")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Location Services</span>
            <p className="text-sm text-gray-600 mt-1">
              Find nearby doctors and clinics faster when you need care.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.terms}
            onChange={() => handleToggle("terms")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <span className="font-medium">Terms of Service</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-sm text-gray-600 mt-1">
              I agree to the Terms of Service and understand my rights and responsibilities.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={consents.privacy}
            onChange={() => handleToggle("privacy")}
            className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <span className="font-medium">Privacy Policy & HIPAA</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-sm text-gray-600 mt-1">
              I understand how my data is protected and used in accordance with HIPAA regulations.
            </p>
          </div>
        </label>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={() => onNext(consents)} disabled={!canProceed} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

