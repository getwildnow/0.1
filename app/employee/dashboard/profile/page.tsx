'use client'

import { useState, useEffect } from 'react'

interface ProfileData {
  name: string
  email: string
  phone: string
  role: string
  companyName: string
}

export default function ProfilePage() {
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

      // Combine first and last name, or use metadata name
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

      console.log('[Profile] ✅ Profile loaded successfully:', {
        name: fullName,
        email: data.user?.email,
        company: data.user?.metadata?.company_name
      })
    } catch (err: any) {
      console.error('[Profile] ❌ Error loading profile:', err)
      setError(`Failed to load profile: ${err.message}. Check console for details.`)
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark mx-auto"></div>
          <p className="mt-4 text-brand-gray">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">My Profile</h1>
        <p className="text-brand-gray mt-1">Manage your personal information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
          <p className="text-xs text-red-500 mt-1">Open browser console (F12) for more details</p>
        </div>
      )}

      <div className="max-w-3xl">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                required
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileInfo.email}
                  disabled
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-brand-gray mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileInfo.phone}
                  onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={profileInfo.companyName}
                  disabled
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={profileInfo.role}
                  disabled
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {saved && (
                  <p className="text-sm text-brand-green font-medium">✓ Profile saved successfully!</p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
