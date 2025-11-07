'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalClaims: 0,
    claimsProcessing: 0,
    monthlyRevenue: 0,
    avgProcessingTime: 0,
  })

  // In a real app, this would fetch from the database
  useEffect(() => {
    setStats({
      totalCompanies: 12,
      totalEmployees: 485,
      totalClaims: 1243,
      claimsProcessing: 8,
      monthlyRevenue: 363750,
      avgProcessingTime: 42,
    })
  }, [])

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-brand-gray mt-1">Get Wild internal operations overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-yellow/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Total Companies</p>
              <p className="text-2xl font-bold">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-green/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Total Employees</p>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-teal/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Total Claims</p>
              <p className="text-2xl font-bold">{stats.totalClaims.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-500/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Processing Now</p>
              <p className="text-2xl font-bold">{stats.claimsProcessing}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-yellow/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Monthly Revenue</p>
              <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-brand-green/10 rounded-lg p-3">
              <svg className="h-6 w-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-brand-gray">Avg Processing</p>
              <p className="text-2xl font-bold">{stats.avgProcessingTime} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Pending Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">New company onboarded</p>
                <p className="text-sm text-brand-gray">StartupXYZ - 32 employees</p>
              </div>
              <span className="text-sm text-brand-gray">10 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Claim approved</p>
                <p className="text-sm text-brand-gray">CLM-2025-1042 - $1,250</p>
              </div>
              <span className="text-sm text-brand-gray">25 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-brand-gray">Tech Startup Inc. - $33,750</p>
              </div>
              <span className="text-sm text-brand-gray">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Support ticket resolved</p>
                <p className="text-sm text-brand-gray">Employee password reset</p>
              </div>
              <span className="text-sm text-brand-gray">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <h2 className="text-xl font-bold mb-4">Claims Queue</h2>
          <div className="space-y-3">
            <div className="p-3 bg-brand-black/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">CLM-2025-1043</p>
                <span className="text-sm text-orange-500">5 min waiting</span>
              </div>
              <p className="text-sm text-brand-gray">Dental - $350 - Sarah Johnson</p>
            </div>
            <div className="p-3 bg-brand-black/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">CLM-2025-1044</p>
                <span className="text-sm text-orange-500">12 min waiting</span>
              </div>
              <p className="text-sm text-brand-gray">Vision - $200 - Mike Chen</p>
            </div>
            <div className="p-3 bg-brand-black/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">CLM-2025-1045</p>
                <span className="text-sm text-orange-500">18 min waiting</span>
              </div>
              <p className="text-sm text-brand-gray">Medical - $1,500 - Emily Rodriguez</p>
            </div>
          </div>
          <a href="/admin/dashboard/claims" className="mt-4 inline-block text-brand-yellow hover:text-brand-yellow/80 font-medium">
            View All Claims →
          </a>
        </div>
      </div>
    </div>
  )
}
