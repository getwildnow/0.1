"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    createVerificationSession();
  }, []);

  const createVerificationSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/identity/create-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create Veriff verification session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Setting up identity verification...</p>
        </div>
      </div>
    );
  }

  return null;
}

