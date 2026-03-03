'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo, useTransition } from 'react';

/**
 * A generic hook for managing URL-based filters and search state.
 * T is the shape of your filter object (e.g., { role: string, search: string })
 */
export function useFilters<T extends Record<string, string | number | null>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Memoized filters object extracted from URL
  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params as unknown as T;
  }, [searchParams]);

  // 2. Generic update function
  const setFilter = useCallback(
    (key: keyof T | 'page', value: string | number | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === '') {
        params.delete(key as string);
      } else {
        params.set(key as string, String(value));
      }

      // UX Rule: Reset to page 1 whenever a filter changes (except when clicking page)
      if (key !== 'page') {
        params.set('page', '1');
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  // 3. Update multiple filters at once (useful for "Apply" buttons)
  const setFilters = useCallback(
    (updates: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      params.set('page', '1');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const hasActiveFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Page is a state, not a "filter"
    return params.size > 0;
  }, [searchParams]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    isPending,
  };
}

export type Filters = {
  location?: string;
  type?: string;
  bedrooms?: string;
  price?: string;
  bathrooms?: string;
  furnishing?: string;
  view?: 'list' | 'map';
  page?: string;
};

export function useFiltersMock() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: Filters = useMemo(
    () => ({
      location: searchParams.get('location') ?? '',
      type: searchParams.get('type') ?? '',
      bedrooms: searchParams.get('bedrooms') ?? '',
      price: searchParams.get('price') ?? '',
      bathrooms: searchParams.get('bathrooms') ?? '',
      furnishing: searchParams.get('furnishing') ?? '',
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
    filters.location ||
    filters.type ||
    filters.bedrooms ||
    filters.price ||
    filters.bathrooms ||
    filters.furnishing
  );

  return {
    filters,
    setFilter,
    clearFilter,
    hasActiveFilters,
  };
}
