'use client';

import { Pagination } from '@/components/inventory/Pagination';
import { PropertyFilters } from '@/components/inventory/PropertyFilters';
import {
  PropertyCard,
  PropertyCardSkeleton,
} from '@/components/PropertyCardAgent';
import { PropertyCardProps } from '@/components/PropertyCardAgent';
export type Listing = PropertyCardProps;
import { PAGE_SIZE } from '@/lib/constants';
import { buildPaginationQuery } from '@/lib/utils/filters';
import { Suspense } from 'react';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function Inventory({
  location,
  propertyType,
  totalBedrooms,
  price,
  page,
}: {
  location?: string;
  propertyType?: string;
  totalBedrooms?: string;
  price?: string;
  page: number;
}) {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Build query string from all params
  const query = new URLSearchParams({
    ...(location ? { location } : {}),
    ...(propertyType ? { propertyType } : {}),
    ...(totalBedrooms ? { totalBedrooms } : {}),
    ...(price ? { price } : {}),
    page: String(page ?? 1),
  }).toString();

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const json = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL || ''}/inventory?${query}`
        );
        setData(json.data || []);
      } catch {
        setData([]);
        // Optionally, display error with Sonner or other UI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(data?.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const { skip, take } = buildPaginationQuery(safePage, PAGE_SIZE);
  const visible = data.slice(skip, skip + take);

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <main className="mx-auto flex min-h-[60vh] flex-col gap-8 pt-12 pb-16 px-12 relative">
      <Suspense
        fallback={
          <div className="h-20 w-full animate-pulse rounded-2xl border border-gray-100 bg-white/60" />
        }
      >
        <PropertyFilters />
      </Suspense>

      {loading ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <PropertyCardSkeleton key={`skeleton-${idx}`} />
          ))}
        </section>
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((property: Listing, idx) => (
              <PropertyCard key={`${property.title}-${idx}`} {...property} />
            ))}
          </section>
          <Pagination totalPages={totalPages} currentPage={safePage} />
        </>
      )}

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
