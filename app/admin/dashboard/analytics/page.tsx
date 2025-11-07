'use client'

export default function AnalyticsPage() {
  const monthlyStats = [
    { month: 'Jun', revenue: 180000, claims: 245, employees: 240 },
    { month: 'Jul', revenue: 225000, claims: 312, employees: 300 },
    { month: 'Aug', revenue: 270000, claims: 378, employees: 360 },
    { month: 'Sep', revenue: 315000, claims: 425, employees: 420 },
    { month: 'Oct', revenue: 340000, claims: 489, employees: 453 },
    { month: 'Nov', revenue: 363750, claims: 523, employees: 485 },
  ]

  const claimsByType = [
    { type: 'Medical', count: 412, amount: 185400 },
    { type: 'Dental', count: 298, amount: 44700 },
    { type: 'Vision', count: 256, amount: 38400 },
    { type: 'Mental Health', count: 189, amount: 37800 },
    { type: 'Prescription', count: 88, amount: 26400 },
  ]

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-brand-gray mt-1">Business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Monthly Growth Rate</p>
          <p className="text-3xl font-bold text-brand-green">+12.8%</p>
          <p className="text-xs text-brand-gray mt-2">vs last month</p>
        </div>
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Customer Retention</p>
          <p className="text-3xl font-bold text-brand-yellow">98.5%</p>
          <p className="text-xs text-brand-gray mt-2">6 month average</p>
        </div>
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">Claim Approval Rate</p>
          <p className="text-3xl font-bold text-brand-green">99.2%</p>
          <p className="text-xs text-brand-gray mt-2">All time</p>
        </div>
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <p className="text-sm font-medium text-brand-gray">NPS Score</p>
          <p className="text-3xl font-bold text-brand-yellow">89</p>
          <p className="text-xs text-brand-gray mt-2">Excellent</p>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20 mb-8">
        <h2 className="text-xl font-bold mb-4">Revenue Trend (Last 6 Months)</h2>
        <div className="space-y-4">
          {monthlyStats.map((stat) => (
            <div key={stat.month}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{stat.month}</span>
                <span className="text-sm text-brand-gray">${stat.revenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-brand-black/50 rounded-full h-2">
                <div
                  className="bg-brand-yellow h-2 rounded-full"
                  style={{ width: `${(stat.revenue / 400000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Claims by Type */}
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <h2 className="text-xl font-bold mb-4">Claims by Type (YTD)</h2>
          <div className="space-y-3">
            {claimsByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
                <div>
                  <p className="font-medium">{item.type}</p>
                  <p className="text-sm text-brand-gray">{item.count} claims</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.amount.toLocaleString()}</p>
                  <p className="text-sm text-brand-gray">
                    {((item.count / 1243) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Performance */}
        <div className="bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
          <h2 className="text-xl font-bold mb-4">Top Companies by Revenue</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Innovation Labs</p>
                <p className="text-sm text-brand-gray">56 employees</p>
              </div>
              <p className="font-medium text-brand-yellow">$42,000/mo</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Tech Startup Inc.</p>
                <p className="text-sm text-brand-gray">45 employees</p>
              </div>
              <p className="font-medium text-brand-yellow">$33,750/mo</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">StartupXYZ</p>
                <p className="text-sm text-brand-gray">32 employees</p>
              </div>
              <p className="font-medium text-brand-yellow">$24,000/mo</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-black/50 rounded-lg">
              <div>
                <p className="font-medium">Digital Agency Co</p>
                <p className="text-sm text-brand-gray">28 employees</p>
              </div>
              <p className="font-medium text-brand-yellow">$21,000/mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Efficiency */}
      <div className="mt-8 bg-brand-dark rounded-lg p-6 border border-brand-gray/20">
        <h2 className="text-xl font-bold mb-4">Processing Efficiency</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-brand-gray mb-2">Claims Processed Today</p>
            <p className="text-2xl font-bold">47</p>
            <p className="text-sm text-brand-green mt-1">↑ 15% vs yesterday</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray mb-2">Average Processing Time</p>
            <p className="text-2xl font-bold">42 min</p>
            <p className="text-sm text-brand-green mt-1">17 min under target</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray mb-2">Support Tickets Resolved</p>
            <p className="text-2xl font-bold">28</p>
            <p className="text-sm text-brand-gray mt-1">Avg resolution: 2.3 min</p>
          </div>
        </div>
      </div>
    </div>
  )
}
