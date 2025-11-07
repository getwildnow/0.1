'use client'

import { useState } from 'react'

interface Claim {
  id: string
  type: string
  provider: string
  amount: number
  date: string
  submittedAt: string
  status: 'pending' | 'processing' | 'approved' | 'paid'
  notes?: string
}

export default function ClaimsPage() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [claims] = useState<Claim[]>([
    {
      id: 'CLM-2025-001',
      type: 'Dental Cleaning',
      provider: 'Bright Smile Dental',
      amount: 150,
      date: '2025-10-15',
      submittedAt: '2025-10-16',
      status: 'paid',
    },
    {
      id: 'CLM-2025-002',
      type: 'Eye Exam',
      provider: 'Vision Care Center',
      amount: 200,
      date: '2025-09-20',
      submittedAt: '2025-09-20',
      status: 'paid',
    },
    {
      id: 'CLM-2025-003',
      type: 'General Checkup',
      provider: 'Family Health Clinic',
      amount: 300,
      date: '2025-08-10',
      submittedAt: '2025-08-10',
      status: 'paid',
    },
  ])

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-brand-yellow/10 text-brand-dark'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-brand-green/10 text-brand-green'
      case 'paid':
        return 'bg-brand-green/10 text-brand-green'
      default:
        return 'bg-brand-gray/10 text-brand-gray'
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-black">Claims</h1>
          <p className="text-brand-gray mt-1">Submit and track your health insurance claims</p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="btn-primary"
        >
          Submit New Claim
        </button>
      </div>

      {/* Claims Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm font-medium text-brand-gray">Total Claims</p>
          <p className="text-2xl font-bold text-brand-black">{claims.length}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-brand-gray">Total Amount</p>
          <p className="text-2xl font-bold text-brand-black">
            ${claims.reduce((sum, claim) => sum + claim.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-brand-gray">Approved</p>
          <p className="text-2xl font-bold text-brand-green">100%</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-brand-gray">Avg Processing</p>
          <p className="text-2xl font-bold text-brand-black">42 min</p>
        </div>
      </div>

      {/* Claims List */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-brand-gray/20">
          <thead className="bg-brand-cream/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-gray/20">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-brand-cream/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-black">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  {claim.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  {claim.provider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-black">
                  ${claim.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  {new Date(claim.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Claim Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-brand-black mb-4">Submit New Claim</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Type of Service
                </label>
                <select className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green">
                  <option>Medical Visit</option>
                  <option>Dental Service</option>
                  <option>Vision Care</option>
                  <option>Mental Health</option>
                  <option>Prescription</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Provider Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                    placeholder="Dr. Smith / Clinic Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green"
                  placeholder="Brief description of the service received"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Upload Receipt/Invoice
                </label>
                <div className="w-full px-3 py-8 border-2 border-dashed border-brand-gray/30 rounded-lg text-center hover:border-brand-green cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-brand-gray">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-brand-gray">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-brand-dark hover:text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
