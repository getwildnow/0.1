'use client'

import { useState } from 'react'

interface Employee {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
}

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Engineering Manager', status: 'active', joinDate: '2023-06-15' },
    { id: '2', name: 'Mike Chen', email: 'mike@company.com', role: 'Senior Developer', status: 'active', joinDate: '2023-08-01' },
    { id: '3', name: 'Emily Rodriguez', email: 'emily@company.com', role: 'Product Designer', status: 'active', joinDate: '2023-09-10' },
    { id: '4', name: 'John Smith', email: 'john@company.com', role: 'Marketing Lead', status: 'pending', joinDate: '2025-11-01' },
  ])

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-black">Employees</h1>
          <p className="text-brand-gray mt-1">Manage your team's health insurance coverage</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1b1d1a] px-4 py-2 rounded-xl text-white hover:bg-[#0e1414] transition-colors"
        >
          Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-brand-gray/20">
          <thead className="bg-brand-cream/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                Role
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
          <tbody className="bg-white divide-y divide-brand-gray/20">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-brand-cream/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-brand-black">{employee.name}</div>
                    <div className="text-sm text-brand-gray">{employee.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-brand-dark">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === 'active'
                      ? 'bg-brand-green/10 text-brand-green'
                      : employee.status === 'pending'
                      ? 'bg-brand-yellow/10 text-brand-dark'
                      : 'bg-brand-gray/10 text-brand-gray'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-brand-green hover:text-brand-green/80 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-500">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-5">
            <h2 className="text-lg font-semibold text-brand-black mb-3">Add Employee</h2>
            <form className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-brand-dark mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark mb-1">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-dark mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-1.5 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                  placeholder="employee@company.com"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-sm text-brand-dark hover:text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1b1d1a] px-4 py-1.5 text-sm rounded-lg text-white hover:bg-[#0e1414] transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
