'use client';

import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export type UserFilterTypes = {
  search: string;
  role: string;
  approvalStatus: string;
  sortBy: string;
  sortOrder: string;
};

type SelectOption = { value: string; label: string };

type UserFiltersProps = {
  filters: Partial<UserFilterTypes>;
  onChange: (filters: Partial<UserFilterTypes>) => void;
};

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const roleOptions: SelectOption[] = [
    { value: '', label: 'All' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'AGENT', label: 'Agent' },
  ];

  const approvalStatusOptions: SelectOption[] = [
    { value: '', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
  ];

  const sortOptions: SelectOption[] = [
    { value: 'createdAt', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'approvalStatus', label: 'Status' },
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage users, roles, and approval status
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Name or Email"
            className="h-11 w-full rounded-lg border border-gray-300 pl-11 pr-4 text-sm outline-none transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 h-11 px-4 rounded-lg border text-sm font-medium transition-colors',
              showFilters
                ? 'border-gray-900 bg-gray-50 text-gray-900'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                      Role
                    </label>
                    <div className="space-y-2">
                      {roleOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={(filters.role || '') === option.value}
                            onChange={(e) =>
                              onChange({ ...filters, role: e.target.value })
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
                      Approval Status
                    </label>
                    <div className="space-y-2">
                      {approvalStatusOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="approvalStatus"
                            value={option.value}
                            checked={
                              (filters.approvalStatus || '') === option.value
                            }
                            onChange={(e) =>
                              onChange({
                                ...filters,
                                approvalStatus: e.target.value,
                              })
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

                  <div className="pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          search: filters.search,
                          role: '',
                          approvalStatus: '',
                        });
                        setShowFilters(false);
                      }}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort By Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSort(!showSort)}
            className={cn(
              'flex items-center gap-2 h-11 px-4 rounded-lg border text-sm font-medium transition-colors',
              showSort
                ? 'border-gray-900 bg-gray-50 text-gray-900'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
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
                              (filters.sortBy || 'createdAt') === option.value
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
                          sortBy: 'createdAt',
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
