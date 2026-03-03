/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useDataFetch } from '@/lib/hooks/usedataFetch';

// type Stats = {
//   totalUnits: number;
//   totalReservations: number;
//   totalUsers: number;
//   totalProjects: number;
// };

export function StatsCards() {
  const {
    data,
    isLoading: fetchLoading,
    error: fetchError,
  } = useDataFetch<any>('/dashboard/stats');

  if (fetchLoading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse"
          >
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }
  console.log(data);

  if (fetchError || !data) {
    return (
      <div className="grid grid-cols-4 gap-6 text-red-500">
        Failed to load stats.
      </div>
    );
  }

  const cards = [
    {
      title: 'Active Reservations',
      value: data?.data?.totalReservations ?? 0,
      description: 'Active unit holds for clients',
    },
    {
      title: 'Total Projects',
      value: data?.data?.totalProjects ?? 0,
      description: 'Total number of projects',
    },
    // {
    //   title: 'Pending Commissions',
    //   value: 'ETB 85,914',
    //   description: 'Commissions Awaiting Approval',
    //   change: 'Up 5% from Previous month',
    //   isChange: true,
    // },
    // {
    //   title: 'Paid Commissions',
    //   value: 'ETB 240,183',
    //   description: 'Commission value',
    // },
    {
      title: 'Total Users',
      value: data?.data?.totalUsers ?? 0,
      description: 'Total number of registered users',
    },
    {
      title: 'Available Units',
      value: data?.data?.totalUnits ?? 0,
      description: 'Units you can Reserve',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            {stat.title}
          </h3>
          <div className="flex items-baseline justify-between">
            <div className="mb-4 text-gray-900">
              {/^([A-Z]{3})\s(.+)$/.test(String(stat.value)) ? (
                (() => {
                  const [, currency, amount] = String(stat.value).match(
                    /^([A-Z]{3})\s(.+)$/
                  ) as RegExpMatchArray;
                  return (
                    <div className="flex items-baseline">
                      <span className="text-2xl font-semibold tracking-wide">
                        {currency}
                      </span>
                      <span className="ml-2 text-4xl font-bold">{amount}</span>
                    </div>
                  );
                })()
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </div>
            {/* {stat.isChange && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>5%</span>
              </div>
            )} */}
          </div>
          <p className="text-xs text-gray-500 mt-3">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}
