"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    createVerificationSession();
  }, []);

  const createVerificationSession = async () => {
    try {
      // Get or create an anonymous user
      let { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Create an anonymous user
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        user = authData.user;
      }

      if (!user) {
        throw new Error("Failed to create user session");
      }

      // Create Veriff session
      const response = await fetch("/api/identity/create-session", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create verification session");
      }

      const { url } = await response.json();
      if (url) {
        // Redirect to Veriff
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-red-600 mb-4">❌ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Starting Identity Verification</h2>
          <p className="text-gray-600">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  return null;
}

