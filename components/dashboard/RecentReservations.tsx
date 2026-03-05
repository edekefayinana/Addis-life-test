'use client';

import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { ReservationDetailPanel } from '../panels/ReservationDetailPanel';
import {
  ReservationRow,
  ReservationSkeleton,
} from '../reservations/Reservation';
import { useReservations } from '../reservations/useReservations';
import {
  RecentReservationsFilters,
  RecentReservationFilterTypes,
} from './RecentReservationsFilters';
import DataTable, { StatusBadge } from '../table/DataTable';

export function RecentReservations() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'AGENT';
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const { reservations, loading } = useReservations({
    all: userRole === 'ADMIN',
  });

  const filteredReservations = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) return reservations;
    return reservations.filter((r) =>
      [r.unit, r.project, r.clientName].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [reservations, filters.search]);

  const sortedReservations = useMemo(() => {
    const sorted = [...filteredReservations];
    const isDesc = filters.sortOrder === 'desc';

    sorted.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (filters.sortBy) {
        case 'name':
          aVal = a.clientName;
          bVal = b.clientName;
          break;
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return isDesc ? bVal - aVal : aVal - bVal;
      }

      return 0;
    });

    return sorted;
  }, [filteredReservations, filters.sortBy, filters.sortOrder]);

  const handleFiltersChange = (
    newFilters: Partial<RecentReservationFilterTypes>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const visibleReservations = sortedReservations.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <RecentReservationsFilters
        filters={filters}
        onChange={handleFiltersChange}
      />

      <div className="mt-6">
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
            data={visibleReservations}
            total={visibleReservations.length}
            getRowId={(row) => row.id}
            onRowClick={(row) => setSelectedId(row.id)}
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
