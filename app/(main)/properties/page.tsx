import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PropertyFilters } from './_components/PropertyFilters';
import { Pagination } from './_components/Pagination';
import { PropertiesMapView } from './_components/PropertiesMapView';
import { PropertyCard } from '@/components/PropertyCard';
import { featuredProperties, type Listing } from '@/data/featuredProperties';

export const metadata: Metadata = {
  title: 'Properties | Addis Life',
  description:
    'Browse premium properties and filter by location, type, status, and bedrooms.',
};

interface PropertiesPageProps {
  searchParams?: Promise<{
    location?: string;
    type?: string;
    bedrooms?: string;
    price?: string;
    view?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 9;

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = await searchParams;
  const { location, type, bedrooms, price, view } = params ?? {};
  const page = Math.max(Number(params?.page ?? '1'), 1);
  const currentView = view === 'map' ? 'map' : 'list';

  const filtered = filterListings(featuredProperties, {
    location,
    type,
    bedrooms,
    price,
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1312px] flex-col gap-8 pt-12 pb-16">
      <Suspense
        fallback={
          <div className="h-20 w-full animate-pulse rounded-2xl border border-gray-100 bg-white/60" />
        }
      >
        <PropertyFilters />
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

          <Pagination totalPages={totalPages} currentPage={currentPage} />
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
  const { location, type, bedrooms, price } = filters;
  return listings.filter((item) => {
    const matchesLocation = location
      ? item.location.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchesType = type
      ? item.type?.toLowerCase().includes(type.toLowerCase())
      : true;
    const matchesBeds = bedrooms ? item.beds === Number(bedrooms) : true;
    const matchesPrice = price ? item.priceBand === price : true;
    return matchesLocation && matchesType && matchesBeds && matchesPrice;
  });
}
