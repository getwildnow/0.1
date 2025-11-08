'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ChatInterface from '@/components/chat/ChatInterface';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setError('Please authenticate first');
          router.push('/onboard/verify');
          return;
        }

        const currentUserId = user.id;
        setUserId(currentUserId);

        // Poll for verification status
        const pollForVerification = async (): Promise<boolean> => {
          const maxAttempts = 30; // 30 attempts = 30 seconds max
          let attempts = 0;

          while (attempts < maxAttempts) {
            try {
              const response = await fetch(`/api/verify-status?userId=${currentUserId}`);
              
              if (!response.ok) {
                throw new Error('Failed to check verification status');
              }

              const data = await response.json();
              
              if (data.verified) {
                return true;
              }

              // Wait 1 second before next attempt
              await new Promise(resolve => setTimeout(resolve, 1000));
              attempts++;
            } catch (err) {
              console.error('Error polling verification:', err);
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          return false;
        };

        const isVerified = await pollForVerification();

        if (!isVerified) {
          setError('Verification not complete. Please complete identity verification first.');
          router.push('/onboard/verify');
          return;
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    initializeChat();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Waiting for verification to complete...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/onboard/verify')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Go to Verification
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return <ChatInterface userId={userId} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}

