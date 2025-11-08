"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { createClient } from "@/lib/supabase/client";

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/");
      return;
    }

    // Check if Veriff verification is complete
    const verified = searchParams.get("verified");
    if (verified === "true") {
      // Wait a moment for webhook to process
      setTimeout(() => {
        // Continue to chat
      }, 1000);
    } else {
      // Check if user has verified
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("verification_status")
        .eq("user_id", user.id)
        .single();

      if (profile?.verification_status !== "verified") {
        // Redirect to Veriff verification
        router.push("/onboard/verify");
      }
    }
  };

  return <ChatInterface />;
}

export default function OnboardingChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}

