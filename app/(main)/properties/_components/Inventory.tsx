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

export function Inventory() {
  const { filters, setFilters, clearFilters, hasActiveFilters, isPending } =
    useFilters<{
      location: string;
      propertyType: string;
      totalBedrooms: string;
      price: string;
      view: string;
      page: string;
    }>();

  const currentView = filters.view === 'map' ? 'map' : 'list';

  // Build query string from filters and page
  const query = new URLSearchParams({
    ...(filters.location ? { search: filters.location } : {}),
    ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
    ...(filters.totalBedrooms && !isNaN(Number(filters.totalBedrooms))
      ? { totalBedrooms: String(Number(filters.totalBedrooms)) }
      : {}),
    ...(filters.price ? { price: filters.price } : {}),
    page: String(filters.page ?? '1'),
    limit: String(PAGE_SIZE),
  }).toString();

  const { isLoading, data } = useDataFetch<any>('inventory', {
    queryString: query,
  });

  if (isLoading || isPending) {
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
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <PropertyCardSkeleton key={`skeleton-${idx}`} />
          ))}
        </section>
      </main>
    );
  }

  const totalPages = data?.meta?.totalPages || 1;
  const rawProperties = data?.data?.properties || [];

  // Adapt properties to the format PropertyCard expects
  const properties = rawProperties.map(adaptPropertyData);

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
        <PropertiesMapView properties={properties} totalPages={totalPages} />
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </section>

          {properties.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No properties found. Try adjusting your filters.
            </div>
          )}

          <Pagination totalPages={totalPages} />
        </>
      )}
    </main>
  );
}
