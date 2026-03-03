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

export default function Inventory() {
  const { filters, setFilters, clearFilters, hasActiveFilters, isPending } =
    useFilters<{
      location: string;
      propertyType: string;
      totalBedrooms: string;
      price: string;
      bathrooms: string;
      furnishing: string;
      page: string;
    }>();

  // Build query string from filters and page
  const query = new URLSearchParams({
    ...(filters.location ? { location: filters.location } : {}),
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

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  if (isLoading || isPending)
    return (
      <main className="mx-auto flex min-h-[60vh] flex-col gap-8 pt-12 pb-16 px-12 relative">
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

  // Get pagination metadata from API response
  const totalPages = data?.meta?.totalPages || 1;
  const properties = data?.data?.properties || [];

  return (
    <main className="mx-auto flex min-h-[60vh] flex-col gap-8 pt-12 pb-16 px-12 relative">
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
        {properties.map((property: Listing, idx: number) => (
          <PropertyCard key={`${property.id}-${idx}`} {...property} />
        ))}
      </section>
      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found. Try adjusting your filters.
        </div>
      )}
      <Pagination totalPages={totalPages} />
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
