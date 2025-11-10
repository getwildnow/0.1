'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  PlusIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const kpis = [
  {
    name: 'Total Employees',
    value: '75',
    icon: UserGroupIcon,
    change: '',
    changeType: 'neutral',
  },
  {
    name: 'Active Wearables',
    value: '70',
    icon: CubeTransparentIcon,
    change: '',
    changeType: 'neutral',
  },
  {
    name: 'Monthly Premium',
    value: '$56,250',
    icon: CurrencyDollarIcon,
    change: 'for November',
    changeType: 'neutral',
  },
  {
    name: 'Recent Claims',
    value: '3',
    icon: DocumentTextIcon,
    change: 'in last 30 days',
    changeType: 'neutral',
  },
];

const employees = [
  {
    name: 'Lindsay Walton',
    title: 'Frontend Developer',
    email: 'lindsay.walton@example.com',
    wearable: 'Oura Ring',
    status: 'Connected',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    wearable: 'Whoop',
    status: 'Connected',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    title: 'Director of Product',
    email: 'tom.cook@example.com',
    wearable: 'None',
    status: 'Pending Invite',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    wearable: 'Oura Ring',
    status: 'Connected',
    image:
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export default function EmployerDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inviteResults, setInviteResults] = useState<any>(null);

  const chatGPTPrompt = `Create a CSV file with employee data for bulk upload. The CSV should have exactly 3 columns: Name, Role, Email. Include 5-10 sample employees with realistic data. Format:

Name,Role,Email
John Doe,Software Engineer,john.doe@company.com
Jane Smith,Product Manager,jane.smith@company.com

Make sure the first row is the header row.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(chatGPTPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) return;

    setIsProcessing(true);
    setInviteResults(null);

    try {
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found. Please log in again.');
      }

      // Parse CSV file
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Validate CSV has required columns
            const csvData = results.data as any[];
            if (csvData.length === 0) {
              throw new Error('CSV file is empty');
            }

            // Map CSV data to employee format
            const employees = csvData.map((row: any) => ({
              name: row.Name || row.name || '',
              role: row.Role || row.role || '',
              email: row.Email || row.email || ''
            }));

            // Send to API
            const response = await fetch('/api/employees/invite', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                employees,
                companyId
              }),
            });

            const responseData = await response.json();

            if (!response.ok) {
              throw new Error(responseData.error || 'Failed to send invitations');
            }

            setInviteResults(responseData);
            setUploadedFile(null);
            
            // Close modal after 3 seconds if all successful
            if (responseData.summary.failed === 0) {
              setTimeout(() => {
                setShowAddModal(false);
                setInviteResults(null);
              }, 3000);
            }

          } catch (err: any) {
            setInviteResults({
              success: false,
              error: err.message
            });
          } finally {
            setIsProcessing(false);
          }
        },
        error: (error) => {
          setInviteResults({
            success: false,
            error: 'Failed to parse CSV file: ' + error.message
          });
          setIsProcessing(false);
        }
      });

    } catch (err: any) {
      setInviteResults({
        success: false,
        error: err.message
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 bg-[#F9F9F9] min-h-screen text-brand-black">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-darkest">Your Dashboard</h1>
        <p className="text-brand-gray">
          Manage your team and view key health metrics.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <kpi.icon className="h-6 w-6 text-brand-gray" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-brand-gray truncate">{kpi.name}</dt>
                  <dd className="flex flex-col">
                    <p className="text-2xl font-semibold text-brand-darkest">{kpi.value}</p>
                    {kpi.change && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {kpi.change}
                      </p>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-brand-darkest">Team Members</h2>
            <p className="mt-1 text-sm text-brand-gray">
              A list of all employees in your company.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-[#1b1d1a] px-4 py-2 rounded-xl text-white hover:bg-[#0e1414] transition-colors inline-flex items-center"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm p-2"
              placeholder="Search by Name, Email..."
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-brand-gray shadow-sm hover:bg-gray-50"
            >
              <span>Sort by: {sortBy}</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setSortBy('Name');
                    setShowSortMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-gray-50"
                >
                  Name
                </button>
                <button
                  onClick={() => {
                    setSortBy('Status');
                    setShowSortMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-gray-50"
                >
                  Status
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-brand-darkest sm:pl-0"
                  >
                    NAME
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-brand-darkest"
                  >
                    WEARABLE
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-brand-darkest"
                  >
                    STATUS
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {employees.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-brand-darkest">{person.name}</div>
                          <div className="text-brand-gray">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-gray">
                      {person.wearable}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-gray">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          person.status === 'Connected'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {person.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-brand-green hover:text-brand-green-light">
                        View<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-black">Add Employees</h2>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-brand-gray hover:text-brand-dark flex items-center gap-1"
                title="Copy ChatGPT prompt"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied!' : ''}
              </button>
            </div>

            <form onSubmit={handleSubmitInvites}>
              {/* File Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-brand-green bg-brand-cream'
                    : 'border-brand-gray/30 hover:border-brand-gray/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-brand-gray mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-brand-dark font-medium mb-1">
                      {uploadedFile ? uploadedFile.name : 'Drop CSV file here or click to browse'}
                    </p>
                    <p className="text-xs text-brand-gray">
                      CSV with Name, Role, Email columns
                    </p>
                  </div>
                </label>
              </div>

              {uploadedFile && !isProcessing && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-green-800">{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Results Display */}
              {inviteResults && (
                <div className="mt-4">
                  {inviteResults.success ? (
                    <div>
                      {inviteResults.summary.successful > 0 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
                          <p className="text-sm font-medium text-green-800">
                            ✓ {inviteResults.summary.successful} {inviteResults.summary.successful === 1 ? 'employee' : 'employees'} invited successfully!
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Invitation emails have been sent.
                          </p>
                        </div>
                      )}
                      {inviteResults.summary.failed > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-2">
                            ⚠ {inviteResults.summary.failed} {inviteResults.summary.failed === 1 ? 'employee' : 'employees'} could not be invited
                          </p>
                          <div className="text-xs text-yellow-700 space-y-1">
                            {inviteResults.results
                              .filter((r: any) => !r.success)
                              .map((r: any, idx: number) => (
                                <div key={idx}>
                                  • {r.email}: {r.error}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">
                        Error: {inviteResults.error}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">Processing invitations...</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setUploadedFile(null);
                    setInviteResults(null);
                  }}
                  className="px-3 py-1.5 text-sm text-brand-dark hover:text-brand-black"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadedFile || isProcessing}
                  className="bg-[#1b1d1a] px-4 py-1.5 text-sm rounded-lg text-white hover:bg-[#0e1414] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Sending...' : 'Send invite links'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
