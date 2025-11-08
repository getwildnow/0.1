'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to verification page
    router.push('/onboard/verify');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">getwild Prime Care</h1>
        <p className="text-gray-600">Redirecting to onboarding...</p>
      </div>
    </div>
  );
}

