import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type Filters = {
  location?: string;
  type?: string;
  bedrooms?: string;
  price?: string;
  view?: 'list' | 'map';
  page?: string;
};

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: Filters = useMemo(
    () => ({
      location: searchParams.get('location') ?? '',
      type: searchParams.get('type') ?? '',
      bedrooms: searchParams.get('bedrooms') ?? '',
      price: searchParams.get('price') ?? '',
      view: (searchParams.get('view') as Filters['view']) ?? 'list',
      page: searchParams.get('page') ?? '1',
    }),
    [searchParams]
  );

  const setFilter = <K extends keyof Filters>(
    key: K,
    value: Filters[K] | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null && value !== undefined) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    // Reset page to 1 when filters change (except for page itself)
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilter = (key: keyof Filters) => {
    setFilter(key, null);
  };

  const hasActiveFilters = Boolean(
    filters.location || filters.type || filters.bedrooms || filters.price
  );

  return {
    filters,
    setFilter,
    clearFilter,
    hasActiveFilters,
  };
}
