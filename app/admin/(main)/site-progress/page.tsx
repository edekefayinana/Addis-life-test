'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressTable from './_components/ProgressTable';

export default function SiteProgressAdminPage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/site-progress?includeAll=true', {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Expose refresh function to child components
  const handleRefresh = () => {
    setLoading(true);
    fetchProgress();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-52 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Site Progress</h1>
        <Link
          href="/admin/site-progress/new"
          className="bg-brand-dark !text-white px-4 py-2 rounded-lg hover:bg-brand-dark/90 transition-colors"
        >
          + New Progress Update
        </Link>
      </div>

      <ProgressTable progress={progress} onRefresh={handleRefresh} />
    </div>
  );
}
