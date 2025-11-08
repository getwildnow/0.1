"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingTokenPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    handleToken();
  }, []);

  const handleToken = async () => {
    try {
      // Verify token and authenticate user
      // In production, you'd verify the token with your backend
      // For now, we'll use Supabase magic link or create session
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user) {
        // Try to sign in with token (if it's a magic link)
        const { error: signInError } = await supabase.auth.verifyOtp({
          token_hash: params.token,
          type: 'magiclink',
        });

        if (signInError) {
          setError("Invalid or expired link");
          setLoading(false);
          return;
        }
      }

      // Check if user already has Veriff verification
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('verification_status')
        .eq('user_id', user?.id || '')
        .single();

      if (profile?.verification_status === 'verified') {
        // Already verified, go to chat
        router.push('/onboard/chat');
        return;
      }

      // Create Veriff verification session
      const response = await fetch('/api/identity/create-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create verification session');
      }

      const { url } = await response.json();

      // Redirect to Veriff
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Setting up verification...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return null;
}

