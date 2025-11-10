'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

function VerificationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [founderName, setFounderName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Start with loading state
  const [error, setError] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'submitted' | 'approved' | 'declined'>('idle')
  const [sdkReady, setSdkReady] = useState(false)
  const veriffInstanceRef = useRef<any>(null)
  const veriffMountedRef = useRef(false)

  // Load user info and prepare Veriff
  useEffect(() => {
    const init = async () => {
      console.log('[Init] Starting initialization...')
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      console.log('[Init] User check:', user ? `Authenticated: ${user.id}` : 'Not authenticated')
      
      if (user?.user_metadata) {
        const companyName = user.user_metadata?.company_name || 'Get Wild'
        setCompanyName(companyName)
        setFounderName('your employer')
        console.log('[Init] Company loaded:', companyName)
      }

      // Load Veriff InContext SDK
      if (typeof window !== 'undefined' && !veriffMountedRef.current) {
        try {
          console.log('[Veriff] Loading InContext SDK...')
          
          const { createVeriffFrame } = await import('@veriff/incontext-sdk')
          
          // Store the start function for button click
          veriffInstanceRef.current = {
            start: async () => {
              setIsLoading(true)
              setError('')
              
              try {
                console.log('[Veriff] Calling Supabase Edge Function to create session...')
                
                // Get current session token
                const { data: { session } } = await supabase.auth.getSession()
                
                if (!session) {
                  throw new Error('Not authenticated. Please use the link from your email.')
                }

                // Call Supabase Edge Function
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-veriff-session`,
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${session.access_token}`,
                      'Content-Type': 'application/json',
                    },
                  }
                )

                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || 'Failed to create verification session')
                }

                const { sessionUrl } = await response.json()
                console.log('[Veriff] Session created successfully, opening modal...')

                // Open Veriff InContext modal
                createVeriffFrame({
                  url: sessionUrl,
                  onEvent: (msg: string) => {
                    console.log('[Veriff] Modal event:', msg)
                    
                    if (msg === 'FINISHED') {
                      console.log('[Veriff] Verification submitted, polling for result...')
                      setVerificationStatus('submitted')
                      setIsLoading(false)
                      pollVerificationStatus()
                    } else if (msg === 'CANCELED') {
                      console.log('[Veriff] Verification canceled by user')
                      setIsLoading(false)
                    }
                  },
                })
                
                setIsLoading(false)
              } catch (error: any) {
                console.error('[Veriff] Error:', error)
                setError(error.message)
                setIsLoading(false)
              }
            }
          }
          
          veriffMountedRef.current = true
          setSdkReady(true)
          setIsLoading(false)
          console.log('[Veriff] ✅ SDK ready, button will call Edge Function')
          
        } catch (err) {
          console.error('[Veriff] ❌ Failed to load SDK:', err)
          setError('Failed to load verification system. Please refresh the page.')
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    init()
  }, [])


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
          {sdkReady && !error && verificationStatus === 'idle' && (
            <button
              onClick={() => veriffInstanceRef.current?.start()}
              disabled={isLoading}
              className="bg-[#1b1d1a] px-8 py-4 rounded-xl text-white text-lg font-medium hover:bg-[#0e1414] transition-colors w-full max-w-xs mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Start Verification'}
            </button>
          )}

          {/* Loading State */}
          {isLoading && verificationStatus === 'idle' && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-brand-dark">
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium">Loading...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="text-red-600 text-lg font-medium mb-2">⚠️ Error</div>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          <div>
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

