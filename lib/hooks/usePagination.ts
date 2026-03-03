'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { PAGE_SIZE } from '../constants';

export function usePaginationMock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/${pathname}?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page') ?? '1');

  return {
    setPage,
    currentPage,
  };
}

/**
 * Universal Next.js Pagination Hook
 * Syncs page state with URL, preserves existing filters, and manages loading states.
 */
export function usePagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // isPending is true while the server is fetching the new page data
  const [isPending, startTransition] = useTransition();

  // 1. Get current state from URL (Source of Truth)
  const currentPage = Math.max(Number(searchParams.get('page')) || 1, 1);
  const currentLimit = Math.max(
    Number(searchParams.get('limit')) || PAGE_SIZE,
    1
  );

  // 2. Logic to update URL while keeping existing search/filter params
  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Wrap in transition to keep the current UI responsive
      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  // 3. Exposed Helper Methods
  const setPage = (page: number) => updateUrl({ page });

  const setLimit = (limit: number) => {
    // When limit changes, we usually want to go back to page 1
    updateUrl({ limit, page: 1 });
  };

  const nextPage = () => setPage(currentPage + 1);

  const prevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  return {
    currentPage,
    currentLimit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    isPending,
  };
}
