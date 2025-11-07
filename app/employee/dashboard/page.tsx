'use client'

export default function EmployeeDashboard() {
  const employee = {
    name: 'Sarah Johnson',
    company: 'Tech Startup Inc.',
    coverageStatus: 'active',
    memberSince: '2023-06-15',
  }

  const quickStats = {
    claimsThisYear: 3,
    claimsApproved: 3,
    totalBenefitsUsed: 2450,
    deductible: 0,
  }

  const recentClaims = [
    { id: '1', type: 'Dental Cleaning', amount: 150, date: '2025-10-15', status: 'paid' },
    { id: '2', type: 'Eye Exam', amount: 200, date: '2025-09-20', status: 'paid' },
    { id: '3', type: 'General Checkup', amount: 300, date: '2025-08-10', status: 'paid' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Welcome back, {employee.name}!</h1>
        <p className="text-brand-gray mt-1">Your health coverage is {employee.coverageStatus}. Everything is covered!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-yellow/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Coverage Status</p>
              <p className="text-2xl font-bold text-brand-green capitalize">{employee.coverageStatus}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-green/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Your Deductible</p>
              <p className="text-2xl font-bold text-brand-black">${quickStats.deductible}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-teal/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Claims This Year</p>
              <p className="text-2xl font-bold text-brand-black">{quickStats.claimsThisYear}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-charcoal/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Claim Processing</p>
              <p className="text-2xl font-bold text-brand-black">{"<59 min"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-4">Your Coverage Includes</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-brand-green mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-brand-dark">Everything Health Related</p>
                <p className="text-sm text-brand-gray">All medical, dental, vision, and mental health services</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-brand-green mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-brand-dark">Zero Deductibles or Co-pays</p>
                <p className="text-sm text-brand-gray">No out-of-pocket costs for covered services</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-brand-green mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-brand-dark">Any Provider, Anywhere</p>
                <p className="text-sm text-brand-gray">No network restrictions - see any healthcare provider</p>
              </div>
            </div>
          </div>
          <a href="/employee/dashboard/coverage" className="btn-primary mt-6 inline-block">
            View Full Coverage Details
          </a>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-4">Recent Claims</h2>
          <div className="space-y-3">
            {recentClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
                <div>
                  <p className="font-medium text-brand-dark">{claim.type}</p>
                  <p className="text-sm text-brand-gray">{new Date(claim.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-brand-black">${claim.amount}</p>
                  <p className="text-sm text-brand-green capitalize">{claim.status}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="/employee/dashboard/claims" className="btn-secondary mt-6 inline-block">
            Submit New Claim
          </a>
        </div>
      </div>

      {/* Support Card */}
      <div className="card bg-brand-yellow/10 border-brand-yellow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-black">Need Help?</h3>
            <p className="text-brand-dark mt-1">
              24/7 human support available. We'll connect you in under 30 seconds and resolve your issue in under 3 minutes.
            </p>
          </div>
          <a href="mailto:support@getwild-now.com" className="btn-primary">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
