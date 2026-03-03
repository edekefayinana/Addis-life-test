'use client';

import { useQuery } from '@tanstack/react-query';

interface FetchResponse<T> {
  status: string;
  results: number;
  meta?: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: T | T[];
}

export function useDataFetch<T>(
  endpoint: string,
  options?: { enabled?: boolean; queryString?: string }
) {
  return useQuery<FetchResponse<T>>({
    queryKey: [endpoint, options?.queryString], // Key changes whenever URL changes
    queryFn: async () => {
      const res = await fetch(`/api/${endpoint}?${options?.queryString}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    // Keeps previous data on screen while fetching new page (better UX)
    placeholderData: (previousData) => previousData,
  });
}
