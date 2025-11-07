"use client";

import { ReactNode } from "react";
import ProgressBar from "./ProgressBar";

interface StepContainerProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export default function StepContainer({ currentStep, totalSteps, children }: StepContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-12 animate-slide-up">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="animate-fade-in">{children}</div>
      </div>
    </div>
  );
}

