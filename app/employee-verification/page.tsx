'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

function VerificationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [founderName, setFounderName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'submitted' | 'approved' | 'declined'>('idle')

  useEffect(() => {
    // Check for auth errors in URL
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    
    if (error === 'access_denied' && errorCode === 'otp_expired') {
      setError('Your invitation link has expired. Please request a new invitation from your employer.')
      return
    }

    // Get company info from user metadata
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Authentication required. Please use the link from your invitation email.')
        return
      }
      
      if (user?.user_metadata) {
        const companyName = user.user_metadata.company_name || 'Get Wild'
        setCompanyName(companyName)
        setFounderName('your employer')
      }
    }

    loadUserData()
  }, [searchParams])

  // Check if user just returned from Veriff
  useEffect(() => {
    const status = searchParams.get('veriff_status')
    
    if (status === 'success') {
      // User completed verification, start polling
      setVerificationStatus('submitted')
      pollVerificationStatus()
    }
  }, [searchParams])

  // Poll verification status
  const pollVerificationStatus = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let attempts = 0
    const maxAttempts = 60 // Poll for 2 minutes max (60 * 2 seconds)

    const interval = setInterval(async () => {
      attempts++

      try {
        const response = await fetch('/api/veriff/status')
        const data = await response.json()

        console.log('[Veriff] Status check:', data.status)

        if (data.status === 'approved') {
          clearInterval(interval)
          setVerificationStatus('approved')
          // Wait 1 second then redirect to dashboard
          setTimeout(() => {
            router.push('/employee/dashboard')
          }, 1000)
        } else if (data.status === 'declined') {
          clearInterval(interval)
          setVerificationStatus('declined')
          setError('Verification was declined. Please contact support.')
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          setError('Verification is taking longer than expected. Please refresh the page.')
        }
      } catch (error) {
        console.error('[Veriff] Status check failed:', error)
      }
    }, 2000) // Poll every 2 seconds
  }

  // Start verification process - Redirect to Veriff hosted page
  const handleStartVerification = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Create Veriff session
      console.log('[Veriff] Creating session...')
      const response = await fetch('/api/veriff/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[Veriff] Session creation failed:', errorData)
        
        // Check for specific error messages
        if (errorData.error?.includes('VERIFF_API_KEY')) {
          throw new Error('Verification service not configured. Please contact support.')
        }
        
        throw new Error(errorData.error || 'Failed to create verification session')
      }

      const { sessionUrl, sessionId } = await response.json()
      console.log('[Veriff] Session created:', sessionId)
      console.log('[Veriff] Redirecting to:', sessionUrl)

      // Redirect to Veriff's hosted verification page
      // User will complete verification there and Veriff will redirect back
      window.location.href = sessionUrl

    } catch (error: any) {
      console.error('[Veriff] Error:', error)
      setError(error.message || 'Failed to start verification')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-cream min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/">
          <img
            src="https://www.figma.com/api/mcp/asset/6368c286-c151-422f-9597-9b0fdc19ea03"
            alt="Get wild."
            className="h-9 w-auto"
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Headline */}
          <div>
            <h1 className="text-4xl font-semibold text-brand-black mb-4">
              You've been invited!
            </h1>
            <p className="text-lg text-brand-gray">
              You got invited by <span className="font-medium text-brand-dark">{founderName}</span> to join {companyName}
            </p>
          </div>

          {/* Verification Button */}
          <div>
            {verificationStatus === 'idle' && !error && (
              <button
                onClick={handleStartVerification}
                disabled={isLoading}
                className="bg-[#1b1d1a] px-8 py-4 rounded-xl text-white text-lg font-medium hover:bg-[#0e1414] transition-colors w-full max-w-xs mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Redirecting to verification...' : 'Start Verification'}
              </button>
            )}

            {verificationStatus === 'submitted' && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-brand-dark">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Processing verification...</span>
                </div>
                <p className="text-sm text-brand-gray mt-2">This may take a few moments</p>
              </div>
            )}

            {verificationStatus === 'approved' && (
              <div className="text-center">
                <div className="text-green-600 text-lg font-medium">✓ Verification Approved!</div>
                <p className="text-sm text-brand-gray mt-2">Redirecting to dashboard...</p>
              </div>
            )}

            {verificationStatus === 'declined' && (
              <div className="text-center">
                <div className="text-red-600 text-lg font-medium">Verification Declined</div>
                <p className="text-sm text-brand-gray mt-2">Please contact support for assistance</p>
              </div>
            )}

            {error && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="text-red-600 text-lg font-medium mb-2">
                    {error.includes('expired') ? '⏰ Link Expired' : '⚠️ Error'}
                  </div>
                  <p className="text-red-700 text-sm">
                    {error}
                  </p>
                  {error.includes('expired') && (
                    <p className="text-red-600 text-xs mt-3">
                      Please contact your employer to send a new invitation link.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <p className="text-sm text-brand-gray">
            By continuing, you agree to our{' '}
            <Link href="/terms-of-service" className="underline hover:text-brand-dark">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="underline hover:text-brand-dark">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeVerificationPage() {
  return (
    <Suspense fallback={
      <div className="bg-brand-cream min-h-screen flex items-center justify-center">
        <p className="text-brand-gray">Loading...</p>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  )
}

