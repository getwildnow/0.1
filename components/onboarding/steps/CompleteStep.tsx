"use client";

import { useState } from "react";
import Button from "../Button";
import { CheckCircle } from "lucide-react";

interface CompleteStepProps {
  onComplete: (password: string) => void;
}

export default function CompleteStep({ onComplete }: CompleteStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    onComplete(password);
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-4">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">You're All Set!</h2>
      <p className="text-lg text-gray-600">
        Your profile is complete. Set a password to secure your account.
      </p>

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mt-8 text-left">
        <h3 className="font-bold text-lg mb-4">What You've Unlocked:</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Full health coverage</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>AI health companion</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Free wearable (shipping in 3 days)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Quarterly blood tests ($400 value)</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4 mt-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Create Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Re-enter your password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <Button onClick={handleSubmit} disabled={!password || !confirmPassword} className="w-full">
        Go to Dashboard
      </Button>
    </div>
  );
}

