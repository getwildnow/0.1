'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();
      
      // Check if there are hash fragments (magic link)
      if (window.location.hash) {
        // Extract hash fragments and set session
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session explicitly
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Error setting session:', error);
            router.push('/onboard/verify?error=auth_failed');
            return;
          }
          
          if (data.session) {
            // Clear hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            // Session established, redirect to verification
            router.push('/onboard/verify');
            return;
          }
        }
      }
      
      // Check if user is already authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        router.push('/onboard/verify');
      } else {
        // Check for error parameter
        const error = searchParams.get('error');
        if (error) {
          setLoading(false);
          // Show error or redirect
          router.push(`/onboard/verify?error=${error}`);
        } else {
          // Not authenticated and no magic link, redirect to verification (which will show error)
          router.push('/onboard/verify');
        }
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">getwild Prime Care</h1>
        <p className="text-gray-600">{loading ? 'Redirecting to onboarding...' : 'Please wait...'}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">getwild Prime Care</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

