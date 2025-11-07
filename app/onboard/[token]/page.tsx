"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepContainer from "@/components/onboarding/StepContainer";
import WelcomeStep from "@/components/onboarding/steps/WelcomeStep";
import GoalsStep from "@/components/onboarding/steps/GoalsStep";
import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep";
import IdentityStep from "@/components/onboarding/steps/IdentityStep";
import HealthHistoryStep from "@/components/onboarding/steps/HealthHistoryStep";
import LifestyleStep from "@/components/onboarding/steps/LifestyleStep";
import IntegrationsTier1Step from "@/components/onboarding/steps/IntegrationsTier1Step";
import IntegrationsTier2Step from "@/components/onboarding/steps/IntegrationsTier2Step";
import WearableStep from "@/components/onboarding/steps/WearableStep";
import MentalHealthStep from "@/components/onboarding/steps/MentalHealthStep";
import ConsentsStep from "@/components/onboarding/steps/ConsentsStep";
import CompleteStep from "@/components/onboarding/steps/CompleteStep";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 12;

export default function OnboardingPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    // Verify token and load progress
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // In production, verify token with backend
      // For now, just check if user exists
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Load saved progress
        const { data } = await supabase
          .from("onboarding_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setCurrentStep(data.current_step || 1);
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (step: number, data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Merge new data with existing
      const updatedData = { ...onboardingData, ...data };
      setOnboardingData(updatedData);

      // Save to database
      await supabase.from("onboarding_progress").upsert({
        user_id: user.id,
        current_step: step,
        completed_steps: Array.from({ length: step }, (_, i) => i + 1),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleNext = async (stepData?: any) => {
    if (stepData) {
      await saveProgress(currentStep, stepData);
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark onboarding as complete
      await supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", user.id);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <StepContainer currentStep={currentStep} totalSteps={TOTAL_STEPS}>
      {currentStep === 1 && <WelcomeStep onNext={() => handleNext()} />}
      {currentStep === 2 && <GoalsStep onNext={(data) => handleNext(data)} onBack={handleBack} />}
      {currentStep === 3 && (
        <BasicInfoStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 4 && (
        <IdentityStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 5 && (
        <HealthHistoryStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 6 && (
        <LifestyleStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 7 && (
        <IntegrationsTier1Step onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 8 && (
        <IntegrationsTier2Step onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 9 && (
        <WearableStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 10 && (
        <MentalHealthStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 11 && (
        <ConsentsStep onNext={(data) => handleNext(data)} onBack={handleBack} />
      )}
      {currentStep === 12 && <CompleteStep onComplete={(password) => handleNext({ password })} />}
    </StepContainer>
  );
}

