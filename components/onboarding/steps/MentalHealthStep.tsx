"use client";

import { useState } from "react";
import Button from "../Button";

interface MentalHealthStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function MentalHealthStep({ onNext, onBack }: MentalHealthStepProps) {
  const [formData, setFormData] = useState({
    workLifeBalance: "",
    socialSupport: "",
    mentalHealthInterest: false,
  });

  const handleSubmit = () => {
    if (formData.workLifeBalance && formData.socialSupport) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental & Social Health</h2>
        <p className="text-gray-600">Your mental and social wellbeing matters too.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How would you rate your work-life balance? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.workLifeBalance}
          onChange={(e) => setFormData({ ...formData, workLifeBalance: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have a strong social support system? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.socialSupport}
          onChange={(e) => setFormData({ ...formData, socialSupport: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="very-strong">Very Strong</option>
          <option value="strong">Strong</option>
          <option value="moderate">Moderate</option>
          <option value="weak">Weak</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="mentalHealthInterest"
          checked={formData.mentalHealthInterest}
          onChange={(e) =>
            setFormData({ ...formData, mentalHealthInterest: e.target.checked })
          }
          className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="mentalHealthInterest" className="text-sm text-gray-700">
          I'm interested in mental health support and resources
        </label>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

