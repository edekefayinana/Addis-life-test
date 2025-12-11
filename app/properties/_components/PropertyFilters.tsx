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
  'h-13 w-full appearance-none rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm font-normal text-gray-900 outline-none transition focus:border-gray-300';
const selectWrapper = 'relative flex-1 min-w-[140px] py-2';

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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Properties for Sale In Addis Ababa
        </h1>

        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full">
          <div className="flex overflow-hidden rounded-full  bg-white">
            {(['list', 'map'] as Filters['view'][]).map((view) => {
              const isActive = filters.view === view;
              const Icon = view === 'list' ? LayoutGrid : MapPin;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setParam('view', view ?? null)}
                  className={`flex items-center  gap-1.5 px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-black rounded-full'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-50 hover:text-black'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-black' : 'text-gray-700'
                    }`}
                  />
                  {view === 'list' ? 'List' : 'Map'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-[1.6] min-w-[260px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="location"
              defaultValue={filters.location}
              placeholder="Search location, area"
              className="h-13 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-gray-300"
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
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            className="flex h-13 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Ellipsis className="h-4 w-4" />
            More
          </button>
        </div>
      </form>
    </div>
  );
}
