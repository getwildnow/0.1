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
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const kpis = [
  {
    name: 'Total Employees',
    value: '75',
    icon: UserGroupIcon,
    change: '+5 this month',
    changeType: 'increase',
  },
  {
    name: 'Active Wearables',
    value: '70',
    icon: CubeTransparentIcon,
    change: '93% adoption',
    changeType: 'increase',
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
                  <dd className="flex items-baseline">
                    <p className="text-2xl font-semibold text-brand-darkest">{kpi.value}</p>
                    <p
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        kpi.changeType === 'increase'
                          ? 'text-green-600'
                          : kpi.changeType === 'decrease'
                          ? 'text-red-600'
                          : 'text-gray-500'
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
            <h2 className="text-xl font-semibold text-brand-darkest">Team Members</h2>
            <p className="mt-1 text-sm text-brand-gray">
              A list of all employees in your company.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-brand-green px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
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
          <div>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-brand-gray shadow-sm hover:bg-gray-50">
              <span>Sort by: Name</span>
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
    </div>
  );
}
