'use client'

import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleStartVerification = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('https://rqmjnenmeixvpwyzwyjw.supabase.co/functions/v1/veriff_create_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorData: 'user_12345',
          redirect: `${window.location.origin}/verification-complete`,
        }),
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        console.error('Supabase Edge Function Error:', responseData)
        throw new Error(responseData.error || `Failed to create verification session (${response.status})`)
      }
      
      if (responseData.verification_url) {
        console.log('Redirecting to Veriff:', responseData.verification_url)
        // Redirect to Veriff verification flow
        window.location.href = responseData.verification_url
      } else {
        console.error('No verification URL in response:', responseData)
        throw new Error('No verification URL received from Supabase')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Verification error:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Start Your Verification
        </h1>
        
        <button
          onClick={handleStartVerification}
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Starting...' : 'Start Now'}
        </button>
      </div>
    </main>
  )
}

