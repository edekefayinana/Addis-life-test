'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CommissionsFilters } from './CommissionsFilters';
import DataTable, { StatusBadge } from '@/components/table/DataTable';
import { FilterTabs } from '@/components/FilterTabs';
import { usePagination } from '@/lib/hooks/usePagination';
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
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const searchParams = useSearchParams();
  const activeStatus = (searchParams.get('status') as Status) ?? 'all';
  const { currentPage, setPage } = usePagination();

  const handleDownload = (id: string) => {
    // TODO: Replace with real receipt download
    console.log('Download receipt for', id);
  };

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return COMMISSIONS.filter((row) => {
      const matchesStatus =
        activeStatus === 'all' ? true : row.status === activeStatus;
      if (!matchesStatus) return false;
      if (!query) return true;
      return [row.unit, row.project, row.clientName].some((f) =>
        f.toLowerCase().includes(query)
      );
    });
  }, [activeStatus, filters.search]);

  const parseAmount = (amount: string): number => {
    return parseFloat(amount.replace(/[^\d.]/g, ''));
  };

  const sortedData = useMemo(() => {
    const sorted = [...filtered];
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
          aVal = new Date(a.reservationDate).getTime();
          bVal = new Date(b.reservationDate).getTime();
          break;
        case 'amount':
          aVal = parseAmount(a.amount);
          bVal = parseAmount(b.amount);
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
  }, [filtered, filters.sortBy, filters.sortOrder]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="p-6 space-y-4">
        <CommissionsFilters filters={filters} onChange={setFilters} />

        <FilterTabs
          tabs={STATUS_TABS}
          queryKey="status"
          defaultValue="all"
          underlineClassName="bg-orange-500"
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
        pageSize={currentPage || PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={setPage}
        getRowId={(row) => row.id}
        actionsMenuItems={(row) => [
          { label: 'View Detail', onClick: () => onSelectCommission(row.id) },
          { label: 'Download Receipt', onClick: () => handleDownload(row.id) },
        ]}
      />
    </div>
  );
}
