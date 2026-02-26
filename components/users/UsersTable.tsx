'use client';

import { FilterTabs } from '@/components/FilterTabs';
import SearchFilterBar, {
  SortKey,
  SortOrder,
} from '@/components/SearchFilterBar';
import DataTable, { Column, StatusBadge } from '@/components/table/DataTable';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  approvalStatus?: 'PENDING' | 'APPROVED';
  propertyCount?: number;
}
export default function UsersTable() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed unused setError and variable assignment
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('email');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeSegment, setActiveSegment] = useState('all');

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    fetch('/api/agents', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refresh]);

  // Map SortKey to User property
  const getUserSortValue = (user: User, key: SortKey): string | number => {
    switch (key) {
      case 'name':
        return user.name?.toLowerCase() || '';
      case 'email':
        return user.email?.toLowerCase() || '';
      default:
        return '';
    }
  };

  // Derived filtered and sorted users
  const filteredUsers = users
    .filter((u) => {
      // Exclude current user
      if (currentUserId && u.id === currentUserId) return false;
      if (activeSegment !== 'all') {
        if (activeSegment === 'pending' || activeSegment === 'approved') {
          if (u.approvalStatus?.toLowerCase() !== activeSegment) return false;
        } else {
          if (u.role?.toLowerCase() !== activeSegment) return false;
        }
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          u.name?.toLowerCase().includes(q) ||
          '' ||
          u.email?.toLowerCase().includes(q) ||
          ''
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = getUserSortValue(a, sortKey);
      const bVal = getUserSortValue(b, sortKey);
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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
      setRefresh((r) => r + 1);
      toast.success(
        `User ${newStatus === 'APPROVED' ? 'approved' : 'rejected'} successfully`
      );
    } catch {
      alert('Failed to update user status');
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
  const segments = [
    { label: 'All', value: 'all' },
    { label: 'Admins', value: 'admin' },
    { label: 'Agents', value: 'agent' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
  ];
  return (
    <div className="mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Reservations
            </h1>
            <p className="text-sm text-gray-600">
              View and manage all reservations across channels.
            </p>
          </div>
        </div>

        <FilterTabs
          tabs={segments}
          queryKey="segment"
          defaultValue="all"
          underlineClassName="bg-orange-500"
          onChange={setActiveSegment}
        />

        <SearchFilterBar
          className="mt-2"
          value={search}
          onChange={setSearch}
          placeholder="Search by Name or Email"
          sortKey={sortKey as SortKey}
          sortOrder={sortOrder as SortOrder}
          onSortChange={({ key, order }) => {
            setSortKey(key);
            setSortOrder(order);
          }}
        />
      </div>
      {loading ? (
        <div className="border rounded-md overflow-hidden animate-pulse">
          <div className="bg-gray-100 h-12 flex items-center px-4">
            <div className="w-1/5 h-6 bg-gray-200 rounded mr-4"></div>
            <div className="w-1/5 h-6 bg-gray-200 rounded mr-4"></div>
            <div className="w-1/5 h-6 bg-gray-200 rounded mr-4"></div>
            <div className="w-1/5 h-6 bg-gray-200 rounded mr-4"></div>
            <div className="w-1/5 h-6 bg-gray-200 rounded"></div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center px-4 border-t border-gray-100 h-14"
            >
              <div className="w-1/5 h-6 bg-gray-100 rounded mr-4"></div>
              <div className="w-1/5 h-6 bg-gray-100 rounded mr-4"></div>
              <div className="w-1/5 h-6 bg-gray-100 rounded mr-4"></div>
              <div className="w-1/5 h-6 bg-gray-100 rounded mr-4"></div>
              <div className="w-1/5 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
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
          actionsMenuItems={(row) => [
            {
              label: row.approvalStatus === 'APPROVED' ? 'Reject' : 'Approve',
              onClick: () => handleToggleApproval(row),
            },
          ]}
        />
      )}
    </div>
  );
}
