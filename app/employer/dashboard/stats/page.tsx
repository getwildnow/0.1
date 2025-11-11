'use client';

import { useState } from 'react';

// Mock health data over time (last 30 days)
const healthTrendData = [
  { day: 1, score: 82 },
  { day: 2, score: 83 },
  { day: 3, score: 81 },
  { day: 4, score: 84 },
  { day: 5, score: 85 },
  { day: 6, score: 83 },
  { day: 7, score: 86 },
  { day: 8, score: 87 },
  { day: 9, score: 85 },
  { day: 10, score: 88 },
  { day: 11, score: 86 },
  { day: 12, score: 87 },
  { day: 13, score: 89 },
  { day: 14, score: 88 },
  { day: 15, score: 87 },
  { day: 16, score: 90 },
  { day: 17, score: 89 },
  { day: 18, score: 88 },
  { day: 19, score: 91 },
  { day: 20, score: 89 },
  { day: 21, score: 90 },
  { day: 22, score: 88 },
  { day: 23, score: 89 },
  { day: 24, score: 87 },
  { day: 25, score: 88 },
  { day: 26, score: 86 },
  { day: 27, score: 87 },
  { day: 28, score: 85 },
  { day: 29, score: 86 },
  { day: 30, score: 87 },
];

// Focus heatmap data (6 AM - 8 PM)
const focusHeatmapData = [
  { hour: '6:00', mon: 44, tue: 38, wed: 32, thu: 17, fri: 34, sat: 26, sun: 42 },
  { hour: '7:00', mon: 45, tue: 33, wed: 31, thu: 28, fri: 34, sat: 33, sun: 35 },
  { hour: '8:00', mon: 58, tue: 40, wed: 40, thu: 47, fri: 45, sat: 36, sun: 52 },
  { hour: '9:00', mon: 58, tue: 49, wed: 52, thu: 52, fri: 53, sat: 64, sun: 56 },
  { hour: '10:00', mon: 74, tue: 76, wed: 70, thu: 70, fri: 63, sat: 59, sun: 63 },
  { hour: '11:00', mon: 81, tue: 83, wed: 78, thu: 68, fri: 76, sat: 80, sun: 76 },
  { hour: '12:00', mon: 89, tue: 78, wed: 78, thu: 65, fri: 81, sat: 81, sun: 86 },
  { hour: '13:00', mon: 85, tue: 78, wed: 82, thu: 77, fri: 65, sat: 67, sun: 71 },
  { hour: '14:00', mon: 76, tue: 72, wed: 73, thu: 57, fri: 69, sat: 63, sun: 70 },
  { hour: '15:00', mon: 70, tue: 53, wed: 61, thu: 63, fri: 55, sat: 48, sun: 70 },
  { hour: '16:00', mon: 58, tue: 51, wed: 39, thu: 36, fri: 39, sat: 50, sun: 44 },
  { hour: '17:00', mon: 51, tue: 31, wed: 37, thu: 23, fri: 23, sat: 35, sun: 48 },
  { hour: '18:00', mon: 32, tue: 33, wed: 31, thu: 33, fri: 21, sat: 32, sun: 41 },
  { hour: '19:00', mon: 41, tue: 36, wed: 24, thu: 32, fri: 25, sat: 24, sun: 43 },
  { hour: '20:00', mon: 45, tue: 41, wed: 37, thu: 38, fri: 38, sat: 38, sun: 44 },
];

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

// Helper function to get color based on focus percentage
const getFocusColor = (value: number) => {
  if (value >= 80) return '#C6E377'; // High focus - brand green
  if (value >= 70) return '#D4EA8A';
  if (value >= 60) return '#E2F19D';
  if (value >= 50) return '#F0F8B0';
  if (value >= 40) return '#FFF4C3';
  if (value >= 30) return '#FFE8A3';
  if (value >= 20) return '#FFDC83';
  return '#FFD063'; // Low focus - brand yellow
};

export default function StatsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30days' | '6months' | '1year' | '5years'>('30days');

  const currentData = claimsData[selectedPeriod];
  const claimCount = currentData.claims.length;

  // Calculate SVG path for smooth curve
  const width = 800;
  const height = 200;
  const padding = 40;
  const maxScore = 100;
  const minScore = 70;

  const xScale = (index: number) => padding + (index / (healthTrendData.length - 1)) * (width - 2 * padding);
  const yScale = (score: number) => height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);

  // Create smooth curve path using quadratic bezier curves
  let pathD = `M ${xScale(0)} ${yScale(healthTrendData[0].score)}`;
  for (let i = 0; i < healthTrendData.length - 1; i++) {
    const x1 = xScale(i);
    const y1 = yScale(healthTrendData[i].score);
    const x2 = xScale(i + 1);
    const y2 = yScale(healthTrendData[i + 1].score);
    const cx = (x1 + x2) / 2;
    pathD += ` Q ${cx} ${y1}, ${x2} ${y2}`;
  }

  // Create area fill path
  const areaPathD = pathD + ` L ${xScale(healthTrendData.length - 1)} ${height - padding} L ${xScale(0)} ${height - padding} Z`;

  return (
    <div className="p-8 bg-brand-cream min-h-screen text-brand-black">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-darkest">Team Health Stats</h1>
        <p className="text-brand-gray">
          Monitor your team's health metrics and claims history.
        </p>
      </header>

      {/* Health Trend Curve */}
      <div className="bg-white p-8 rounded-2xl border border-brand-gray/20 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-darkest mb-1">Team Health Trend</h2>
          <p className="text-sm text-brand-gray">30-day rolling average health score</p>
        </div>
        
        <div className="relative">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid lines */}
            {[80, 85, 90, 95].map((score) => (
              <g key={score}>
                <line
                  x1={padding}
                  y1={yScale(score)}
                  x2={width - padding}
                  y2={yScale(score)}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={yScale(score) + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#A8A8A8"
                >
                  {score}%
                </text>
              </g>
            ))}

            {/* Area fill with gradient */}
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C6E377" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C6E377" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={areaPathD}
              fill="url(#healthGradient)"
            />

            {/* Main curve line */}
            <path
              d={pathD}
              fill="none"
              stroke="#C6E377"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {healthTrendData.map((point, index) => (
              <circle
                key={point.day}
                cx={xScale(index)}
                cy={yScale(point.score)}
                r="4"
                fill="#C6E377"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
            ))}

            {/* X-axis labels */}
            {[0, 7, 14, 21, 29].map((day) => (
              <text
                key={day}
                x={xScale(day)}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#A8A8A8"
              >
                Day {day + 1}
              </text>
            ))}
          </svg>
        </div>

        {/* Current stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-brand-gray/10">
          <div>
            <p className="text-sm text-brand-gray mb-1">Current Score</p>
            <p className="text-3xl font-bold text-brand-darkest">87%</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray mb-1">Average Sleep</p>
            <p className="text-3xl font-bold text-brand-darkest">7.2h</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray mb-1">Currently Sick</p>
            <p className="text-3xl font-bold text-brand-darkest">3</p>
            <p className="text-xs text-brand-gray">of 24 employees</p>
          </div>
        </div>
      </div>

      {/* Focus Heatmap - Compact Version */}
      <div className="bg-white p-8 rounded-2xl border border-brand-gray/20 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-brand-darkest mb-1">Company Focus Heatmap</h2>
          <p className="text-sm text-brand-gray">Peak productivity hours (6 AM – 8 PM)</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-brand-gray">Low</span>
          <div className="flex gap-1">
            {[20, 30, 40, 50, 60, 70, 80, 90].map((val) => (
              <div
                key={val}
                className="w-6 h-4 rounded-sm"
                style={{ backgroundColor: getFocusColor(val) }}
              />
            ))}
          </div>
          <span className="text-xs text-brand-gray">High</span>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-brand-gray py-2 px-2 w-16">Hour</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Mon</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Tue</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Wed</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Thu</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Fri</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Sat</th>
                <th className="text-center text-xs font-medium text-brand-gray py-2 px-2">Sun</th>
              </tr>
            </thead>
            <tbody>
              {focusHeatmapData.map((row) => (
                <tr key={row.hour}>
                  <td className="text-xs text-brand-gray py-1 px-2">{row.hour}</td>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                    const value = row[day as keyof typeof row] as number;
                    return (
                      <td key={day} className="p-1">
                        <div
                          className="rounded text-center py-2 text-xs font-medium text-brand-darkest"
                          style={{ backgroundColor: getFocusColor(value) }}
                        >
                          {value}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claims Analytics */}
      <div className="bg-white p-8 rounded-2xl border border-brand-gray/20">
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
              <p className="text-sm text-brand-gray mb-1">Total Claims</p>
              <p className="text-3xl font-semibold text-brand-darkest">{claimCount}</p>
            </div>
            <div className="bg-brand-cream p-4 rounded-lg border border-brand-gray/10">
              <p className="text-sm text-brand-gray mb-1">Total Cost</p>
              <p className="text-3xl font-semibold text-brand-darkest">
                ${currentData.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart Visualization */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-brand-dark mb-3">Claims Distribution</h3>
          <div className="space-y-2">
            {currentData.claims.slice(0, 10).map((claim) => {
              const percentage = (claim.amount / currentData.total) * 100;
              return (
                <div key={claim.id} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-brand-gray truncate">{claim.employee}</div>
                  <div className="flex-1 bg-brand-cream rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-brand-darkest h-full rounded-full transition-all duration-500"
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
