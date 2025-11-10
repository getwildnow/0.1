'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface ProfileData {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  role: string
  companyName: string
  memberSince: string
  coverageStatus: string
}

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    role: '',
    companyName: '',
    memberSince: '',
    coverageStatus: 'active'
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
      
      if (!response.ok) {
        throw new Error('Failed to load profile')
      }

      const data = await response.json()
      console.log('[Profile] Loaded data:', data)

      // Combine first and last name
      const fullName = [data.employee.first_name, data.employee.last_name]
        .filter(Boolean)
        .join(' ') || data.user.metadata?.name || ''

      // Format date for input (YYYY-MM-DD)
      const dateOfBirth = data.employee.date_of_birth || ''

      // Format member since date
      const memberSince = data.employee.created_at 
        ? new Date(data.employee.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : 'N/A'

      setProfileInfo({
        name: fullName,
        email: data.user.email || '',
        phone: data.employee.phone || '',
        dateOfBirth: dateOfBirth,
        address: data.employee.address || '',
        emergencyContact: data.employee.emergency_contact_name || '',
        emergencyPhone: data.employee.emergency_contact_phone || '',
        role: data.user.metadata?.role || data.employee.role || '',
        companyName: data.user.metadata?.company_name || '',
        memberSince: memberSince,
        coverageStatus: data.employee.coverage_status || 'active'
      })

      console.log('[Profile] Profile loaded successfully')
    } catch (err: any) {
      console.error('[Profile] Error loading profile:', err)
      setError('Failed to load profile. Please refresh the page.')
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
        throw new Error('Failed to save profile')
      }

      console.log('[Profile] Profile saved successfully')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('[Profile] Error saving profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark mx-auto"></div>
          <p className="mt-4 text-brand-gray">Loading profile...</p>
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
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="max-w-3xl">
        {/* Personal Information */}
        <div className="card mb-8">
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

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={profileInfo.dateOfBirth}
                onChange={(e) => setProfileInfo({ ...profileInfo, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Address
              </label>
              <textarea
                value={profileInfo.address}
                onChange={(e) => setProfileInfo({ ...profileInfo, address: e.target.value })}
                rows={2}
                placeholder="123 Main St, San Francisco, CA 94105"
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
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

        {/* Emergency Contact */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-brand-black mb-6">Emergency Contact</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Contact Name
              </label>
              <input
                type="text"
                value={profileInfo.emergencyContact}
                onChange={(e) => setProfileInfo({ ...profileInfo, emergencyContact: e.target.value })}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={profileInfo.emergencyPhone}
                onChange={(e) => setProfileInfo({ ...profileInfo, emergencyPhone: e.target.value })}
                placeholder="+1 (555) 987-6543"
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Coverage Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-4">Coverage Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-brand-gray">Coverage Status</p>
              <p className="font-medium text-brand-green capitalize">{profileInfo.coverageStatus}</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Member Since</p>
              <p className="font-medium text-brand-black">{profileInfo.memberSince}</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Employer</p>
              <p className="font-medium text-brand-black">{profileInfo.companyName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Role</p>
              <p className="font-medium text-brand-black capitalize">{profileInfo.role || 'Employee'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
