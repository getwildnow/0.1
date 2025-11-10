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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'submitted' | 'approved' | 'declined'>('idle')
  const veriffInstanceRef = useRef<any>(null)
  const veriffMountedRef = useRef(false)

  useEffect(() => {
    const initVeriff = async () => {
      // Get company info from user metadata
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.user_metadata) {
        const companyName = user.user_metadata?.company_name || 'Get Wild'
        setCompanyName(companyName)
        setFounderName('your employer')
      }

      // Initialize Veriff SDK (client-side only with dynamic import)
      if (typeof window !== 'undefined' && !veriffInstanceRef.current && !veriffMountedRef.current) {
        try {
          console.log('[Veriff] Dynamically loading SDK...')
          
          // Dynamic import to avoid SSR issues
          Promise.all([
            import('@veriff/js-sdk'),
            import('@veriff/incontext-sdk')
          ]).then(([VeriffModule, InContextModule]) => {
            const Veriff = VeriffModule.default
            const { createVeriffFrame } = InContextModule
            
            console.log('[Veriff] Initializing SDK...')
            
            const veriffInstance = Veriff({
              apiKey: process.env.NEXT_PUBLIC_VERIFF_API_KEY || 'bc193001-958f-45ca-931f-c6a040a59ff9',
              parentId: 'veriff-root',
              onSession: function(err: any, response: any) {
                if (err) {
                  console.error('[Veriff] Session error:', err)
                  setError('Failed to start verification. Please try again.')
                  setIsLoading(false)
                  return
                }

                console.log('[Veriff] Session created:', response)
                
                // Open InContext modal
                createVeriffFrame({
                  url: response.verification.url,
                  onEvent: (msg: string) => {
                    console.log('[Veriff] Event:', msg)
                    
                    if (msg === 'FINISHED') {
                      console.log('[Veriff] Verification submitted')
                      setVerificationStatus('submitted')
                      pollVerificationStatus()
                    } else if (msg === 'CANCELED') {
                      console.log('[Veriff] Verification canceled')
                      setIsLoading(false)
                    }
                  }
                })
                
                setIsLoading(false)
              }
            })

            veriffInstanceRef.current = veriffInstance
            
            // Mount the Veriff SDK
            veriffInstance.mount({
              submitBtnText: 'Start Verification'
            })
            
            veriffMountedRef.current = true
            console.log('[Veriff] SDK mounted successfully')
          }).catch((err) => {
            console.error('[Veriff] Failed to load SDK:', err)
          })
          
        } catch (err) {
          console.error('[Veriff] Initialization error:', err)
        }
      }
    }

    initVeriff()
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

          {/* Veriff SDK Container - SDK will render its button here */}
          <div id="veriff-root" className="flex justify-center"></div>

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

