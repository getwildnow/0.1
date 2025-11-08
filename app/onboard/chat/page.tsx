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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // No user, redirect to start
      router.push("/");
      return;
    }

    // Check if just returned from Veriff
    const justVerified = searchParams.get("verified") === "true";
    
    if (justVerified) {
      // Wait for webhook to process
      setIsVerifying(true);
      await pollForVerification(user.id);
      setIsVerifying(false);
    }
    
    // Ready to chat
    setIsReady(true);
  };

  // Poll database to wait for webhook to update profile
  const pollForVerification = async (userId: string, maxAttempts = 15) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("verification_status")
        .eq("user_id", userId)
        .single();
      
      if (profile?.verification_status === "verified") {
        // Verification complete!
        return;
      }
    }
    
    // After timeout, continue anyway (Veriff data might still be usable)
    console.log("Verification polling complete");
  };

  // Show loading state while verifying webhook
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing your verification...</h2>
          <p className="text-gray-600">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading...</p>
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

