'use client';

import { useSorting } from '@/lib/hooks/useSorting';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { ReservationDetailPanel } from '../panels/ReservationDetailPanel';
import {
  ReservationRow,
  ReservationSkeleton,
} from '../reservations/Reservation';
import { useReservations } from '../reservations/useReservations';
import SearchFilterBar, {
  type SortKey,
  type SortOrder,
} from '../SearchFilterBar';
import DataTable, { StatusBadge } from '../table/DataTable';

export function RecentReservations() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'AGENT';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { reservations, loading } = useReservations({
    all: userRole === 'ADMIN',
  });

  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reservations;
    return reservations.filter((r) =>
      [r.unit, r.project, r.clientName].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [reservations, search]);

  const { sortedData, sortKey, sortOrder, setSort } = useSorting(
    filteredReservations,
    {
      defaultKey: 'date',
      sorters: {
        name: (row) => row.clientName,
        date: (row) => row.date,
      },
    }
  );

  const visibleReservations = sortedData.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Recent Reservations
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          View and manage all property reservations you&apos;ve made for
          clients.
        </p>
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Recent Reservations
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        View and manage all property reservations you&apos;ve made for clients.
      </p>

      <SearchFilterBar
        className="mb-4"
        value={search}
        onChange={setSearch}
        sortKey={sortKey as SortKey}
        sortOrder={sortOrder as SortOrder}
        onSortChange={({ key, order }) => setSort(key, order)}
      />

      {loading ? (
        <ReservationSkeleton row={5} />
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
              render: (r) => <span className="text-gray-600">{r.project}</span>,
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
          data={visibleReservations}
          total={visibleReservations.length}
          getRowId={(row) => row.id}
          onRowClick={(row) => setSelectedId(row.id)}
        />
      )}
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
