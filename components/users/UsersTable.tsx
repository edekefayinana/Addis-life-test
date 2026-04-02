/* eslint-disable @next/next/no-img-element */
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
import { Eye } from 'lucide-react';

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  approvalStatus?: 'PENDING' | 'APPROVED';
  propertyCount?: number;
  createdAt?: string;
  governmentIdUrl?: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGovIdModalOpen, setIsGovIdModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

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

  const handleViewGovId = (user: User) => {
    setIsImageLoading(true);
    setSelectedUser(user);
    setIsGovIdModalOpen(true);
  };

  const handleCloseGovIdModal = () => {
    setIsGovIdModalOpen(false);
    setIsImageLoading(true);
    setSelectedUser(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', width: '15%' },
    { key: 'email', header: 'Email', width: '20%' },
    {
      key: 'phone',
      header: 'Phone',
      width: '12%',
      render: (row) => row.phone || 'N/A',
    },
    { key: 'role', header: 'Role', width: '10%' },
    {
      key: 'createdAt',
      header: 'Joined',
      width: '12%',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'propertyCount',
      header: 'Properties',
      width: '10%',
      align: 'center' as const,
      render: (row) => row.propertyCount ?? 0,
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
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
          ...(row.governmentIdUrl
            ? [
                {
                  label: 'View Gov ID',
                  onClick: () => handleViewGovId(row),
                },
              ]
            : []),
        ]}
      />

      {/* Government ID Modal */}
      {isGovIdModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCloseGovIdModal}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Modal Content */}
          <div
            className="relative z-50 w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Government ID
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedUser?.name} - {selectedUser?.email}
              </p>
            </div>

            {/* Image Content */}
            <div className="mt-4">
              {selectedUser?.governmentIdUrl ? (
                <div className="relative w-full">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="space-y-4 w-full p-8">
                        <div className="animate-pulse space-y-4">
                          <div className="h-64 bg-gray-300 rounded-lg"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <img
                    src={selectedUser.governmentIdUrl}
                    alt="Government ID"
                    className={`w-full h-auto rounded-lg border border-gray-200 ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <Eye className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No government ID available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseGovIdModal}
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    { header: 'Phone' },
    { header: 'Role' },
    { header: 'Joined' },
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
