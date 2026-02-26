'use client';

import { ReservationDetailPanel } from '@/components/panels/ReservationDetailPanel';
import SearchFilterBar, {
  type SortKey,
  type SortOrder,
} from '@/components/SearchFilterBar';
import DataTable, { StatusBadge } from '@/components/table/DataTable';
import { PAGE_SIZE } from '@/lib/constants';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSorting } from '@/lib/hooks/useSorting';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useReservations } from './useReservations';

// const SEGMENTS = [
//   { label: "Clients", value: "clients" },
//   { label: "Service Provider", value: "service-provider" },
//   { label: "Admin", value: "admin" },
// ]

export type ReservationRow = {
  id: string;
  unit: string;
  project: string;
  clientName: string;
  bedrooms: string;
  date: string;
  status: string;
  segment: 'clients' | 'service-provider' | 'admin';
};
export default function Reservation() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'AGENT';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { currentPage, setPage } = usePagination();

  // Fetch reservations based on role
  const {
    reservations,
    loading,
    refetch: refetchReservations,
  } = useReservations({
    all: userRole === 'ADMIN',
  });

  // Sorting
  const { sortedData, sortKey, sortOrder, setSort } =
    useSorting<ReservationRow>(reservations, {
      defaultKey: 'date',
      sorters: {
        name: (row) => row.clientName,
        date: (row) => row.date,
      },
    });

  // Reservation actions
  const handleCancel = async (id: string) => {
    await fetch(`/api/reservations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'CANCEL' }),
    });
    refetchReservations();
  };
  const handleConfirm = async (id: string) => {
    await fetch(`/api/reservations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'CONFIRM' }),
    });
    refetchReservations();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-6 bg-white rounded-2xl p-6 border border-gray-200">
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

          {/* <FilterTabs tabs={segments} queryKey="segment" defaultValue="clients" underlineClassName="bg-orange-500" /> */}

          <SearchFilterBar
            className="mt-2"
            value={search}
            onChange={setSearch}
            placeholder="Search by Unit, Project, or Client Name"
            sortKey={sortKey as SortKey}
            sortOrder={sortOrder as SortOrder}
            onSortChange={({ key, order }) => setSort(key, order)}
          />
        </div>
        {loading ? (
          <ReservationSkeleton row={8} />
        ) : (
          <DataTable<ReservationRow>
            columns={[
              {
                key: 'checkbox',
                header: '',
                width: '48px',
                render: () => (
                  <input type="checkbox" className="rounded border-gray-300" />
                ),
              },
              {
                key: 'unit',
                header: 'Unit',
                render: (r) => (
                  <span className="font-medium text-gray-900">{r.unit}</span>
                ),
              },
              {
                key: 'project',
                header: 'Project',
                render: (r) => (
                  <span className="text-gray-600">{r.project}</span>
                ),
              },
              {
                key: 'clientName',
                header: 'Client Name',
                render: (r) => (
                  <span className="text-gray-800 font-semibold">
                    {r.clientName}
                  </span>
                ),
              },
              {
                key: 'bedrooms',
                header: 'Bedrooms',
                render: (r) => (
                  <span className="text-gray-600">{r.bedrooms}</span>
                ),
              },
              {
                key: 'date',
                header: 'Reservation Date',
                render: (r) => <span className="text-gray-700">{r.date}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusBadge status={r.status} />,
              },
            ]}
            data={sortedData}
            page={currentPage}
            pageSize={currentPage || PAGE_SIZE}
            total={reservations.length}
            onPageChange={setPage}
            onPageSizeChange={setPage}
            getRowId={(row) => row.id}
            // onRowClick={(row) => setSelectedId(row.id)}
            actionsMenuItems={(row) => {
              const actions = [
                { label: 'View Detail', onClick: () => setSelectedId(row.id) },
              ];
              if (userRole === 'ADMIN') {
                actions.push(
                  {
                    label: 'Confirm Reservation',
                    onClick: () => handleConfirm(row.id),
                  },
                  {
                    label: 'Cancel Reservation',
                    onClick: () => handleCancel(row.id),
                  }
                );
              } else if (userRole === 'AGENT') {
                actions.push({
                  label: 'Cancel Reservation',
                  onClick: () => handleCancel(row.id),
                });
              }
              return actions;
            }}
          />
        )}
      </div>

      {selectedId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <ReservationDetailPanel
            reservation={reservations.find((r) => r.id === selectedId)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );
}

export function ReservationSkeleton({ row = 8 }: { row?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Client Name</th>
            <th className="px-4 py-2">Bedrooms</th>
            <th className="px-4 py-2">Reservation Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(row)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3">
                <div className="w-5 h-5 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-28 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
