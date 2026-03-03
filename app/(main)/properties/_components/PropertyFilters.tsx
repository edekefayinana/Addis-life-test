'use client';

import { CustomSelect } from '@/components/ui/custom-select';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Ellipsis, LayoutGrid, MapPin, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Filters = {
  location?: string;
  propertyType?: string;
  totalBedrooms?: string;
  price?: string;
  view?: 'list' | 'map';
};

type SelectOption = {
  value: string;
  label: string;
};

type FilterField =
  | {
      key: 'location';
      type: 'search';
      placeholder: string;
      className: string;
      group: 'primary' | 'more';
    }
  | {
      key: 'propertyType' | 'totalBedrooms' | 'price';
      type: 'select';
      placeholder: string;
      options: SelectOption[];
      group: 'primary' | 'more';
    };

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function PropertyFilters({
  filters,
  onChange,
  clearFilters,
  hasActiveFilters,
}: PropertyFiltersProps) {
  const [locationInput, setLocationInput] = useState(filters.location || '');
  const debouncedLocation = useDebounce(locationInput, 300);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const moreFiltersRef = useRef<HTMLDivElement | null>(null);

  const filterFields: FilterField[] = [
    {
      key: 'location',
      type: 'search',
      placeholder: 'Search location, area',
      className: 'sm:col-span-2 lg:col-span-3',
      group: 'primary',
    },
    {
      key: 'propertyType',
      type: 'select',
      placeholder: 'Property Type',
      options: [
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'HOUSE', label: 'House' },
        { value: 'VILLA', label: 'Villa' },
        { value: 'CONDO', label: 'Condo' },
        { value: 'COMMERCIAL', label: 'Commercial' },
      ],
      group: 'primary',
    },
    {
      key: 'totalBedrooms',
      type: 'select',
      placeholder: 'Bedrooms',
      options: [
        { value: '1', label: '1 Bedroom' },
        { value: '2', label: '2 Bedrooms' },
        { value: '3', label: '3 Bedrooms' },
        { value: '4', label: '4 Bedrooms' },
        { value: '5', label: '5+ Bedrooms' },
      ],
      group: 'primary',
    },
  ];

  const hasMoreFilters = filterFields.some((field) => field.group === 'more');
  const showMoreButton = hasMoreFilters;
  const primaryFields = filterFields.filter(
    (field) => field.group === 'primary'
  );
  const moreFields = filterFields.filter((field) => field.group === 'more');

  useEffect(() => {
    if (!showMoreFilters) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (moreFiltersRef.current?.contains(target)) return;
      setShowMoreFilters(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMoreFilters(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMoreFilters]);

  // Update filter when debounced location changes
  useEffect(() => {
    if (debouncedLocation !== filters.location) {
      onChange({ location: debouncedLocation || undefined });
    }
  }, [debouncedLocation, filters.location, onChange]);

  const setFilter = (key: string, value: string | null) => {
    onChange({ [key]: value || undefined });
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Properties for Sale In Addis Ababa
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-center max-w-[185px] ml-4 gap-2 bg-gray-100 p-1.5 rounded-full shrink-0 ">
          {(['list', 'map'] as const).map((view) => {
            const isActive = filters.view === view;
            const Icon = view === 'list' ? LayoutGrid : MapPin;
            return (
              <button
                key={view}
                type="button"
                onClick={() => setFilter('view', view)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-pressed={isActive}
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">
                  {view === 'list' ? 'List' : 'Map'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Form */}
      <div className="w-full">
        <div className="bg-white rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
            {primaryFields.map((field) => {
              if (field.type === 'search') {
                return (
                  <div
                    key={field.key}
                    className={cn('relative', field.className)}
                  >
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder={field.placeholder}
                      className="h-12 w-full rounded-full border border-gray-200 pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                );
              }

              return (
                <CustomSelect
                  key={field.key}
                  options={field.options}
                  value={filters[field.key] || ''}
                  onChange={(val) => setFilter(field.key, val || null)}
                  placeholder={field.placeholder}
                />
              );
            })}

            {showMoreButton && (
              <div ref={moreFiltersRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreFilters((prev) => !prev)}
                  className="h-12 flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                  aria-expanded={showMoreFilters}
                  aria-haspopup="dialog"
                >
                  <Ellipsis className="h-4 w-4" />
                  <span>{showMoreFilters ? 'Less' : 'More'}</span>
                </button>
                {showMoreFilters && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-1 gap-3">
                      {moreFields.map((field) => {
                        if (field.type === 'search') {
                          return (
                            <div key={field.key} className="relative">
                              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={locationInput}
                                onChange={(e) =>
                                  setLocationInput(e.target.value)
                                }
                                placeholder={field.placeholder}
                                className="h-12 w-full rounded-full border border-gray-200 pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
                              />
                            </div>
                          );
                        }

                        return (
                          <CustomSelect
                            key={field.key}
                            options={field.options}
                            value={filters[field.key] || ''}
                            onChange={(val) =>
                              setFilter(field.key, val || null)
                            }
                            placeholder={field.placeholder}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
