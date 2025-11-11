"use client";

import { useState } from "react";

interface ConsentGateProps {
  consentText: string;
  onAgree: () => void;
}

export default function ConsentGate({ consentText, onAgree }: ConsentGateProps) {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (agreed) {
      onAgree();
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-1">
          <span className="text-sm text-gray-700">{consentText}</span>
          <div className="mt-1 text-xs text-gray-500">
            <a href="/terms" className="underline hover:text-blue-600">Terms of Service</a>
            {" · "}
            <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a>
          </div>
        </div>
      </label>
    </div>
  );
}

