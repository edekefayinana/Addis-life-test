/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useDataFetch } from '@/lib/hooks/usedataFetch';

function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return d.toLocaleDateString();
}

type Activity = {
  title: string;
  description: string;
  createdAt: string | Date;
};

// type ActivitiesResponse = {
//   data: {
//     activities: Activity[];
//   };
// };

export function RecentActivity() {
  const {
    data,
    isLoading: loading,
    error,
  } = useDataFetch<any>('/dashboard/activities');

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Recent activity
        </h3>
        <div className="relative pl-6">
          <div className="absolute left-7.5 z-0 top-2 bottom-2 w-px bg-gray-200" />
          <div className="space-y-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="mt-3 inline-block w-3.5 h-3.5 rounded-full bg-gray-200 animate-pulse z-20" />
                <div className="flex-1 min-w-0">
                  <div className="h-5 w-1/3 bg-gray-100 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 text-red-500">
        Failed to load activities.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Recent activity
      </h3>
      <div className="relative pl-6">
        <div className="absolute left-7.5 z-0 top-2 bottom-2 w-px bg-gray-200" />
        <div className="space-y-6">
          {data?.data?.activities.map((activity: Activity, idx: number) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="mt-1 inline-block w-3.5 h-3.5 rounded-full bg-brand-dark z-20" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {activity.title}
                  </h4>
                  <div className="text-sm text-gray-500 flex-shrink-0">
                    {timeAgo(activity.createdAt)}
                  </div>
                </div>
                <p className="mt-2 text-base text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
