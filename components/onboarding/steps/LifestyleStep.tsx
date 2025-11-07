"use client";

import { useState } from "react";
import Button from "../Button";

interface LifestyleStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function LifestyleStep({ onNext, onBack }: LifestyleStepProps) {
  const [formData, setFormData] = useState({
    exerciseFrequency: "",
    dietType: "",
    sleepQuality: "",
    stressLevel: "",
    workType: "",
    screenTime: "",
    caffeineUse: "",
  });

  const handleSubmit = () => {
    if (
      formData.exerciseFrequency &&
      formData.dietType &&
      formData.sleepQuality &&
      formData.stressLevel &&
      formData.workType &&
      formData.screenTime &&
      formData.caffeineUse
    ) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle & Habits</h2>
        <p className="text-gray-600">Tell us about your daily lifestyle.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exercise Frequency <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.exerciseFrequency}
          onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="never">Never</option>
          <option value="rarely">Rarely (1-2x/month)</option>
          <option value="occasionally">Occasionally (1-2x/week)</option>
          <option value="regularly">Regularly (3-4x/week)</option>
          <option value="daily">Daily</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diet Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.dietType}
          onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="standard">Standard</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sleep Quality <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.sleepQuality}
          onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="poor">Poor</option>
          <option value="fair">Fair</option>
          <option value="good">Good</option>
          <option value="excellent">Excellent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stress Level <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.stressLevel}
          onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="very-high">Very High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.workType}
          onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="desk">Desk Job</option>
          <option value="physical">Physical Labor</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Screen Time <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.screenTime}
          onChange={(e) => setFormData({ ...formData, screenTime: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="less-2h">Less than 2 hours</option>
          <option value="2-4h">2-4 hours</option>
          <option value="4-6h">4-6 hours</option>
          <option value="6-8h">6-8 hours</option>
          <option value="more-8h">More than 8 hours</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caffeine Use <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.caffeineUse}
          onChange={(e) => setFormData({ ...formData, caffeineUse: e.target.value })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select...</option>
          <option value="none">None</option>
          <option value="1-cup">1 cup/day</option>
          <option value="2-3-cups">2-3 cups/day</option>
          <option value="4-plus">4+ cups/day</option>
        </select>
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

