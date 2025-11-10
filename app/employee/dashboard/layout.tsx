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

      console.log('[Layout] Starting auth check with retry logic...')

      // Retry up to 5 times with exponential backoff to allow Supabase to process URL hash tokens
      for (let attempt = 0; attempt < 5; attempt++) {
        console.log(`[Layout] Auth attempt ${attempt + 1}/5`)
        
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          console.log('[Layout] ✅ User authenticated!')
          console.log('[Layout] - User ID:', user.id)
          console.log('[Layout] - Email:', user.email)
          console.log('[Layout] - Name:', user.user_metadata?.name)
          setIsVerified(true)
          setIsLoading(false)
          return
        }

        // Wait before retry with exponential backoff (100ms, 200ms, 400ms, 800ms, 1600ms)
        const delay = 100 * Math.pow(2, attempt)
        console.log(`[Layout] No user found, waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      // After all retries failed, redirect to login
      console.log('[Layout] ❌ All auth attempts failed, redirecting to login...')
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
