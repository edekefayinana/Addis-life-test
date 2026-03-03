'use client';

import { ReservationDetailPanel } from '@/components/panels/ReservationDetailPanel';
import SearchFilterBar, {
  type SortKey,
  type SortOrder,
} from '@/components/SearchFilterBar';
import DataTable, { StatusBadge } from '@/components/table/DataTable';
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
  // const { currentPage, setPage } = usePagination();
  const { currentPage, currentLimit, setPage, setLimit } = usePagination();
  // Fetch reservations based on role
  // Build query string using URLSearchParams for clarity and flexibility
  const queryParams = new URLSearchParams();
  if (search) queryParams.set('search', search);
  queryParams.set('page', String(currentPage));
  queryParams.set('limit', String(currentLimit));

  const {
    reservations,
    loading,
    refetch: refetchReservations,
  } = useReservations({
    all: userRole === 'ADMIN',
    query: queryParams.toString(),
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
          <ReservationSkeleton row={currentLimit} />
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
            pageSize={currentLimit}
            total={reservations.length} // Change this to a 'totalCount' from API if available
            onPageChange={setPage}
            onPageSizeChange={setLimit}
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
  const columns = [
    { width: 12, header: '', align: 'center' },
    { width: 12, header: 'Unit', align: 'center' },
    { width: 12, header: 'Project', align: 'center' },
    { width: 12, header: 'Client Name', align: 'center' },
    { width: 12, header: 'Bedrooms', align: 'center' },
    { width: 12, header: 'Reservation Date', align: 'center' },
    { width: 12, header: 'Status', align: 'center' },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/60">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`text-left py-3 px-4 font-semibold text-gray-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: row }).map((_, rowIdx) => (
            <tr key={rowIdx} className="animate-pulse">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`py-3 px-4`}>
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
