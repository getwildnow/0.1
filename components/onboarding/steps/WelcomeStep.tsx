"use client";

import Button from "../Button";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Welcome to getwild Prime Care
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        We're building your personalized health profile. The more we know, the better we can protect
        and optimize your health.
      </p>
      <p className="text-sm text-gray-500 mb-8">This takes approximately 5 minutes</p>
      <Button onClick={onNext} className="w-full md:w-auto">
        Let's Get Started
      </Button>
    </div>
  );
}

