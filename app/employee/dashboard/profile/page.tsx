'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

interface ProfileData {
  name: string
  email: string
  phone: string
  role: string
  companyName: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profileInfo, setProfileInfo] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    companyName: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      console.log('[Profile] Loading profile data...')
      setLoading(true)
      setError(null)

      const response = await fetch('/api/employee/profile')
      
      console.log('[Profile] API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Profile] API error response:', errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        
        throw new Error(errorData.error || `API returned ${response.status}`)
      }

      const data = await response.json()
      console.log('[Profile] ✅ Loaded data:', data)

      const fullName = [data.employee?.first_name, data.employee?.last_name]
        .filter(Boolean)
        .join(' ') || data.user?.metadata?.name || ''

      setProfileInfo({
        name: fullName,
        email: data.user?.email || '',
        phone: data.employee?.phone || '',
        role: data.user?.metadata?.role || data.employee?.role || '',
        companyName: data.user?.metadata?.company_name || ''
      })

      console.log('[Profile] ✅ Profile loaded successfully')
    } catch (err: any) {
      console.error('[Profile] ❌ Error loading profile:', err)
      setError(`Failed to load profile: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('[Profile] Saving profile...')
      setSaving(true)
      setError(null)
      setSaved(false)

      const response = await fetch('/api/employee/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileInfo),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      console.log('[Profile] ✅ Profile saved successfully')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('[Profile] ❌ Error saving profile:', err)
      setError(`Failed to save profile: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F5F4F0]">
        {/* Sidebar */}
        <div className="w-[270px] bg-[#2C2D2A] flex flex-col">
          <div className="p-8">
            <h1 className="text-white text-2xl font-bold">Get wild.</h1>
          </div>
          <nav className="flex-1 px-4">
            <button
              onClick={() => router.push('/employee/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#A8A8A8] hover:bg-[#3A3B38] hover:text-white transition-colors mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>AI Chat</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#3A3B38] text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
          </nav>
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
              className="w-full px-4 py-3 rounded-lg bg-white text-[#2C2D2A] font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C2D2A] mx-auto"></div>
            <p className="mt-4 text-[#5C5C5C]">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F5F4F0]">
      {/* Sidebar */}
      <div className="w-[270px] bg-[#2C2D2A] flex flex-col">
        <div className="p-8">
          <h1 className="text-white text-2xl font-bold">Get wild.</h1>
        </div>
        <nav className="flex-1 px-4">
          <button
            onClick={() => router.push('/employee/dashboard')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#A8A8A8] hover:bg-[#3A3B38] hover:text-white transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>AI Chat</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#3A3B38] text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>
        </nav>
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
      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#11120D] mb-2">My Profile</h1>
            <p className="text-[#5C5C5C]">Manage your personal information</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-[#11120D] mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5C5C5C] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2D2A] focus:border-transparent"
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C5C5C] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileInfo.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-[#A8A8A8] mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5C5C5C] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileInfo.phone}
                    onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C2D2A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C5C5C] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileInfo.companyName}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5C5C5C] mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileInfo.role}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  {saved && (
                    <p className="text-sm text-green-600 font-medium">✓ Profile saved successfully!</p>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-3 bg-[#1B1D1A] text-white rounded-lg font-medium hover:bg-[#2C2D2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
