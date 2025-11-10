'use client';

import { useState } from 'react';
import {
  HeartIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

// Mock data - in production this would come from your database
const healthMetrics = {
  sickEmployees: 3,
  totalEmployees: 24,
  averageSleep: 7.2, // hours
  sleepQuality: 'Good',
};

const claimsData = {
  '30days': {
    claims: [
      { id: 1, employee: 'Lindsay Walton', date: '2025-11-05', amount: 450, type: 'Doctor Visit' },
      { id: 2, employee: 'Tom Cook', date: '2025-11-08', amount: 1200, type: 'Lab Tests' },
      { id: 3, employee: 'Whitney Francis', date: '2025-11-02', amount: 320, type: 'Prescription' },
    ],
    total: 1970,
  },
  '6months': {
    claims: [
      { id: 1, employee: 'Lindsay Walton', date: '2025-11-05', amount: 450, type: 'Doctor Visit' },
      { id: 2, employee: 'Tom Cook', date: '2025-11-08', amount: 1200, type: 'Lab Tests' },
      { id: 3, employee: 'Whitney Francis', date: '2025-11-02', amount: 320, type: 'Prescription' },
      { id: 4, employee: 'Courtney Henry', date: '2025-10-15', amount: 890, type: 'Specialist' },
      { id: 5, employee: 'Leonard Krasner', date: '2025-09-22', amount: 2100, type: 'Surgery' },
      { id: 6, employee: 'Floyd Miles', date: '2025-08-10', amount: 540, type: 'Physical Therapy' },
      { id: 7, employee: 'Lindsay Walton', date: '2025-07-18', amount: 380, type: 'Dental' },
      { id: 8, employee: 'Tom Cook', date: '2025-06-25', amount: 720, type: 'Vision' },
    ],
    total: 6600,
  },
  '1year': {
    claims: [
      { id: 1, employee: 'Lindsay Walton', date: '2025-11-05', amount: 450, type: 'Doctor Visit' },
      { id: 2, employee: 'Tom Cook', date: '2025-11-08', amount: 1200, type: 'Lab Tests' },
      { id: 3, employee: 'Whitney Francis', date: '2025-11-02', amount: 320, type: 'Prescription' },
      { id: 4, employee: 'Courtney Henry', date: '2025-10-15', amount: 890, type: 'Specialist' },
      { id: 5, employee: 'Leonard Krasner', date: '2025-09-22', amount: 2100, type: 'Surgery' },
      { id: 6, employee: 'Floyd Miles', date: '2025-08-10', amount: 540, type: 'Physical Therapy' },
      { id: 7, employee: 'Lindsay Walton', date: '2025-07-18', amount: 380, type: 'Dental' },
      { id: 8, employee: 'Tom Cook', date: '2025-06-25', amount: 720, type: 'Vision' },
      { id: 9, employee: 'Whitney Francis', date: '2025-05-12', amount: 1450, type: 'Emergency Room' },
      { id: 10, employee: 'Courtney Henry', date: '2025-04-08', amount: 620, type: 'Prescription' },
      { id: 11, employee: 'Leonard Krasner', date: '2025-03-15', amount: 890, type: 'Specialist' },
      { id: 12, employee: 'Floyd Miles', date: '2025-02-20', amount: 340, type: 'Doctor Visit' },
      { id: 13, employee: 'Lindsay Walton', date: '2025-01-10', amount: 1100, type: 'Lab Tests' },
      { id: 14, employee: 'Tom Cook', date: '2024-12-18', amount: 480, type: 'Prescription' },
    ],
    total: 11480,
  },
  '5years': {
    claims: [
      { id: 1, employee: 'Lindsay Walton', date: '2025-11-05', amount: 450, type: 'Doctor Visit' },
      { id: 2, employee: 'Tom Cook', date: '2025-11-08', amount: 1200, type: 'Lab Tests' },
      { id: 3, employee: 'Whitney Francis', date: '2025-11-02', amount: 320, type: 'Prescription' },
      { id: 4, employee: 'Courtney Henry', date: '2025-10-15', amount: 890, type: 'Specialist' },
      { id: 5, employee: 'Leonard Krasner', date: '2025-09-22', amount: 2100, type: 'Surgery' },
      { id: 6, employee: 'Floyd Miles', date: '2025-08-10', amount: 540, type: 'Physical Therapy' },
      { id: 7, employee: 'Lindsay Walton', date: '2024-07-18', amount: 3800, type: 'Major Surgery' },
      { id: 8, employee: 'Tom Cook', date: '2024-03-25', amount: 1720, type: 'Specialist Treatment' },
      { id: 9, employee: 'Whitney Francis', date: '2023-11-12', amount: 2450, type: 'Emergency Room' },
      { id: 10, employee: 'Courtney Henry', date: '2023-06-08', amount: 1620, type: 'Physical Therapy' },
      { id: 11, employee: 'Leonard Krasner', date: '2022-09-15', amount: 4890, type: 'Major Surgery' },
      { id: 12, employee: 'Floyd Miles', date: '2022-02-20', amount: 1340, type: 'Specialist' },
      { id: 13, employee: 'Lindsay Walton', date: '2021-08-10', amount: 2100, type: 'Surgery' },
      { id: 14, employee: 'Tom Cook', date: '2021-03-18', amount: 1480, type: 'Lab Tests' },
      { id: 15, employee: 'Whitney Francis', date: '2020-11-22', amount: 890, type: 'Specialist' },
    ],
    total: 26790,
  },
};

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30days' | '6months' | '1year' | '5years'>('30days');

  const currentData = claimsData[selectedPeriod];
  const claimCount = currentData.claims.length;

  return (
    <div className="p-8 bg-brand-cream min-h-screen text-brand-black">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-darkest">Team Health Stats</h1>
        <p className="text-brand-gray">
          Monitor your team's health metrics and claims history.
        </p>
      </header>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-lg border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-brand-gray truncate">Currently Sick</dt>
                <dd className="flex items-baseline">
                  <p className="text-2xl font-semibold text-brand-darkest">{healthMetrics.sickEmployees}</p>
                  <p className="ml-2 text-sm text-brand-gray">
                    of {healthMetrics.totalEmployees} employees
                  </p>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MoonIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-brand-gray truncate">Average Sleep</dt>
                <dd className="flex items-baseline">
                  <p className="text-2xl font-semibold text-brand-darkest">{healthMetrics.averageSleep}h</p>
                  <p className="ml-2 text-sm text-brand-gray">
                    per night
                  </p>
                </dd>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    {healthMetrics.sleepQuality}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-gray/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-brand-gray truncate">Team Health Score</dt>
                <dd className="flex items-baseline">
                  <p className="text-2xl font-semibold text-brand-darkest">87%</p>
                  <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    +2%
                  </p>
                </dd>
                <dd className="mt-1 text-xs text-brand-gray">
                  vs last month
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Analytics */}
      <div className="bg-white p-6 rounded-lg border border-brand-gray/20">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-darkest mb-4">Claims Overview</h2>
          
          {/* Period Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '30days'
                  ? 'bg-brand-black text-white'
                  : 'bg-brand-cream text-brand-dark hover:bg-brand-gray/10'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedPeriod('6months')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '6months'
                  ? 'bg-brand-black text-white'
                  : 'bg-brand-cream text-brand-dark hover:bg-brand-gray/10'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setSelectedPeriod('1year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '1year'
                  ? 'bg-brand-black text-white'
                  : 'bg-brand-cream text-brand-dark hover:bg-brand-gray/10'
              }`}
            >
              1 Year
            </button>
            <button
              onClick={() => setSelectedPeriod('5years')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === '5years'
                  ? 'bg-brand-black text-white'
                  : 'bg-brand-cream text-brand-dark hover:bg-brand-gray/10'
              }`}
            >
              5 Years
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            <div className="bg-brand-cream p-4 rounded-lg border border-brand-gray/10">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-brand-gray mr-3" />
                <div>
                  <p className="text-sm text-brand-gray">Total Claims</p>
                  <p className="text-2xl font-semibold text-brand-darkest">{claimCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-brand-cream p-4 rounded-lg border border-brand-gray/10">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-brand-gray mr-3" />
                <div>
                  <p className="text-sm text-brand-gray">Total Cost</p>
                  <p className="text-2xl font-semibold text-brand-darkest">
                    ${currentData.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart Visualization */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-brand-dark mb-3">Claims Distribution</h3>
          <div className="space-y-2">
            {currentData.claims.slice(0, 10).map((claim, index) => {
              const percentage = (claim.amount / currentData.total) * 100;
              return (
                <div key={claim.id} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-brand-gray truncate">{claim.employee}</div>
                  <div className="flex-1 bg-brand-cream rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-brand-green h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-brand-dark">
                      ${claim.amount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <h3 className="text-sm font-medium text-brand-dark mb-3">Detailed Claims History</h3>
          <table className="min-w-full divide-y divide-brand-gray/20">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-brand-darkest uppercase tracking-wider">
                  Employee
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-brand-darkest uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-brand-darkest uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-brand-darkest uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray/10">
              {currentData.claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-brand-cream/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-brand-darkest">
                    {claim.employee}
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-gray">
                    {new Date(claim.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-gray">{claim.type}</td>
                  <td className="py-3 px-4 text-sm font-medium text-brand-darkest text-right">
                    ${claim.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-cream">
                <td colSpan={3} className="py-3 px-4 text-sm font-semibold text-brand-darkest">
                  Total
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-brand-darkest text-right">
                  ${currentData.total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

