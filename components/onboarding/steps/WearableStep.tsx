"use client";

import { useState } from "react";
import Button from "../Button";

interface WearableStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function WearableStep({ onNext, onBack }: WearableStepProps) {
  const [selected, setSelected] = useState<string>("");

  const handleSubmit = () => {
    if (selected) {
      onNext({ deviceType: selected });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your FREE Health Tracker</h2>
        <p className="text-gray-600">
          We'll ship your chosen wearable to you for free. Track your health 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setSelected("oura")}
          className={`
            p-6 border-2 rounded-lg text-left transition-all
            ${
              selected === "oura"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <div className="text-3xl mb-2">💍</div>
          <h3 className="font-bold text-lg mb-1">Oura Ring</h3>
          <p className="text-sm text-gray-600">Sleep & recovery tracking</p>
        </button>

        <button
          onClick={() => setSelected("whoop")}
          className={`
            p-6 border-2 rounded-lg text-left transition-all
            ${
              selected === "whoop"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <div className="text-3xl mb-2">⌚</div>
          <h3 className="font-bold text-lg mb-1">Whoop Band</h3>
          <p className="text-sm text-gray-600">Performance optimization</p>
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setSelected("existing")}
          className={`
            w-full p-4 border-2 rounded-lg text-left transition-all
            ${
              selected === "existing"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <span className="font-medium">I already have a wearable - connect it now</span>
        </button>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!selected} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

