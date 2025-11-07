'use client'

import { useState } from 'react'

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@techstartup.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '456 Main St, San Francisco, CA 94105',
    emergencyContact: 'John Johnson',
    emergencyPhone: '+1 (555) 987-6543',
  })

  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the database
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">My Profile</h1>
        <p className="text-brand-gray mt-1">Manage your personal information</p>
      </div>

      <div className="max-w-3xl">
        {/* Personal Information */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-brand-black mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileInfo.firstName}
                  onChange={(e) => setProfileInfo({ ...profileInfo, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileInfo.lastName}
                  onChange={(e) => setProfileInfo({ ...profileInfo, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileInfo.email}
                  onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileInfo.phone}
                  onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
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
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {saved && (
                  <p className="text-sm text-brand-green font-medium">Profile saved successfully!</p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Save Changes
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
              <p className="text-sm text-brand-gray">Member ID</p>
              <p className="font-medium text-brand-black">GW-2023-0615-001</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Coverage Status</p>
              <p className="font-medium text-brand-green">Active</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Member Since</p>
              <p className="font-medium text-brand-black">June 15, 2023</p>
            </div>
            <div>
              <p className="text-sm text-brand-gray">Employer</p>
              <p className="font-medium text-brand-black">Tech Startup Inc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
