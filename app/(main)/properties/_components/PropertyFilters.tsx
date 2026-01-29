'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Ellipsis,
  LayoutGrid,
  MapPin,
  Search,
} from 'lucide-react';
import { useFilters } from '@/lib/hooks/useFilters';
import { useDebounce } from '@/lib/hooks/useDebounce';

type Filters = {
  location?: string;
  // type?: string;
  bedrooms?: string;
  // price?: string;
  view?: 'list' | 'map';
};

export function PropertyFilters() {
  const { filters, setFilter } = useFilters();
  const [locationInput, setLocationInput] = useState(filters.location || '');
  const debouncedLocation = useDebounce(locationInput, 300);

  // Update filter when debounced location changes
  useMemo(() => {
    if (debouncedLocation !== filters.location) {
      setFilter('location', debouncedLocation || null);
    }
  }, [debouncedLocation, filters.location, setFilter]);

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
          {(['list', 'map'] as Filters['view'][]).map((view) => {
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
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-3">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search location, area"
                className="h-12 w-full rounded-full border border-gray-200  pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Property Type */}
            {/* <div className="relative">
              <select
                value={filters.type || ''}
                onChange={(e) => setFilter('type', e.target.value || null)}
                className="h-12 w-full appearance-none rounded-full border border-gray-200  px-4 pr-10 text-sm font-medium text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="commercial">Commercial</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div> */}

            {/* Bedrooms */}
            <div className="relative">
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => setFilter('bedrooms', e.target.value || null)}
                className="h-12 w-full appearance-none rounded-full border border-gray-200  px-4 pr-10 text-sm font-medium text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Price */}
            {/* <div className="relative">
              <select
                value={filters.price || ''}
                onChange={(e) => setFilter('price', e.target.value || null)}
                className="h-12 w-full appearance-none rounded-full border border-gray-200  px-4 pr-10 text-sm font-medium text-gray-900 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
              >
                <option value="">Price Range</option>
                <option value="lt-300k">$0 - $300k</option>
                <option value="300-500k">$300k - $500k</option>
                <option value="gt-500k">$500k+</option>
                <option value="rent-low">Rent: up to $2k/mo</option>
                <option value="rent-high">Rent: $2k+/mo</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
*/}
            {/* More Button */}
            <button
              type="button"
              className="h-12 flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            >
              <Ellipsis className="h-4 w-4" />
              <span>More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
