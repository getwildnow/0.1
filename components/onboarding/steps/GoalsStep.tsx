"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { healthGoalsSchema } from "@/lib/validations/onboarding";
import Button from "../Button";

interface GoalsStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function GoalsStep({ onNext, onBack }: GoalsStepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    goals: "",
    dailyRoutine: "",
    concerns: "",
    dreamScenario: "",
    whatMakesBest: "",
  });

  const questions = [
    {
      key: "goals",
      question: "What are your biggest health goals?",
      placeholder: "e.g., Build strength, improve sleep, reduce stress, increase energy...",
    },
    {
      key: "dailyRoutine",
      question: "Walk us through your typical day",
      placeholder: "Describe your daily routine, work schedule, exercise habits...",
    },
    {
      key: "concerns",
      question: "Any health concerns keeping you up at night?",
      placeholder: "Share any worries or concerns (optional)",
      optional: true,
    },
    {
      key: "whatMakesBest",
      question: "What makes you feel your best?",
      placeholder: "Activities, habits, or situations that boost your wellbeing...",
      optional: true,
    },
    {
      key: "dreamScenario",
      question: "Dream health scenario - what does that look like for you?",
      placeholder: "Describe your ideal health and wellness state...",
      optional: true,
    },
  ];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].key]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onNext(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const currentQ = questions[currentQuestion];
  const canProceed = currentQ.optional || answers[currentQ.key as keyof typeof answers].length > 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{currentQ.question}</h2>
        <textarea
          value={answers[currentQ.key as keyof typeof answers]}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder={currentQ.placeholder}
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors"
          autoFocus
        />
        {currentQ.optional && (
          <p className="text-sm text-gray-500 mt-2">This question is optional</p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} className="flex-1">
          {currentQuestion === questions.length - 1 ? "Continue" : "Next"}
        </Button>
      </div>
    </div>
  );
}

