'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[Auth Callback] Processing authentication...')
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Check if we have hash parameters (invite/magic link flow)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      console.log('[Auth Callback] Token type:', type)
      console.log('[Auth Callback] Has access token:', !!accessToken)
      console.log('[Auth Callback] Has refresh token:', !!refreshToken)

      if (accessToken && refreshToken) {
        console.log('[Auth Callback] Setting session from tokens...')
        
        // Set the session using the tokens from the URL
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          console.error('[Auth Callback] Error setting session:', sessionError.message)
          setError('Failed to authenticate. Please try again.')
          return
        }

        console.log('[Auth Callback] ✅ Session established!')
        console.log('[Auth Callback] User ID:', data.user?.id)
        console.log('[Auth Callback] User email:', data.user?.email)
        console.log('[Auth Callback] User metadata:', data.user?.user_metadata)

        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500))

        // Redirect to dashboard
        console.log('[Auth Callback] Redirecting to dashboard...')
        router.push('/employee/dashboard')
        return
      }

      // Check for code parameter (PKCE flow - for future use)
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (code) {
        console.log('[Auth Callback] Exchanging code for session...')
        
        const { data, error: codeError } = await supabase.auth.exchangeCodeForSession(code)

        if (codeError) {
          console.error('[Auth Callback] Error exchanging code:', codeError.message)
          setError('Failed to authenticate. Please try again.')
          return
        }

        console.log('[Auth Callback] ✅ Session established from code!')
        console.log('[Auth Callback] User ID:', data.user?.id)
        
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500))

        router.push('/employee/dashboard')
        return
      }

      // No tokens found
      console.error('[Auth Callback] No authentication tokens found')
      setError('No authentication information found. Please use the link from your email.')
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg font-medium mb-4">Authentication Error</div>
          <p className="text-brand-gray mb-6">{error}</p>
          <a
            href="/employee/login"
            className="text-brand-dark underline hover:text-brand-dark/80"
          >
            Go to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark mx-auto"></div>
        <p className="mt-4 text-brand-gray text-lg">Authenticating...</p>
      </div>
    </div>
  )
}

