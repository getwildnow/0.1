'use client'

import { useState } from 'react'

interface Claim {
  id: string
  employeeName: string
  companyName: string
  type: string
  amount: number
  submittedAt: string
  status: 'pending' | 'processing' | 'approved' | 'denied' | 'paid'
  processingTime?: number
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 'CLM-2025-1043',
      employeeName: 'Sarah Johnson',
      companyName: 'Tech Startup Inc.',
      type: 'Dental',
      amount: 350,
      submittedAt: '2025-11-07T10:30:00',
      status: 'pending',
    },
    {
      id: 'CLM-2025-1044',
      employeeName: 'Mike Chen',
      companyName: 'Digital Agency Co',
      type: 'Vision',
      amount: 200,
      submittedAt: '2025-11-07T10:23:00',
      status: 'pending',
    },
    {
      id: 'CLM-2025-1045',
      employeeName: 'Emily Rodriguez',
      companyName: 'Innovation Labs',
      type: 'Medical',
      amount: 1500,
      submittedAt: '2025-11-07T10:17:00',
      status: 'processing',
    },
    {
      id: 'CLM-2025-1042',
      employeeName: 'John Doe',
      companyName: 'Tech Startup Inc.',
      type: 'Prescription',
      amount: 1250,
      submittedAt: '2025-11-07T09:45:00',
      status: 'paid',
      processingTime: 35,
    },
  ])

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/10 text-orange-500'
      case 'processing':
        return 'bg-blue-500/10 text-blue-500'
      case 'approved':
        return 'bg-brand-green/10 text-brand-green'
      case 'paid':
        return 'bg-brand-green/10 text-brand-green'
      case 'denied':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-brand-gray/10 text-brand-gray'
    }
  }

  const getWaitingTime = (submittedAt: string) => {
    const submitted = new Date(submittedAt)
    const now = new Date()
    const diffMs = now.getTime() - submitted.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const handleApprove = (claimId: string) => {
    setClaims(claims.map(claim => 
      claim.id === claimId 
        ? { ...claim, status: 'approved' as const, processingTime: getWaitingTime(claim.submittedAt) }
        : claim
    ))
  }

  const handleDeny = (claimId: string) => {
    setClaims(claims.map(claim => 
      claim.id === claimId 
        ? { ...claim, status: 'denied' as const, processingTime: getWaitingTime(claim.submittedAt) }
        : claim
    ))
  }

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Claims Management</h1>
        <p className="text-brand-gray mt-1">Process and manage all insurance claims</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Pending</p>
          <p className="text-2xl font-bold text-orange-500">
            {claims.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Processing</p>
          <p className="text-2xl font-bold text-blue-500">
            {claims.filter(c => c.status === 'processing').length}
          </p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Today's Claims</p>
          <p className="text-2xl font-bold">{claims.length}</p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Total Amount</p>
          <p className="text-2xl font-bold">
            ${claims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Avg Processing</p>
          <p className="text-2xl font-bold text-brand-green">42 min</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-brand-dark rounded-lg border border-brand-gray/20 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-brand-black/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Employee / Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Waiting Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/20">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-brand-black/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium">{claim.employeeName}</div>
                    <div className="text-sm text-brand-gray">{claim.companyName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {claim.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ${claim.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {claim.processingTime ? (
                    <span className="text-brand-green">{claim.processingTime} min</span>
                  ) : (
                    <span className="text-orange-500">{getWaitingTime(claim.submittedAt)} min</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="text-brand-green hover:text-brand-green/80 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(claim.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  {claim.status !== 'pending' && (
                    <button className="text-brand-yellow hover:text-brand-yellow/80">
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Processing Guidelines */}
      <div className="mt-8 bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
        <h2 className="text-lg font-bold mb-3">Processing Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-brand-yellow mb-2">Quick Approval Criteria:</p>
            <ul className="space-y-1 text-brand-gray">
              <li>• Amount under $5,000</li>
              <li>• Valid receipt/invoice attached</li>
              <li>• Service date within last 90 days</li>
              <li>• Provider is licensed/registered</li>
            </ul>
          </div>
          <div>
            <p className="text-brand-yellow mb-2">Requires Review:</p>
            <ul className="space-y-1 text-brand-gray">
              <li>• Amount over $5,000</li>
              <li>• Experimental treatments</li>
              <li>• International providers</li>
              <li>• Multiple claims same day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
