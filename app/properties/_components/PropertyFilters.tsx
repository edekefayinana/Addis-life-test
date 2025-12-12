'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  Ellipsis,
  LayoutGrid,
  MapPin,
  Search,
  X,
} from 'lucide-react';

type Filters = {
  location?: string;
  type?: string;
  bedrooms?: string;
  price?: string;
  view?: 'list' | 'map';
};

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: Filters = useMemo(
    () => ({
      location: searchParams.get('location') ?? '',
      type: searchParams.get('type') ?? '',
      bedrooms: searchParams.get('bedrooms') ?? '',
      price: searchParams.get('price') ?? '',
      view: (searchParams.get('view') as Filters['view']) ?? 'list',
    }),
    [searchParams]
  );

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1'); // reset pagination when filters change
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilter = (key: string) => {
    setParam(key, null);
  };

  const hasActiveFilters =
    filters.location || filters.type || filters.bedrooms || filters.price;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setParam('location', (formData.get('location') as string) || null);
    setParam('type', (formData.get('type') as string) || null);
    setParam('bedrooms', (formData.get('bedrooms') as string) || null);
    setParam('price', (formData.get('price') as string) || null);
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Properties for Sale In Addis Ababa
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Find your perfect property
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full shrink-0">
          {(['list', 'map'] as Filters['view'][]).map((view) => {
            const isActive = filters.view === view;
            const Icon = view === 'list' ? LayoutGrid : MapPin;
            return (
              <button
                key={view}
                type="button"
                onClick={() => setParam('view', view ?? null)}
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

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            Active filters:
          </span>
          {filters.location && (
            <button
              onClick={() => clearFilter('location')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Location: {filters.location}
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.type && (
            <button
              onClick={() => clearFilter('type')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Type: {filters.type}
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.bedrooms && (
            <button
              onClick={() => clearFilter('bedrooms')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              {filters.bedrooms} Bedrooms
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.price && (
            <button
              onClick={() => clearFilter('price')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Price: {filters.price}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Search and Filters Form */}
      <form onSubmit={onSubmit} className="w-full">
        <div className="bg-white rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="location"
                defaultValue={filters.location}
                placeholder="Search location, area"
                className="h-12 w-full rounded-full border border-gray-200  pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Property Type */}
            <div className="relative">
              <select
                name="type"
                defaultValue={filters.type}
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
            </div>

            {/* Bedrooms */}
            <div className="relative">
              <select
                name="bedrooms"
                defaultValue={filters.bedrooms}
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
            <div className="relative">
              <select
                name="price"
                defaultValue={filters.price}
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
      </form>
    </div>
  );
}
