'use client'

import { useState } from 'react'

interface Company {
  id: string
  name: string
  email: string
  employees: number
  status: 'trial' | 'active' | 'past_due' | 'canceled'
  monthlyPremium: number
  joinDate: string
}

export default function CompaniesPage() {
  const [companies] = useState<Company[]>([
    {
      id: '1',
      name: 'Tech Startup Inc.',
      email: 'hr@techstartup.com',
      employees: 45,
      status: 'active',
      monthlyPremium: 33750,
      joinDate: '2023-03-15',
    },
    {
      id: '2',
      name: 'Digital Agency Co',
      email: 'admin@digitalagency.co',
      employees: 28,
      status: 'active',
      monthlyPremium: 21000,
      joinDate: '2023-06-20',
    },
    {
      id: '3',
      name: 'StartupXYZ',
      email: 'hr@startupxyz.io',
      employees: 32,
      status: 'trial',
      monthlyPremium: 24000,
      joinDate: '2025-11-01',
    },
    {
      id: '4',
      name: 'Innovation Labs',
      email: 'team@innovationlabs.com',
      employees: 56,
      status: 'active',
      monthlyPremium: 42000,
      joinDate: '2023-09-10',
    },
  ])

  const getStatusColor = (status: Company['status']) => {
    switch (status) {
      case 'active':
        return 'bg-brand-green/10 text-brand-green'
      case 'trial':
        return 'bg-brand-yellow/10 text-brand-yellow'
      case 'past_due':
        return 'bg-red-500/10 text-red-500'
      case 'canceled':
        return 'bg-brand-gray/10 text-brand-gray'
      default:
        return 'bg-brand-gray/10 text-brand-gray'
    }
  }

  return (
    <div className="text-white">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-brand-gray mt-1">Manage all registered companies</p>
        </div>
        <button className="bg-brand-yellow text-brand-black px-4 py-2 rounded-lg font-medium hover:bg-brand-yellow/90">
          Add Company
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Total Companies</p>
          <p className="text-2xl font-bold">{companies.length}</p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Active</p>
          <p className="text-2xl font-bold text-brand-green">
            {companies.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Total Employees</p>
          <p className="text-2xl font-bold">
            {companies.reduce((sum, c) => sum + c.employees, 0)}
          </p>
        </div>
        <div className="bg-brand-dark rounded-lg p-4 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Monthly Revenue</p>
          <p className="text-2xl font-bold text-brand-yellow">
            ${companies.reduce((sum, c) => sum + c.monthlyPremium, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-brand-dark rounded-lg border border-brand-gray/20 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-brand-black/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Employees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Monthly Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/20">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-brand-black/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium">{company.name}</div>
                    <div className="text-sm text-brand-gray">{company.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{company.employees}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">${company.monthlyPremium.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray">
                  {new Date(company.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-brand-yellow hover:text-brand-yellow/80 mr-3">
                    View
                  </button>
                  <button className="text-brand-gray hover:text-white">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
