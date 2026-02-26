/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export function CommissionChart() {
  const [period, setPeriod] = useState<'3M' | '6M' | '12M'>('6M');

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Commissions Over Time
          </h3>
          <p className="text-sm text-gray-600">
            Total Breakdown for the last 6 months
          </p>
        </div>
        <div className="flex gap-2">
          {['3M', '6M', '12M'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={
                `px-2 py-2 rounded-sm text-sm font-medium transition-colors` +
                (p === period
                  ? ' border border-gray-300 bg-white text-gray-900 '
                  : ' text-gray-600 hover:bg-gray-50')
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart placeholder with SVG wave */}
      <div className="w-full h-64 mt-6 relative">
        <svg
          viewBox="0 0 600 150"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Background fill */}
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          <g stroke="#e5e7eb" strokeWidth="1">
            <line x1="0" y1="30" x2="600" y2="30" />
            <line x1="0" y1="75" x2="600" y2="75" />
            <line x1="0" y1="120" x2="600" y2="120" />
          </g>

          {/* Wave path */}
          <path
            d="M 0 100 Q 50 60 100 80 T 200 70 T 300 90 T 400 50 T 500 80 T 600 60 L 600 150 L 0 150 Z"
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <path
            d="M 0 100 Q 50 60 100 80 T 200 70 T 300 90 T 400 50 T 500 80 T 600 60"
            stroke="#f59e0b"
            strokeWidth="3"
            fill="none"
          />

          {/* Data point indicator */}
          <g>
            <line
              x1="300"
              y1="50"
              x2="300"
              y2="150"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <circle
              cx="300"
              cy="90"
              r="5"
              fill="#fff"
              stroke="#f59e0b"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Tooltip */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md border border-gray-200 px-4 py-3 text-xs">
          <div className="font-medium text-gray-700 ">
            Tuesday, Feb 15, 2022
          </div>
          <div className="mt-2 flex items-center gap-2 bg-gray-100 p-2 rounded-xs">
            <span className="inline-block w-1 h-3 bg-amber-500 rounded-sm" />
            <span className="text-gray-700">Amount</span>
            <span className="text-gray-900 font-semibold">ETB</span>
            <span className="text-gray-900 font-bold">140K</span>
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
