"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { createClient } from "@/lib/supabase/client";

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/");
      return;
    }

    // Check verification status from database
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("verification_status, veriff_data")
      .eq("user_id", user.id)
      .single();

    // If returning from Veriff but webhook hasn't processed yet
    const justVerified = searchParams.get("verified") === "true";
    
    if (!profile || profile.verification_status !== "verified") {
      if (justVerified) {
        // User just completed Veriff, wait for webhook to process
        // Poll database for up to 10 seconds
        setIsVerifying(true);
        await pollForVerification(user.id);
        setIsVerifying(false);
      } else {
        // Not verified yet, redirect to verification
        router.push("/onboard/verify");
      }
    }
    // If verified, continue to chat (component will render)
  };

  // Poll database to wait for webhook to update profile
  const pollForVerification = async (userId: string, maxAttempts = 10) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("verification_status")
        .eq("user_id", userId)
        .single();
      
      if (profile?.verification_status === "verified") {
        // Verification complete! Continue to chat
        return;
      }
    }
    
    // After 10 seconds, redirect back to verify page
    console.error("Webhook processing timeout");
    router.push("/onboard/verify");
  };

  // Show loading state while verifying webhook
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying your identity...</h2>
          <p className="text-gray-600">This will only take a moment</p>
        </div>
      </div>
    );
  }

  return <ChatInterface />;
}

export default function OnboardingChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}

