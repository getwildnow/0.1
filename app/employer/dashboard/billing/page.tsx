'use client'

import { useState, useEffect } from 'react'
import { StripeCheckout } from '@/components/StripeCheckout'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  employees: number
}

export default function BillingPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(true) // In real app, check from database

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('success') === 'true') {
      setShowSuccess(true)
      setIsSubscribed(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [])

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: 'company-id-here', // In real app, get from context
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }
  const [invoices] = useState<Invoice[]>([
    { id: 'INV-2025-11', date: '2025-11-01', amount: 33750, status: 'paid', employees: 45 },
    { id: 'INV-2025-10', date: '2025-10-01', amount: 33000, status: 'paid', employees: 44 },
    { id: 'INV-2025-09', date: '2025-09-01', amount: 32250, status: 'paid', employees: 43 },
    { id: 'INV-2025-08', date: '2025-08-01', amount: 31500, status: 'paid', employees: 42 },
  ])

  const currentPlan = {
    name: 'Startup Health Insurance',
    pricePerEmployee: 750,
    employeeCount: 45,
    nextBillingDate: '2025-12-01',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Billing</h1>
        <p className="text-brand-gray mt-1">Manage your subscription and view invoices</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green rounded-lg">
          <p className="text-brand-green font-medium">✓ Payment successful! Your subscription is now active.</p>
        </div>
      )}

      {/* Current Plan */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-brand-black mb-4">Current Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-brand-gray">Plan Type</p>
            <p className="text-lg font-semibold text-brand-black">{currentPlan.name}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Monthly Cost</p>
            <p className="text-lg font-semibold text-brand-black">
              ${currentPlan.pricePerEmployee} × {currentPlan.employeeCount} employees = ${(currentPlan.pricePerEmployee * currentPlan.employeeCount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Next Billing Date</p>
            <p className="text-lg font-semibold text-brand-black">{new Date(currentPlan.nextBillingDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">Payment Method</p>
            <div className="flex items-center mt-1">
              <svg className="h-8 w-12 mr-2" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <path d="M20 10h8v12h-8z" fill="white"/>
                <circle cx="20" cy="16" r="5" fill="#EB001B"/>
                <circle cx="28" cy="16" r="5" fill="#F79E1B"/>
              </svg>
              <span className="text-brand-dark">•••• 4242</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          {isSubscribed ? (
            <button onClick={handleManageBilling} className="btn-primary">
              Manage Subscription
            </button>
          ) : (
            <StripeCheckout companyId="company-id-here" employeeCount={currentPlan.employeeCount} />
          )}
          <button className="btn-secondary">Download Invoice</button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="card">
        <h2 className="text-xl font-bold text-brand-black mb-4">Invoice History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-gray/20">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                  Amount
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
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-brand-cream/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-black">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                    {invoice.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-black">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-brand-green/10 text-brand-green'
                        : invoice.status === 'pending'
                        ? 'bg-brand-yellow/10 text-brand-dark'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-brand-green hover:text-brand-green/80">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
