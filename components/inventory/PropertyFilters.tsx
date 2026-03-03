/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CustomSelect } from '@/components/ui/custom-select';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Ellipsis, Search, X, LayoutGrid, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 1. Define the specific shape for Property Filters
export type PropertyFilterTypes = {
  location: string;
  propertyType: string;
  totalBedrooms: string;
  price: string;
  bathrooms: string;
  furnishing: string;
  view: string;
};

type SelectOption = { value: string; label: string };

type FilterField =
  | {
      key: 'location';
      type: 'search';
      placeholder: string;
      className: string;
      group: 'primary' | 'more';
    }
  | {
      key: keyof Omit<PropertyFilterTypes, 'location'>;
      type: 'select';
      placeholder: string;
      options: SelectOption[];
      group: 'primary' | 'more';
    };

type PropertyFiltersProps = {
  filters: Partial<PropertyFilterTypes>;
  onChange: (filters: Partial<PropertyFilterTypes>) => void;
  clearFilters?: () => void;
  hasActiveFilters?: boolean;
};

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
        // { value: 'rent', label: 'Rent' },
        // { value: 'sale', label: 'Sale' },
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
    {
      key: 'price',
      type: 'select',
      placeholder: 'Max Price',
      options: [
        { value: '50000', label: '< 50k' },
        { value: '100000', label: '< 100k' },
      ],
      group: 'more', // This will now automatically show up in the "More" dropdown
    },
    {
      key: 'furnishing',
      type: 'select',
      placeholder: 'Furnishing',
      options: [
        { value: 'furnished', label: 'Furnished' },
        { value: 'unfurnished', label: 'Unfurnished' },
      ],
      group: 'more',
    },
  ];

  const primaryFields = filterFields.filter((f) => f.group === 'primary');
  const moreFields = filterFields.filter((f) => f.group === 'more');
  const showMoreButton = moreFields.length > 0;

  // Sync debounced search to parent
  useEffect(() => {
    if (debouncedLocation !== (filters.location || '')) {
      onChange({ ...filters, location: debouncedLocation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocation]);

  // Click outside listener for "More" menu
  useEffect(() => {
    if (!showMoreFilters) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!moreFiltersRef.current?.contains(e.target as Node))
        setShowMoreFilters(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [showMoreFilters]);

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Properties in Addis Ababa
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center justify-center max-w-[185px] gap-2 bg-gray-100 p-1.5 rounded-full shrink-0">
            {(['list', 'map'] as const).map((view) => {
              const isActive = filters.view === view;
              const Icon = view === 'list' ? LayoutGrid : MapPin;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => onChange({ ...filters, view })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="bg-white rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
            {primaryFields.map((field) =>
              field.type === 'search' ? (
                <div
                  key={field.key}
                  className={cn('relative', field.className)}
                >
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder={field.placeholder}
                    className="h-12 w-full rounded-full border border-gray-200 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-gray-900 focus:ring-4 focus:ring-gray-100"
                  />
                </div>
              ) : (
                <CustomSelect
                  key={field.key}
                  options={field.options}
                  value={filters[field.key] || ''}
                  onChange={(val) => onChange({ ...filters, [field.key]: val })}
                  placeholder={field.placeholder}
                />
              )
            )}

            {showMoreButton && (
              <div ref={moreFiltersRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className={cn(
                    'h-12 w-full flex items-center justify-center gap-1.5 rounded-full border transition-all text-sm font-medium',
                    showMoreFilters
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <Ellipsis className="h-4 w-4" />
                  <span>More</span>
                </button>

                {showMoreFilters && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in duration-200">
                    <div className="grid grid-cols-1 gap-3">
                      {moreFields.map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 ml-1 uppercase">
                            {field.key}
                          </label>
                          <CustomSelect
                            options={(field as any).options}
                            value={filters[field.key] || ''}
                            onChange={(val) =>
                              onChange({ ...filters, [field.key]: val })
                            }
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
