/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Pagination } from '@/components/inventory/Pagination';
import { PropertyFilters } from '@/components/inventory/PropertyFilters';
import {
  PropertyCard,
  PropertyCardProps,
  PropertyCardSkeleton,
} from '@/components/PropertyCardAgent';
import { PAGE_SIZE } from '@/lib/constants';
import { Suspense } from 'react';
export type Listing = PropertyCardProps;

import { useDataFetch } from '@/lib/hooks/usedataFetch';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useFilters } from '@/lib/hooks/useFilters';
import { PropertiesMapView } from '@/app/(main)/properties/_components/PropertiesMapView';

// Adapter function to convert API data to PropertyCard format
function adaptPropertyData(apiProperty: any): PropertyCardProps {
  return {
    // Direct mapping to match PropertyCardProps interface
    id: apiProperty.id,
    title: apiProperty.title,
    builtStartDate: apiProperty.builtStartDate,
    propertyType: apiProperty.propertyType,
    listingType: apiProperty.listingType,
    currentStatus: apiProperty.currentStatus,
    totalBedrooms: apiProperty.totalBedrooms,
    totalBathrooms: apiProperty.totalBathrooms,
    parkingSpace: apiProperty.parkingSpace,
    areaSizeM2: apiProperty.areaSizeM2,
    availableFloors: apiProperty.availableFloors,
    buildingSize: apiProperty.buildingSize,
    deliveryTime: apiProperty.deliveryTime,
    address: apiProperty.address,
    city: apiProperty.city,
    country: apiProperty.country,
    longitude: apiProperty.longitude,
    latitude: apiProperty.latitude,
    createdById: apiProperty.createdById,
    createdAt: apiProperty.createdAt,
    updatedAt: apiProperty.updatedAt,
    images: apiProperty.images || [],
  };
}

function InventoryContent({
  query,
  currentView,
  isPending,
  onPropertyDeleted,
}: {
  query: string;
  currentView: string;
  isPending: boolean;
  onPropertyDeleted?: () => void;
}) {
  const { isLoading, data, refetch } = useDataFetch<any>('inventory', {
    queryString: query,
  });

  // Show skeleton during filter transitions
  if (isLoading || isPending) {
    if (currentView === 'map') {
      return (
        <div className="h-[600px] w-full animate-pulse rounded-xl bg-gray-200" />
      );
    }
    return (
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
          <PropertyCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </section>
    );
  }

  // Get pagination metadata from API response
  const totalPages = data?.meta?.totalPages || 1;
  const rawProperties = data?.data?.properties || [];

  // Adapt properties to the format PropertyCard expects
  const properties = rawProperties.map(adaptPropertyData);
  console.log(properties);

  const handlePropertyDeleted = () => {
    refetch();
    onPropertyDeleted?.();
  };

  if (currentView === 'map') {
    return (
      <PropertiesMapView properties={properties} totalPages={totalPages} />
    );
  }

  return (
    <>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property: Listing, idx: number) => (
          <PropertyCard
            key={`${property.id}-${idx}`}
            {...property}
            onDeleted={handlePropertyDeleted}
          />
        ))}
      </section>
      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found. Try adjusting your filters.
        </div>
      )}
      <Pagination totalPages={totalPages} />
    </>
  );
}

export default function Inventory() {
  const { filters, setFilters, isPending } = useFilters<{
    search: string;
    propertyType: string;
    totalBedrooms: string;
    listingType: string;
    price: string;
    bathrooms: string;
    furnishing: string;
    view: string;
    page: string;
  }>();

  // Default to 'list' view if not specified
  const currentView = filters.view === 'map' ? 'map' : 'list';

  // Build query string from filters and page
  const query = new URLSearchParams({
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.listingType ? { listingType: filters.listingType } : {}),
    ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
    ...(filters.totalBedrooms && !isNaN(Number(filters.totalBedrooms))
      ? { totalBedrooms: String(Number(filters.totalBedrooms)) }
      : {}),
    ...(filters.price ? { price: filters.price } : {}),
    page: String(filters.page ?? '1'),
    limit: String(PAGE_SIZE),
  }).toString();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <main className="mx-auto flex min-h-[60vh] flex-col gap-8 pt-12 pb-16 px-12 relative">
      <PropertyFilters filters={filters} onChange={setFilters} />

      <Suspense
        key={query}
        fallback={
          currentView === 'map' ? (
            <div className="h-[600px] w-full animate-pulse rounded-xl bg-gray-200" />
          ) : (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <PropertyCardSkeleton key={`skeleton-${idx}`} />
              ))}
            </section>
          )
        }
      >
        <InventoryContent
          query={query}
          currentView={currentView}
          isPending={isPending}
          onPropertyDeleted={() => {
            // Could add additional logic here if needed
          }}
        />
      </Suspense>

      {isAdmin && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg px-6 py-3 text-lg font-bold hover:bg-primary/90 transition-all"
          aria-label="Create Property"
        >
          <Link href="/admin/inventory/new">+ Create</Link>
        </button>
      )}
    </main>
  );
}
