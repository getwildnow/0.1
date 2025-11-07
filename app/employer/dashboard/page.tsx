'use client'

import { useEffect, useState } from 'react'

export default function EmployerDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingClaims: 0,
    monthlyPremium: 0,
  })

  // In a real app, this would fetch from the database
  useEffect(() => {
    setStats({
      totalEmployees: 45,
      activeEmployees: 43,
      pendingClaims: 3,
      monthlyPremium: 33750, // $750 * 45 employees
    })
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Dashboard Overview</h1>
        <p className="text-brand-gray mt-1">Welcome back! Here's your company's health insurance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-green/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Total Employees</p>
              <p className="text-2xl font-bold text-brand-black">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-yellow/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Active Coverage</p>
              <p className="text-2xl font-bold text-brand-black">{stats.activeEmployees}</p>
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
              <p className="text-sm font-medium text-brand-gray">Pending Claims</p>
              <p className="text-2xl font-bold text-brand-black">{stats.pendingClaims}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-charcoal/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Monthly Premium</p>
              <p className="text-2xl font-bold text-brand-black">${stats.monthlyPremium.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/employer/dashboard/employees"
              className="flex items-center justify-between p-3 bg-brand-cream rounded-lg hover:bg-brand-gray/10 transition-colors"
            >
              <span className="font-medium text-brand-dark">Add New Employee</span>
              <svg className="h-5 w-5 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/employer/dashboard/billing"
              className="flex items-center justify-between p-3 bg-brand-cream rounded-lg hover:bg-brand-gray/10 transition-colors"
            >
              <span className="font-medium text-brand-dark">View Billing History</span>
              <svg className="h-5 w-5 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/employer/dashboard/settings"
              className="flex items-center justify-between p-3 bg-brand-cream rounded-lg hover:bg-brand-gray/10 transition-colors"
            >
              <span className="font-medium text-brand-dark">Update Company Info</span>
              <svg className="h-5 w-5 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-brand-black mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
              <div>
                <p className="font-medium text-brand-dark">New employee added</p>
                <p className="text-sm text-brand-gray">John Smith joined the team</p>
              </div>
              <span className="text-sm text-brand-gray">2 days ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
              <div>
                <p className="font-medium text-brand-dark">Claim approved</p>
                <p className="text-sm text-brand-gray">Sarah Johnson's claim processed</p>
              </div>
              <span className="text-sm text-brand-gray">3 days ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-cream rounded-lg">
              <div>
                <p className="font-medium text-brand-dark">Monthly invoice paid</p>
                <p className="text-sm text-brand-gray">November payment successful</p>
              </div>
              <span className="text-sm text-brand-gray">5 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
