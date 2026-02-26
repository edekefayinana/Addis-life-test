'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilterBar, {
  type SortKey,
  type SortOrder,
} from '@/components/SearchFilterBar';
import DataTable, { StatusBadge } from '@/components/table/DataTable';
import { FilterTabs } from '@/components/FilterTabs';
import { usePagination } from '@/lib/hooks/usePagination';
import { useSorting } from '@/lib/hooks/useSorting';
import { PAGE_SIZE } from '@/lib/constants';

type Status = 'all' | 'pending' | 'approved' | 'paid';

export type CommissionRow = {
  id: string;
  unit: string;
  project: string;
  clientName: string;
  amount: string;
  reservationDate: string;
  status: Status;
};

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
];

const COMMISSIONS: CommissionRow[] = [
  {
    id: '1',
    unit: 'A-304',
    project: 'Vatican site',
    clientName: 'Ahmed Elias Ali',
    amount: 'ETB 110,000',
    reservationDate: 'Dec 29, 2025',
    status: 'paid',
  },
  {
    id: '2',
    unit: 'B-311',
    project: 'Africa Union Site 1',
    clientName: 'Sara Mohammed',
    amount: 'ETB 125,000',
    reservationDate: 'Dec 12, 2025',
    status: 'pending',
  },
  {
    id: '3',
    unit: 'C-112',
    project: 'Africa Union 2 Site',
    clientName: 'Daniel Bekele',
    amount: 'ETB 120,000',
    reservationDate: 'Nov 18, 2025',
    status: 'approved',
  },
  {
    id: '4',
    unit: 'A-210',
    project: 'Sunrise Apartments',
    clientName: 'Hana Tesfaye',
    amount: 'ETB 90,000',
    reservationDate: 'Nov 14, 2025',
    status: 'approved',
  },
  {
    id: '5',
    unit: 'D-018',
    project: 'Africa Union Site 2',
    clientName: 'Yonas Alemu',
    amount: 'ETB 95,000',
    reservationDate: 'Oct 11, 2025',
    status: 'paid',
  },
  {
    id: '6',
    unit: 'B-405',
    project: 'Vatican Site',
    clientName: 'Elias Ahmed',
    amount: 'ETB 152,000',
    reservationDate: 'Oct 02, 2025',
    status: 'paid',
  },
  {
    id: '7',
    unit: 'C-223',
    project: 'Sunrise Apartments',
    clientName: 'Meron Kebede',
    amount: 'ETB 110,000',
    reservationDate: 'Sep 12, 2025',
    status: 'paid',
  },
  {
    id: '8',
    unit: 'A-118',
    project: 'Africa Union Site 1',
    clientName: 'Samuel Hassan',
    amount: 'ETB 105,000',
    reservationDate: 'Sep 12, 2025',
    status: 'pending',
  },
];

interface CommissionsTableProps {
  onSelectCommission: (id: string) => void;
}

export function CommissionsTable({
  onSelectCommission,
}: CommissionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const activeStatus = (searchParams.get('status') as Status) ?? 'all';
  const { currentPage, setPage, currentPageSize, setPageSize } =
    usePagination();

  const handleDownload = (id: string) => {
    // TODO: Replace with real receipt download
    console.log('Download receipt for', id);
  };

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return COMMISSIONS.filter((row) => {
      const matchesStatus =
        activeStatus === 'all' ? true : row.status === activeStatus;
      if (!matchesStatus) return false;
      if (!query) return true;
      return [row.unit, row.project, row.clientName].some((f) =>
        f.toLowerCase().includes(query)
      );
    });
  }, [activeStatus, searchTerm]);

  const { sortedData, sortKey, sortOrder, setSort } = useSorting<CommissionRow>(
    filtered,
    {
      defaultKey: 'date',
      sorters: {
        name: (row) => row.clientName,
        date: (row) => row.reservationDate,
      },
    }
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Commissions</h1>
          <p className="text-sm text-gray-600">
            Track payout status across reservations.
          </p>
        </div>

        <FilterTabs
          tabs={STATUS_TABS}
          queryKey="status"
          defaultValue="all"
          underlineClassName="bg-orange-500"
        />

        <SearchFilterBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Unit, Project, or Client Name"
          sortKey={sortKey as SortKey}
          sortOrder={sortOrder as SortOrder}
          onSortChange={({ key, order }) => setSort(key, order)}
        />
      </div>

      <DataTable<CommissionRow>
        className=""
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
            key: 'amount',
            header: 'Commission Amount',
            render: (r) => (
              <span className="text-gray-900 font-medium">{r.amount}</span>
            ),
          },
          {
            key: 'reservationDate',
            header: 'Reservation Date',
            render: (r) => (
              <span className="text-gray-700">{r.reservationDate}</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <StatusBadge status={r.status} />,
          },
        ]}
        data={sortedData}
        page={currentPage}
        pageSize={currentPageSize || PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        getRowId={(row) => row.id}
        actionsMenuItems={(row) => [
          { label: 'View Detail', onClick: () => onSelectCommission(row.id) },
          { label: 'Download Receipt', onClick: () => handleDownload(row.id) },
        ]}
      />
    </div>
  );
}
