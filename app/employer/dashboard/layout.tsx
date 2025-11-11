'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('employer_auth')
    
    if (!auth) {
      // Not authenticated, redirect to login unless already on login page
      if (pathname !== '/employer/dashboard/login') {
        router.push('/employer/dashboard/login')
      }
      setIsLoading(false)
      return
    }

    try {
      const authData = JSON.parse(auth)
      const now = Date.now()
      
      // Check if session is still valid (24 hours)
      if (authData.expires && authData.expires > now) {
        setIsAuthenticated(true)
      } else {
        // Session expired
        localStorage.removeItem('employer_auth')
        if (pathname !== '/employer/dashboard/login') {
          router.push('/employer/dashboard/login')
        }
      }
    } catch (err) {
      localStorage.removeItem('employer_auth')
      if (pathname !== '/employer/dashboard/login') {
        router.push('/employer/dashboard/login')
      }
    }
    
    setIsLoading(false)
  }, [router, pathname])

  // Show loading state
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

  // If on login page, show it without auth check
  if (pathname === '/employer/dashboard/login') {
    return <>{children}</>
  }

  // If not authenticated, don't render dashboard
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
