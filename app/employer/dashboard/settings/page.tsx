'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Tech Startup Inc.',
    email: 'hr@techstartup.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    employeeCount: 45,
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
        <h1 className="text-3xl font-bold text-brand-black">Settings</h1>
        <p className="text-brand-gray mt-1">Manage your company information and preferences</p>
      </div>

      <div className="max-w-3xl">
        {/* Company Information */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-brand-black mb-6">Company Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Company Address
              </label>
              <textarea
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Number of Employees
              </label>
              <input
                type="number"
                min="20"
                value={companyInfo.employeeCount}
                onChange={(e) => setCompanyInfo({ ...companyInfo, employeeCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
              />
              <p className="text-sm text-brand-gray mt-1">Minimum 20 employees required</p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {saved && (
                  <p className="text-sm text-brand-green font-medium">Settings saved successfully!</p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-brand-green border-brand-gray/30 rounded focus:ring-brand-green" />
              <span className="ml-3 text-brand-dark">Email me when an employee submits a claim</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-brand-green border-brand-gray/30 rounded focus:ring-brand-green" />
              <span className="ml-3 text-brand-dark">Email me monthly billing reminders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-brand-green border-brand-gray/30 rounded focus:ring-brand-green" />
              <span className="ml-3 text-brand-dark">Email me about new features and updates</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-brand-green border-brand-gray/30 rounded focus:ring-brand-green" />
              <span className="ml-3 text-brand-dark">Send SMS alerts for urgent matters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
