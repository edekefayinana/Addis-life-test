'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  Ellipsis,
  LayoutGrid,
  MapPin,
  Search,
} from 'lucide-react';

type Filters = {
  location?: string;
  type?: string;
  bedrooms?: string;
  price?: string;
  view?: 'list' | 'map';
};

const selectBase =
  'h-14 w-full appearance-none rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-300';
const selectWrapper = 'relative w-full sm:w-[150px] md:w-[170px]';

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setParam('location', (formData.get('location') as string) || null);
    setParam('type', (formData.get('type') as string) || null);
    setParam('bedrooms', (formData.get('bedrooms') as string) || null);
    setParam('price', (formData.get('price') as string) || null);
  };

  return (
    <div className="w-full space-y-3 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 md:w-[700px] lg:w-[820px]">
        <h2 className="text-xl font-semibold text-gray-900">
          Properties for Sale In Addis Ababa
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">View:</span>
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-white">
            {(['list', 'map'] as Filters['view'][]).map((view) => {
              const isActive = filters.view === view;
              const Icon = view === 'list' ? LayoutGrid : MapPin;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setParam('view', view ?? null)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-4 w-4" />
                  {view === 'list' ? 'List' : 'Map'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[260px] md:w-[360px] lg:w-[380px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="location"
              defaultValue={filters.location}
              placeholder="Search location, area"
              className="h-14 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-300"
            />
          </div>

          <div className={selectWrapper}>
            <select
              name="type"
              defaultValue={filters.type}
              className={selectBase}
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

          <div className={selectWrapper}>
            <select
              name="bedrooms"
              defaultValue={filters.bedrooms}
              className={selectBase}
            >
              <option value="">Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className={selectWrapper}>
            <select
              name="price"
              defaultValue={filters.price}
              className={selectBase}
            >
              <option value="">Price</option>
              <option value="lt-300k">$0 - $300k</option>
              <option value="300-500k">$300k - $500k</option>
              <option value="gt-500k">$500k+</option>
              <option value="rent-low">Rent: up to $2k/mo</option>
              <option value="rent-high">Rent: $2k+/mo</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300"
          >
            <Ellipsis className="h-4 w-4" />
            More
          </button>
        </div>
      </form>
    </div>
  );
}
