/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type SortOrder = 'asc' | 'desc';

export interface UseSortingOptions<T> {
  /**
   * Key to use when no sort key is present in the URL.
   */
  defaultKey: string;
  /**
   * Default order when no order is present in the URL.
   */
  defaultOrder?: SortOrder;
  /**
   * Map of sort keys to accessor functions. Each accessor returns the value
   * that will be used for comparison when sorting.
   */
  sorters: Record<string, (item: T) => unknown>;
  /**
   * Query-string key for the sort field. Defaults to `sort`.
   */
  sortParamKey?: string;
  /**
   * Query-string key for the sort order. Defaults to `order`.
   */
  orderParamKey?: string;
}

export interface UseSortingResult<T> {
  /** Sorted copy of the input data based on current sort key and order. */
  sortedData: T[];
  /** Current sort key resolved from the URL or defaults. */
  sortKey: string;
  /** Current sort order (asc or desc). */
  sortOrder: SortOrder;
  /**
   * Update the sort key and optionally the order.
   * If order is omitted, it will toggle between asc/desc.
   */
  setSort: (key: string, order?: SortOrder) => void;
}

export function useSorting<T>(
  data: T[],
  {
    defaultKey,
    defaultOrder = 'asc',
    sorters,
    sortParamKey = 'sort',
    orderParamKey = 'order',
  }: UseSortingOptions<T>
): UseSortingResult<T> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const urlSortKey = searchParams.get(sortParamKey);
  const urlOrder = searchParams.get(orderParamKey) as SortOrder | null;

  const sortKey = urlSortKey && sorters[urlSortKey] ? urlSortKey : defaultKey;
  const sortOrder: SortOrder =
    urlOrder === 'desc' || urlOrder === 'asc' ? urlOrder : defaultOrder;

  const setSort = (key: string, order?: SortOrder) => {
    const nextOrder: SortOrder =
      order ??
      (key === sortKey ? (sortOrder === 'asc' ? 'desc' : 'asc') : defaultOrder);

    const params = new URLSearchParams(searchParams.toString());
    params.set(sortParamKey, key);
    params.set(orderParamKey, nextOrder);

    router.push(`${pathname}?${params.toString()}`);
  };

  const sortedData = useMemo(() => {
    const accessor = sorters[sortKey];
    if (!accessor) return data;

    const copy = [...data];

    copy.sort((a, b) => {
      const av = accessor(a) as any;
      const bv = accessor(b) as any;

      if (av == null && bv == null) return 0;
      if (av == null) return sortOrder === 'asc' ? 1 : -1;
      if (bv == null) return sortOrder === 'asc' ? -1 : 1;

      // Number comparison
      if (typeof av === 'number' && typeof bv === 'number') {
        const cmp = av - bv;
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      // Date comparison
      if (av instanceof Date || bv instanceof Date) {
        const aTime =
          av instanceof Date ? av.getTime() : new Date(av).getTime();
        const bTime =
          bv instanceof Date ? bv.getTime() : new Date(bv).getTime();
        const cmp = aTime - bTime;
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      // Fallback to string comparison
      const aStr = String(av).toString();
      const bStr = String(bv).toString();
      const cmp = aStr.localeCompare(bStr, undefined, { sensitivity: 'base' });
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return copy;
  }, [data, sortKey, sortOrder, sorters]);

  return {
    sortedData,
    sortKey,
    sortOrder,
    setSort,
  };
}
