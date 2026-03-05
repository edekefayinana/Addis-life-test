/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ReservationDetailPanel } from '@/components/panels/ReservationDetailPanel';
import DataTable, { StatusBadge } from '@/components/table/DataTable';
import { useSession } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { ReservationFilters } from './ReservationFilters';
import { useFilters } from '@/lib/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { useDataFetch } from '@/lib/hooks/usedataFetch';

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

// Adapter function to convert API data to ReservationRow format
function adaptReservationData(apiReservation: any): ReservationRow {
  return {
    id: apiReservation.id,
    unit: apiReservation.property?.title || apiReservation.propertyId,
    project: apiReservation.property?.project?.name || 'Unknown Project',
    clientName: apiReservation.user?.name || apiReservation.userId,
    bedrooms: apiReservation.property?.totalBedrooms?.toString() ?? '-',
    date: new Date(apiReservation.createdAt).toLocaleDateString(),
    status:
      apiReservation.status.charAt(0) +
      apiReservation.status.slice(1).toLowerCase(),
    segment: 'clients',
  };
}

function ReservationContent({
  query,
  isPending,
  userRole,
  onRefetch,
}: {
  query: string;
  isPending: boolean;
  userRole: string;
  onRefetch: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { isLoading, data, refetch } = useDataFetch<any>('reservations', {
    queryString: query,
  });

  // Show skeleton during filter transitions
  if (isLoading || isPending) {
    return (
      <section>
        <ReservationSkeleton row={PAGE_SIZE} />
      </section>
    );
  }

  // Get pagination metadata from API response
  const rawReservations = data?.data || [];

  // Adapt reservations to the format ReservationRow expects
  const reservations = rawReservations.map(adaptReservationData);

  // Reservation actions
  const handleCancel = async (id: string) => {
    await fetch(`/api/reservations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'CANCEL' }),
    });
    refetch();
    onRefetch();
  };

  const handleConfirm = async (id: string) => {
    await fetch(`/api/reservations`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'CONFIRM' }),
    });
    refetch();
    onRefetch();
  };

  return (
    <>
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
            render: (r) => <span className="text-gray-600">{r.bedrooms}</span>,
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
        data={reservations}
        total={data?.meta?.totalRecords || reservations.length}
        getRowId={(row) => row.id}
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

      {reservations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reservations found. Try adjusting your filters.
        </div>
      )}

      {selectedId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-stretch justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <ReservationDetailPanel
            reservation={rawReservations.find((r: any) => r.id === selectedId)}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </>
  );
}

export default function Reservation() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'AGENT';
  const [refetchKey, setRefetchKey] = useState(0);

  const { filters, setFilters, isPending } = useFilters<{
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
    page: string;
  }>();

  // Build query string from filters and page
  const query = new URLSearchParams({
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.sortBy && filters.sortOrder
      ? { sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}` }
      : {}),
    page: String(filters.page ?? '1'),
    limit: String(PAGE_SIZE),
  }).toString();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto space-y-6">
        <ReservationFilters filters={filters} onChange={setFilters} />

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <Suspense
            key={`${query}-${refetchKey}`}
            fallback={<ReservationSkeleton row={PAGE_SIZE} />}
          >
            <ReservationContent
              query={query}
              isPending={isPending}
              userRole={userRole}
              onRefetch={() => setRefetchKey((k) => k + 1)}
            />
          </Suspense>
        </div>
      </div>
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
