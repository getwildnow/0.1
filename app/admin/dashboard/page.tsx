'use client';

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
} from '@heroicons/react/24/outline';

const kpis = [
  {
    name: 'Connected Companies',
    value: '12',
    icon: BuildingOfficeIcon,
    change: '+2',
    changeType: 'increase',
  },
  {
    name: 'Active Users',
    value: '8,345',
    icon: UserGroupIcon,
    change: '+5.4%',
    changeType: 'increase',
  },
  {
    name: 'Wearables Connected',
    value: '7,982',
    icon: CubeTransparentIcon,
    change: '95%',
    changeType: 'increase',
  },
  {
    name: 'Incoming Data Points',
    value: '2.3M',
    icon: ArrowDownTrayIcon,
    change: '-1.2%',
    changeType: 'decrease',
  },
];

const companies = [
  {
    name: 'Innovate Inc.',
    users: 150,
    wearables: 145,
    status: 'Active',
    logo: 'https://tailwindui.com/img/logos/reform-logo-gray-900.svg',
  },
  {
    name: 'Apex Solutions',
    users: 75,
    wearables: 70,
    status: 'Active',
    logo: 'https://tailwindui.com/img/logos/tuple-logo-gray-900.svg',
  },
  {
    name: 'Quantum Dynamics',
    users: 220,
    wearables: 210,
    status: 'Active',
    logo: 'https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg',
  },
  {
    name: 'Synergy Corp',
    users: 50,
    wearables: 48,
    status: 'Onboarding',
    logo: 'https://tailwindui.com/img/logos/statamic-logo-gray-900.svg',
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-[#F9F9F9] min-h-screen text-brand-black">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-darkest">Dashboard</h1>
        <p className="text-brand-gray">
          An overview of your key metrics and connected companies.
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
                  <dd className="flex items-baseline">
                    <p className="text-2xl font-semibold text-brand-darkest">{kpi.value}</p>
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {kpi.change}
                    </p>
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
            <h2 className="text-xl font-semibold text-brand-darkest">Connected Companies</h2>
            <p className="mt-1 text-sm text-brand-gray">
              A list of all companies in your ecosystem.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Company
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
              placeholder="Search by Company, User ID, Name..."
            />
          </div>
          <div>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-brand-gray shadow-sm hover:bg-gray-50">
              <span>Sort by: Created on</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
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
                    COMPANY
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-brand-darkest"
                  >
                    USERS
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-brand-darkest"
                  >
                    WEARABLES
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
                {companies.map((company) => (
                  <tr key={company.name}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-contain"
                            src={company.logo}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-brand-darkest">{company.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-gray">
                      {company.users}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-gray">
                      {company.wearables}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-brand-gray">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          company.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-brand-green hover:text-brand-green-light">
                        View<span className="sr-only">, {company.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
