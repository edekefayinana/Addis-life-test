/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense } from 'react';
import { PropertiesMapView } from './PropertiesMapView';
import { PropertyCard, PropertyCardSkeleton } from '@/components/PropertyCard';
import { useDataFetch } from '@/lib/hooks/usedataFetch';
import { useFilters } from '@/lib/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { PropertyFilters } from '@/components/inventory/PropertyFilters';
import { Pagination } from '@/components/inventory/Pagination';
import { useTranslations } from 'next-intl';

// Adapter function to convert API data to PropertyCard format
function adaptPropertyData(apiProperty: any) {
  return {
    title: apiProperty.title,
    type: apiProperty.listingType?.toLowerCase() as 'rent' | 'sale',
    overview: {
      built_start_date: apiProperty.builtStartDate,
      property_type: apiProperty.propertyType,
      current_status: apiProperty.currentStatus,
    },
    property_details: {
      total_bedrooms: apiProperty.totalBedrooms,
      total_bathrooms: apiProperty.totalBathrooms,
      parking_space: apiProperty.parkingSpace,
      area_size_m2: apiProperty.areaSizeM2,
      available_floors: apiProperty.availableFloors,
      building_size: apiProperty.buildingSize,
      delivery_time: apiProperty.deliveryTime,
    },
    amenities: apiProperty.amenities?.map((a: any) => a.name) || [],
    location_and_surroundings: {
      nearby_places: apiProperty.nearbyPlaces?.map((p: any) => p.name) || [],
    },
    location: {
      address: apiProperty.address,
      city: apiProperty.city,
      country: apiProperty.country,
      longitude: apiProperty.longitude,
      latitude: apiProperty.latitude,
    },
    images: apiProperty.images || [],
    // Keep original data for map view
    id: apiProperty.id,
    totalBedrooms: apiProperty.totalBedrooms,
    totalBathrooms: apiProperty.totalBathrooms,
    areaSizeM2: apiProperty.areaSizeM2,
    latitude: apiProperty.latitude,
    longitude: apiProperty.longitude,
  };
}

function InventoryContent({
  query,
  currentView,
  isPending,
}: {
  query: string;
  currentView: string;
  isPending: boolean;
}) {
  const t = useTranslations('properties');
  const { isLoading, data } = useDataFetch<any>('inventory', {
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

  const totalPages = data?.meta?.totalPages || 1;
  const rawProperties = data?.data?.properties || [];

  // Adapt properties to the format PropertyCard expects
  const properties = rawProperties.map(adaptPropertyData);

  if (currentView === 'map') {
    return (
      <PropertiesMapView properties={properties} totalPages={totalPages} />
    );
  }

  return (
    <>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property: any) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </section>

      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">{t('noResults')}</div>
      )}

      <Pagination totalPages={totalPages} />
    </>
  );
}

export function Inventory() {
  const { filters, setFilters, isPending } = useFilters<{
    search: string;
    propertyType: string;
    totalBedrooms: string;
    listingType: string;
    price: string;
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

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1312px] flex-col gap-8 pt-12 pb-16">
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
        />
      </Suspense>
    </main>
  );
}
