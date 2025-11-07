"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
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

    // Check if onboarding is complete
    const { data } = await supabase
      .from("users")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (!data?.onboarding_completed) {
      router.push("/onboard/new");
    }
  };

  return <ChatInterface />;
}

