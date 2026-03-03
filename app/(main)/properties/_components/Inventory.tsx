import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Pagination } from '@/components/inventory/Pagination';
import { PropertyFilters } from '@/components/inventory/PropertyFilters';
import { PropertiesMapView } from './PropertiesMapView';
import { PropertyCard } from '@/components/PropertyCard';
import data, { Listing } from '@/data/african Union 2 site-all units';
import { useFilters } from '@/lib/hooks/useFilters';

export const metadata: Metadata = {
  title: 'Properties | Addis Life',
  description:
    'Browse premium properties and filter by location, type, status, and bedrooms.',
};

interface PropertiesPageProps {
  view?: string;
}

const PAGE_SIZE = 9;

export function InventoryPage({ view }: PropertiesPageProps) {
  const currentView = view === 'map' ? 'map' : 'list';
  const {
    filters,
    // setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    // isPending,
  } = useFilters<{
    location: string;
    propertyType: string;
    totalBedrooms: string;
    price: string;
    bathrooms: string;
    furnishing: string;
    page: string;
  }>();
  const filtered = filterListings(data, filters);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (Number(filters.page ?? 1) - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1312px] flex-col gap-8 pt-12 pb-16">
      <Suspense
        fallback={
          <div className="h-20 w-full animate-pulse rounded-2xl border border-gray-100 bg-white/60" />
        }
      >
        <PropertyFilters
          filters={filters}
          onChange={setFilters}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </Suspense>

      {currentView === 'map' ? (
        <PropertiesMapView properties={filtered} />
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((property: Listing, idx) => (
              <PropertyCard key={`${property.title}-${idx}`} {...property} />
            ))}
          </section>

          <Pagination totalPages={totalPages} />
        </>
      )}
    </main>
  );
}

function filterListings(
  listings: Listing[],
  filters: {
    location?: string;
    type?: string;
    bedrooms?: string;
    price?: string;
  }
) {
  const { location, type, bedrooms } = filters;
  return listings.filter((item) => {
    const search = location?.toLowerCase().trim();

    const matchesSearch = search
      ? item.title.toLowerCase().includes(search) ||
        item.location.address.toLowerCase().includes(search) ||
        item.location.city.toLowerCase().includes(search) ||
        item.location.country.toLowerCase().includes(search)
      : true;
    const matchesType = type
      ? item?.type?.toLowerCase().includes(type.toLowerCase())
      : true;
    const matchesBeds = bedrooms
      ? item.property_details.total_bedrooms === Number(bedrooms)
      : true;
    // No price field available in current data shape; ignore price filter for now
    const matchesPrice = true;
    return matchesSearch && matchesType && matchesBeds && matchesPrice;
  });
}
