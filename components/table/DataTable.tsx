/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// Skeleton loader for DataTable
export function DataTableSkeleton<T>({
  columns,
  rowCount,
}: {
  columns: Column<T>[];
  rowCount: number;
}) {
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
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
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

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  Loader,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { JSX, useMemo } from 'react';
import { PAGE_SIZE } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type StatusColor = 'green' | 'yellow' | 'red' | 'gray';

export interface ActionsMenuItem<T> {
  label: string;
  onClick?: (row: T) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showActions?: boolean;
  actionsRender?: (row: T) => React.ReactNode;
  actionsMenuItems?: (row: T) => ActionsMenuItem<T>[];
  getRowId?: (row: T, index: number) => string;
  className?: string;
  leftHeaderSlot?: React.ReactNode;
  rightHeaderSlot?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  notfoundData?: string | React.ReactNode;
}

type StatusKey = 'all' | 'pending' | 'approved' | 'paid' | 'rejected';

const STATUS_CONFIG: Record<
  StatusKey,
  {
    textClass: string;
    bgClass: string;
    icon: JSX.Element;
  }
> = {
  all: {
    textClass: 'text-gray-700',
    bgClass: 'bg-gray-200',
    icon: <Loader2 className="w-4 h-4" />,
  },
  pending: {
    textClass: 'text-gray-700',
    bgClass: 'bg-gray-300',
    icon: <Loader className="w-4 h-4" />,
  },
  approved: {
    textClass: 'text-gray-700',
    bgClass: 'bg-green-600',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  paid: {
    textClass: 'text-gray-700',
    bgClass: 'bg-yellow-600',
    icon: <DollarSign className="w-3.5 h-3.5" />,
  },
  rejected: {
    textClass: 'text-gray-700',
    bgClass: 'bg-red-600',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

function resolveStatus(status: string): StatusKey {
  const s = status.toLowerCase();

  if (s.includes('confirm') || s.includes('approve')) return 'approved';
  if (s.includes('paid')) return 'paid';
  if (s.includes('pend')) return 'pending';
  if (s.includes('expir') || s.includes('cancel') || s.includes('reject'))
    return 'rejected';

  return 'all';
}

export function StatusBadge({ status }: { status: string }) {
  const key = resolveStatus(status);
  const { icon, bgClass, textClass } = STATUS_CONFIG[key];
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-sm ${textClass}`}
    >
      <span
        className={`flex items-center justify-center w-4 h-4 rounded-full ${bgClass} text-white`}
      >
        {icon}
      </span>

      <span className="capitalize">{status}</span>
    </span>
  );
}

export default function DataTable<T>({
  columns,
  data,
  page = 1,
  pageSize = PAGE_SIZE,
  total = data.length,
  onPageChange,
  onPageSizeChange,
  showActions = true,
  actionsRender,
  actionsMenuItems,
  getRowId,
  className = '',
  leftHeaderSlot,
  rightHeaderSlot,
  onRowClick,
  notfoundData,
}: DataTableProps<T>) {
  // Calculate total number of pages
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  // Clamp current page to valid range
  const currentPage = Math.min(pageCount, Math.max(1, page));

  // If data.length === total, assume all data is loaded client-side, so slice for pagination
  // If data.length < total, assume data is already paginated server-side, so just use data as-is
  const paginatedData = useMemo(() => {
    if (data.length === total) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return data.slice(start, end);
    }
    return data;
  }, [data, currentPage, pageSize, total]);
  // Row actions menu handled by Radix Dropdown; no manual state needed

  const goto = (p: number) => {
    const np = Math.min(pageCount, Math.max(1, p));
    onPageChange?.(np);
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-gray-200 ${className}`}
      >
        {/* Header slots */}
        {(leftHeaderSlot || rightHeaderSlot) && (
          <div className="px-6 py-4 flex items-center justify-between">
            <div>{leftHeaderSlot}</div>
            <div>{rightHeaderSlot}</div>
          </div>
        )}

        {/* Table or Not Found */}
        <div className="overflow-x-auto scrollbar-hide">
          {paginatedData.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-base">
              {notfoundData ? notfoundData : 'No data found.'}
            </div>
          ) : (
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
                  {showActions && <th className="py-3 px-4 w-10" />}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={getRowId ? getRowId(row, idx) : idx.toString()}
                    className={`${idx !== paginatedData.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      // Ignore clicks originating from interactive elements
                      if (target.closest('button, a, input, [data-row-ignore]'))
                        return;
                      onRowClick?.(row, idx);
                    }}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {col.render
                          ? col.render(row)
                          : ((row as any)[col.key] as React.ReactNode)}
                      </td>
                    ))}
                    {showActions && (
                      <td className="py-3 px-4 relative">
                        {actionsRender ? (
                          actionsRender(row)
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                aria-label="Row actions"
                                data-row-ignore
                              >
                                <MoreVertical className="w-4 h-4 text-gray-800" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              side="bottom"
                              sideOffset={8}
                              className="w-44"
                            >
                              {(actionsMenuItems
                                ? actionsMenuItems(row)
                                : [{ label: 'View Detail' }]
                              ).map((item, i) => (
                                <DropdownMenuItem
                                  key={i}
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    item.onClick?.(row);
                                  }}
                                  className="text-gray-900"
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-700">
          {/* Left side: page text + compact page size selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {pageCount}
            </span>
            <div className="relative inline-flex items-center">
              <select
                className="h-8 min-w-[3.25rem] rounded-full border border-slate-200 bg-white px-3 pr-7 text-xs sm:text-sm font-medium text-slate-800 shadow-[0_0_0_1px_rgba(15,23,42,0.04)] appearance-none focus:outline-none focus:ring-0 focus:border-sky-300"
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              >
                {[
                  PAGE_SIZE,
                  PAGE_SIZE * 2,
                  PAGE_SIZE * 3,
                  PAGE_SIZE * 4,
                  PAGE_SIZE * 5,
                ]
                  .filter((v, i, arr) => arr.indexOf(v) === i)
                  .map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-slate-700" />
            </div>
          </div>

          {/* Right side: page text + navigation buttons */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goto(1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage <= 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goto(currentPage - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goto(currentPage + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage >= pageCount}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goto(pageCount)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage >= pageCount}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
