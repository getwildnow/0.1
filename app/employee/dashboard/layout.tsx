'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { DashboardLayout } from '@/components/DashboardLayout'

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      console.log('[Layout] Starting authentication check...')
      console.log('[Layout] Current URL:', window.location.href)

      // STEP 1: Check for hash parameters (invite link flow)
      if (window.location.hash) {
        console.log('[Layout] Found hash parameters in URL')
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const error = hashParams.get('error')
        const errorCode = hashParams.get('error_code')
        const errorDescription = hashParams.get('error_description')

        console.log('[Layout] Hash params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error,
          errorCode,
          errorDescription
        })

        // Check for errors in URL (expired/invalid link)
        if (error || errorCode) {
          console.error('[Layout] ❌ Auth error in URL:', error, errorCode, errorDescription)
          
          if (errorCode === 'otp_expired') {
            console.log('[Layout] Link expired, redirecting to login...')
            router.push('/employee/login?error=link_expired')
            return
          }
          
          console.log('[Layout] Auth failed, redirecting to login...')
          router.push('/employee/login?error=auth_failed')
          return
        }

        // If we have valid tokens, establish the session
        if (accessToken && refreshToken) {
          console.log('[Layout] Valid tokens found, establishing session...')
          
          try {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) {
              console.error('[Layout] ❌ Failed to set session:', sessionError.message)
              router.push('/employee/login?error=session_failed')
              return
            }

            console.log('[Layout] ✅ Session established successfully!')
            console.log('[Layout] - User ID:', data.user?.id)
            console.log('[Layout] - Email:', data.user?.email)
            console.log('[Layout] - Name:', data.user?.user_metadata?.name)
            console.log('[Layout] - Company:', data.user?.user_metadata?.company_name)

            // Clean up the URL (remove hash parameters)
            console.log('[Layout] Cleaning up URL...')
            window.history.replaceState({}, document.title, window.location.pathname)

            setIsVerified(true)
            setIsLoading(false)
            return
          } catch (err) {
            console.error('[Layout] ❌ Exception during session setup:', err)
            router.push('/employee/login?error=session_failed')
            return
          }
        }
      }

      // STEP 2: No hash parameters, check for existing session
      console.log('[Layout] No hash parameters, checking for existing session...')
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('[Layout] Error getting user:', userError.message)
        router.push('/employee/login')
        return
      }

      if (user) {
        console.log('[Layout] ✅ Existing session found!')
        console.log('[Layout] - User ID:', user.id)
        console.log('[Layout] - Email:', user.email)
        setIsVerified(true)
        setIsLoading(false)
        return
      }

      // STEP 3: No session found, redirect to login
      console.log('[Layout] ❌ No authentication found, redirecting to login...')
      router.push('/employee/login')
    }

    checkAuth()
  }, [router])

  // Show loading while checking verification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
          <p className="mt-2 text-brand-gray">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render dashboard if verified
  if (!isVerified) {
    return null
  }

  const links = [
    { name: 'AI Chat', href: '/employee/dashboard', icon: <ChatIcon /> },
    { name: 'Profile', href: '/employee/dashboard/profile', icon: <UserIcon /> },
  ]

  return (
    <DashboardLayout links={links}>
      {children}
    </DashboardLayout>
  )
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
