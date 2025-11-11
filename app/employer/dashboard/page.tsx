'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import {
  ChevronDownIcon,
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
  },
  {
    name: 'Monthly Premium',
    value: '$56,250',
    icon: CurrencyDollarIcon,
    subtitle: 'for November',
  },
  {
    name: 'Recent Claims',
    value: '3',
    icon: DocumentTextIcon,
    subtitle: 'in last 30 days',
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [inviteResults, setInviteResults] = useState<any>(null);
  const [singleName, setSingleName] = useState('');
  const [singleRole, setSingleRole] = useState('');
  const [singleEmail, setSingleEmail] = useState('');

  const invalidEmailResults =
    inviteResults?.success
      ? inviteResults.results?.filter(
          (entry: any) => !entry.success && entry.error === 'Invalid email format'
        ) || []
      : [];

  const otherFailedResults =
    inviteResults?.success
      ? inviteResults.results?.filter(
          (entry: any) => !entry.success && entry.error !== 'Invalid email format'
        ) || []
      : [];

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
    
    // Check if we have either single employee or CSV file
    if (!uploadedFile && !singleEmail) return;

    setIsProcessing(true);
    setInviteResults(null);

    try {
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found. Please log in again.');
      }

      // Handle single employee invite
      if (singleEmail && !uploadedFile) {
        const response = await fetch('/api/employees/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employees: [{
              name: singleName,
              role: singleRole,
              email: singleEmail
            }],
            companyId
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to send invitation');
        }

        setInviteResults(responseData);
        setSingleName('');
        setSingleRole('');
        setSingleEmail('');
        
        // Close modal after 3 seconds if successful
        if (responseData.summary.failed === 0) {
          setTimeout(() => {
            setShowAddModal(false);
            setInviteResults(null);
          }, 3000);
        }
        setIsProcessing(false);
        return;
      }

      // Handle CSV bulk upload
      if (!uploadedFile) return;

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
    <div className="p-8 bg-brand-cream min-h-screen text-brand-black">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-darkest">Your Dashboard</h1>
        <p className="text-brand-gray">
          Manage your team and view key health metrics.
        </p>
      </header>

      {/* KPIs - Only Most Important */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-white p-6 rounded-lg border border-brand-gray/20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <kpi.icon className="h-6 w-6 text-brand-gray" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-brand-gray truncate">{kpi.name}</dt>
                  <dd className="flex flex-col">
                    <p className="text-2xl font-semibold text-brand-darkest">{kpi.value}</p>
                    {kpi.subtitle && (
                      <p className="text-xs text-brand-gray mt-0.5">
                        {kpi.subtitle}
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
      <div className="bg-white p-6 rounded-lg border border-brand-gray/20">
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
              className="block w-full rounded-lg border-brand-gray/30 focus:border-brand-green focus:ring-brand-green sm:text-sm p-2"
              placeholder="Search by Name, Email..."
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center justify-center rounded-lg border border-brand-gray/30 bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-cream transition-colors"
            >
              <span>Sort by: {sortBy}</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-brand-gray/20 z-10">
                <button
                  onClick={() => {
                    setSortBy('Name');
                    setShowSortMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-cream rounded-t-lg"
                >
                  Name
                </button>
                <button
                  onClick={() => {
                    setSortBy('Status');
                    setShowSortMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-cream rounded-b-lg"
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
            <table className="min-w-full divide-y divide-brand-gray/20">
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
              <tbody className="divide-y divide-brand-gray/20 bg-white">
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
                            ? 'bg-brand-green/10 text-brand-green'
                            : 'bg-brand-yellow/20 text-brand-dark'
                        }`}
                      >
                        {person.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-brand-green hover:text-brand-green-light transition-colors">
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
            </div>

            <form onSubmit={handleSubmitInvites}>
              {/* Single Employee Form */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                    placeholder="John Doe"
                    disabled={isProcessing || !!uploadedFile}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={singleRole}
                    onChange={(e) => setSingleRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                    placeholder="Software Engineer"
                    disabled={isProcessing || !!uploadedFile}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-gray/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                    placeholder="john@company.com"
                    disabled={isProcessing || !!uploadedFile}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-gray/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-brand-gray">Or upload CSV for bulk invite</span>
                </div>
              </div>

              {/* CSV Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
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
                  disabled={isProcessing || !!(singleName || singleRole || singleEmail)}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-brand-gray mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-brand-dark font-medium mb-1">
                      {uploadedFile ? uploadedFile.name : 'Drop CSV file or click to browse'}
                    </p>
                    <p className="text-xs text-brand-gray">
                      Name, Role, Email columns
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
                <div className="mt-4 space-y-3">
                  {inviteResults.success && inviteResults.summary?.successful > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        ✓ {inviteResults.summary.successful}{' '}
                        {inviteResults.summary.successful === 1 ? 'employee' : 'employees'} invited successfully!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Invitation emails have been sent.
                      </p>
                    </div>
                  )}

                  {inviteResults.success && invalidEmailResults.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-brand-darkest">
                        We couldn’t send invites to these emails — they don’t look valid:
                      </p>
                      <p className="text-xs text-brand-gray mt-1 break-words">
                        {invalidEmailResults.map((entry: any) => entry.email).join(', ')}
                      </p>
                    </div>
                  )}

                  {inviteResults.success && otherFailedResults.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-brand-darkest">
                        Some invitations couldn’t be sent. Please try again shortly.
                      </p>
                    </div>
                  )}

                  {!inviteResults.success && inviteResults.error && (
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
                    setSingleName('');
                    setSingleRole('');
                    setSingleEmail('');
                    setInviteResults(null);
                  }}
                  className="px-3 py-1.5 text-sm text-brand-dark hover:text-brand-black"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(!uploadedFile && !singleEmail) || isProcessing}
                  className="bg-[#1b1d1a] px-4 py-1.5 text-sm rounded-lg text-white hover:bg-[#0e1414] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Sending...' : uploadedFile ? 'Send invite links' : 'Send invite link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
