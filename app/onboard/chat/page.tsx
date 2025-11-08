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
    // Get session ID from localStorage (stored before redirecting to Veriff)
    const sessionId = localStorage.getItem('veriff_session_id');
    
    if (!sessionId) {
      // No session, redirect to start
      router.push("/");
      return;
    }

    // Wait for webhook to process verification
    setIsVerifying(true);
    await pollForVerification(sessionId);
    setIsVerifying(false);
    
    // Ready to chat
    setIsReady(true);
  };

  // Poll API to wait for webhook to update profile
  const pollForVerification = async (userId: string, maxAttempts = 15) => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      try {
        const response = await fetch(`/api/verify-status?sessionId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.verification_status === "verified") {
            // Verification complete!
            return;
          }
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
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

