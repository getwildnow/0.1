"use client";

import { useState } from "react";
import Button from "../Button";

interface FinancialStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function FinancialStep({ onNext, onBack }: FinancialStepProps) {
  const [formData, setFormData] = useState({
    incomeRange: "",
    occupation: "",
  });

  const handleSubmit = () => {
    onNext(formData);
  };

  const handleSkip = () => {
    onNext({ incomeRange: null, occupation: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Context (Optional)</h2>
        <p className="text-gray-600">
          Help us personalize your premium. This information is optional but helps us provide better
          pricing.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income Range</label>
        <select
          value={formData.incomeRange}
          onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Prefer not to say</option>
          <option value="under-50k">Under $50,000</option>
          <option value="50k-75k">$50,000 - $75,000</option>
          <option value="75k-100k">$75,000 - $100,000</option>
          <option value="100k-150k">$100,000 - $150,000</option>
          <option value="150k-200k">$150,000 - $200,000</option>
          <option value="200k-plus">$200,000+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
        <input
          type="text"
          value={formData.occupation}
          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          placeholder="e.g., Software Engineer, Product Manager, Founder..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="secondary" onClick={handleSkip} className="flex-1">
          Skip
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

