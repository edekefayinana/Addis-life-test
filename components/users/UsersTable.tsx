/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import DataTable, { Column, StatusBadge } from '@/components/table/DataTable';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { UserFilters } from './UserFilters';
import { useFilters } from '@/lib/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useDataFetch } from '@/lib/hooks/usedataFetch';
import { Suspense, useState } from 'react';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  approvalStatus?: 'PENDING' | 'APPROVED';
  propertyCount?: number;
}

function UsersContent({
  query,
  isPending,
  currentUserId,
  onRefetch,
}: {
  query: string;
  isPending: boolean;
  currentUserId?: string;
  onRefetch: () => void;
}) {
  const { isLoading, data, refetch } = useDataFetch<any>('agents', {
    queryString: query,
  });

  // Show skeleton during filter transitions
  if (isLoading || isPending) {
    return <UsersSkeleton row={PAGE_SIZE} />;
  }

  const rawUsers = data?.data || [];
  const totalRecords = data?.meta?.totalRecords || 0;

  // Exclude current user from users list
  const filteredUsers = rawUsers.filter(
    (u: User) => !(currentUserId && u.id === currentUserId)
  );

  const handleToggleApproval = async (user: User) => {
    const newStatus =
      user.approvalStatus === 'APPROVED' ? 'PENDING' : 'APPROVED';
    try {
      await fetch(`/api/agents/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: newStatus }),
        credentials: 'include',
      });
      refetch();
      onRefetch();
      toast.success(
        `User ${newStatus === 'APPROVED' ? 'approved' : 'rejected'} successfully`
      );
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    {
      key: 'propertyCount',
      header: 'Properties',
      render: (row) => row.propertyCount ?? 0,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.approvalStatus || 'pending'} />,
    },
  ];

  return (
    <>
      <DataTable
        notfoundData={
          <div className="py-12 text-center text-gray-500 text-base flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0L3 9m9 5l9-5"
              />
            </svg>
            <div>No users found.</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search or filters.
            </div>
          </div>
        }
        columns={columns}
        data={filteredUsers}
        total={totalRecords - 1} // Subtract 1 for current user
        actionsMenuItems={(row) => [
          {
            label: row.approvalStatus === 'APPROVED' ? 'Reject' : 'Approve',
            onClick: () => handleToggleApproval(row),
          },
        ]}
      />
    </>
  );
}

export default function UsersTable() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [refetchKey, setRefetchKey] = useState(0);

  const { filters, setFilters, isPending } = useFilters<{
    search: string;
    role: string;
    approvalStatus: string;
    sortBy: string;
    sortOrder: string;
    page: string;
  }>();

  // Build query string from filters and page
  const query = new URLSearchParams({
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.approvalStatus
      ? { approvalStatus: filters.approvalStatus }
      : {}),
    ...(filters.sortBy && filters.sortOrder
      ? { sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}` }
      : {}),
    page: String(filters.page ?? '1'),
    limit: String(PAGE_SIZE),
  }).toString();

  return (
    <div className="mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        <UserFilters filters={filters} onChange={setFilters} />

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <Suspense
            key={`${query}-${refetchKey}`}
            fallback={<UsersSkeleton row={PAGE_SIZE} />}
          >
            <UsersContent
              query={query}
              isPending={isPending}
              currentUserId={currentUserId}
              onRefetch={() => setRefetchKey((k) => k + 1)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function UsersSkeleton({ row = 8 }: { row?: number }) {
  const columns = [
    { header: 'Name' },
    { header: 'Email' },
    { header: 'Role' },
    { header: 'Properties' },
    { header: 'Status' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/60">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left py-3 px-4 font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: row }).map((_, rowIdx) => (
            <tr key={rowIdx} className="animate-pulse border-b border-gray-100">
              {columns.map((_, colIdx) => (
                <td key={colIdx} className="py-3 px-4">
                  <div className="h-5 w-full bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
