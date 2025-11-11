'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function EmployeeDashboard() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [userName, setUserName] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[Dashboard] Checking authentication...')
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.log('[Dashboard] Not authenticated, redirecting to login...')
        router.push('/employee/login')
        return
      }

      console.log('[Dashboard] ✅ User authenticated!')
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'User')
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Handle message submission
    console.log('Message:', message)
    setMessage('')
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark mx-auto"></div>
          <p className="mt-4 text-brand-gray text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F5F4F0]">
      {/* Sidebar */}
      <div className="w-[270px] bg-[#2C2D2A] flex flex-col">
        {/* Logo */}
        <div className="p-8">
          <h1 className="text-white text-2xl font-bold">Get wild.</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#3A3B38] text-white mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>AI Chat</span>
          </button>

          <button
            onClick={() => router.push('/employee/dashboard/profile')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#A8A8A8] hover:bg-[#3A3B38] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>

        {/* Sign Out Button */}
        <div className="p-4">
          <button
            onClick={async () => {
              const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              )
              await supabase.auth.signOut()
              router.push('/employee/login')
            }}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#2C2D2A] font-medium hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Hidden on mobile, can add hamburger menu later */}
        <div className="h-16"></div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-2xl">
            {/* AI Doctor Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-[#11120D] mb-4">AI Doctor</h1>
              <p className="text-lg text-[#5C5C5C]">Everything about your health in one place.</p>
            </div>

            {/* Chat Input Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="When is the next time I should visit the doctor?"
                  className="w-full text-base text-[#11120D] placeholder-[#A8A8A8] bg-transparent border-none focus:outline-none mb-4"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B1D1A] text-white rounded-full text-sm font-medium hover:bg-[#2C2D2A] transition-colors flex items-center space-x-2"
                  >
                    <span>Start Chat</span>
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
