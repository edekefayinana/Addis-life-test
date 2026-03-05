'use client';

import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Search, ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export type CommissionFilterTypes = {
  search: string;
  sortBy: string;
  sortOrder: string;
};

type SelectOption = { value: string; label: string };

type CommissionsFiltersProps = {
  filters: Partial<CommissionFilterTypes>;
  onChange: (filters: Partial<CommissionFilterTypes>) => void;
};

export function CommissionsFilters({
  filters,
  onChange,
}: CommissionsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [showSort, setShowSort] = useState(false);

  const sortOptions: SelectOption[] = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Client Name' },
    { value: 'amount', label: 'Amount' },
  ];

  // Sync local search input with URL parameter when it changes
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Sync debounced search to parent
  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onChange({ ...filters, search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Commissions</h1>
        <p className="text-sm text-gray-600">
          Track payout status across reservations.
        </p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Unit, Project, or Client Name"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none"
          />
        </div>

        {/* Sort By Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSort(!showSort)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
              showSort
                ? 'border-gray-900 bg-gray-50 text-gray-900'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by
          </button>

          {/* Sort Dropdown */}
          {showSort && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSort(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={
                              (filters.sortBy || 'date') === option.value
                            }
                            onChange={(e) =>
                              onChange({ ...filters, sortBy: e.target.value })
                            }
                            className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                      Order
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sortOrder"
                          value="asc"
                          checked={(filters.sortOrder || 'desc') === 'asc'}
                          onChange={(e) =>
                            onChange({ ...filters, sortOrder: e.target.value })
                          }
                          className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">Ascending</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sortOrder"
                          value="desc"
                          checked={(filters.sortOrder || 'desc') === 'desc'}
                          onChange={(e) =>
                            onChange({ ...filters, sortOrder: e.target.value })
                          }
                          className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">
                          Descending
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          ...filters,
                          sortBy: 'date',
                          sortOrder: 'desc',
                        });
                        setShowSort(false);
                      }}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Reset Sort
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
