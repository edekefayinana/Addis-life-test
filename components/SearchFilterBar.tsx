'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Filter, ListFilter } from 'lucide-react';

export type SortKey = 'name' | 'date' | 'email';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilterBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onFilterClick?: () => void;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
  onSortChange?: (sort: { key: SortKey; order: SortOrder }) => void;
  className?: string;
}

export default function SearchFilterBar({
  placeholder = 'Search by Unit, Project, or Client Name',
  value,
  onChange,
  onSearchSubmit,
  onFilterClick,
  sortKey,
  sortOrder,
  onSortChange,
  className = '',
}: SearchFilterBarProps) {
  const [internalValue, setInternalValue] = useState(value ?? '');
  const [openSort, setOpenSort] = useState(false);
  const [internalSort, setInternalSort] = useState<{
    key: SortKey;
    order: SortOrder;
  }>({
    key: sortKey ?? 'name',
    order: sortOrder ?? 'asc',
  });
  const sortRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close sort on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(internalValue);
  };

  const applySort = (next: { key: SortKey; order: SortOrder }) => {
    setInternalSort(next);
    onSortChange?.(next);
  };

  return (
    <div
      className={`flex items-center gap-3 flex-wrap ${className} scrollbar-hide`}
    >
      {/* Search input */}
      <form onSubmit={submitSearch} className="flex-1 min-w-[300px]">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </span>
          <input
            value={internalValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          />
        </div>
      </form>

      {/* Filter button */}
      <button
        type="button"
        onClick={onFilterClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
      </button>

      {/* Sort by button */}
      <div className="relative" ref={sortRef}>
        <button
          type="button"
          onClick={() => setOpenSort((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        >
          <ListFilter className="w-4 h-4" />
          <span>Sort by</span>
        </button>

        {openSort && (
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-200 bg-white shadow-lg p-3 z-50">
            {/* Sort key */}
            {(['email', 'name', 'date'] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => applySort({ key: k, order: internalSort.order })}
                className={`w-full text-left px-4 py-3 rounded-2xl text-gray-800 ${
                  internalSort.key === k
                    ? 'bg-gray-100 font-medium'
                    : 'hover:bg-gray-50'
                }`}
              >
                {k === 'name' ? 'Name' : k === 'email' ? 'Email' : 'Date'}
              </button>
            ))}

            <div className="my-2 border-t border-gray-200" />

            {/* Sort order */}
            {(['asc', 'desc'] as SortOrder[]).map((o) => (
              <button
                key={o}
                onClick={() => applySort({ key: internalSort.key, order: o })}
                className="w-full text-left px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-50 flex items-center gap-3"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    internalSort.order === o ? 'bg-brand-dark' : 'bg-gray-300'
                  }`}
                />
                <span className="capitalize">
                  {o === 'asc' ? 'Ascending' : 'Descending'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
